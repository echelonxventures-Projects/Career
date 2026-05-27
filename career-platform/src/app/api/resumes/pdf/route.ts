import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { RATE_LIMITS } from "@/lib/security/schemas";
import { checkRateLimit, getRateLimitKey } from "@/lib/security/rateLimit";
import { sanitizeString, sanitizeUrl } from "@/lib/security/sanitize";
import { z } from "zod";

// PDF generation request schema
const pdfSchema = z.object({
  resumeId: z.string().optional(),
  template: z.enum([
    "modern", "professional", "minimal", "creative", "executive",
    "technical", "academic", "federal", "ats-friendly"
  ]),
  data: z.object({
    personalInfo: z.object({
      firstName: z.string().max(100).optional(),
      lastName: z.string().max(100).optional(),
      email: z.string().email().max(254).optional(),
      phone: z.string().max(50).optional(),
      location: z.string().max(200).optional(),
      summary: z.string().max(5000).optional(),
      website: z.string().url().max(500).optional(),
      linkedIn: z.string().max(200).optional(),
    }).optional(),
    experience: z.array(z.object({
      title: z.string().max(200),
      company: z.string().max(200),
      location: z.string().max(200).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      current: z.boolean().optional(),
      description: z.string().max(5000).optional(),
    })).optional(),
    education: z.array(z.object({
      school: z.string().max(200),
      degree: z.string().max(200),
      field: z.string().max(200).optional(),
      location: z.string().max(200).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      gpa: z.string().max(10).optional(),
    })).optional(),
    skills: z.array(z.string().max(100)).optional(),
    projects: z.array(z.object({
      name: z.string().max(200),
      description: z.string().max(5000).optional(),
      technologies: z.array(z.string().max(100)).optional(),
      link: z.string().url().max(500).optional(),
    })).optional(),
    certifications: z.array(z.object({
      name: z.string().max(200),
      issuer: z.string().max(200).optional(),
      date: z.string().optional(),
    })).optional(),
    languages: z.array(z.object({
      name: z.string().max(100),
      proficiency: z.string().max(50).optional(),
    })).optional(),
    awards: z.array(z.object({
      title: z.string().max(200),
      issuer: z.string().max(200).optional(),
      date: z.string().optional(),
    })).optional(),
  }),
});

// POST /api/resumes/pdf - Generate PDF from resume
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting for PDF generation
    const rateLimitKey = getRateLimitKey(request, "PDF_EXPORT", session.user.id);
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMITS.PDF_EXPORT);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "PDF generation rate limit exceeded",
          retryAfter: rateLimitResult.retryAfter,
        },
        { status: 429 }
      );
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // Validate request
    const validation = pdfSchema.safeParse(body);
    if (!validation.success) {
      const errors = validation.error.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }));
      return NextResponse.json(
        { error: "Validation failed", details: errors },
        { status: 400 }
      );
    }

    const { resumeId, template, data } = validation.data;

    // If resumeId provided, verify ownership
    if (resumeId) {
      const resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId: session.user.id,
        },
      });

      if (!resume) {
        return NextResponse.json(
          { error: "Resume not found or unauthorized" },
          { status: 404 }
        );
      }
    }

    // Sanitize all data before generating HTML
    const sanitizedData = {
      personalInfo: {
        firstName: data.personalInfo?.firstName ? sanitizeString(data.personalInfo.firstName) : "",
        lastName: data.personalInfo?.lastName ? sanitizeString(data.personalInfo.lastName) : "",
        email: data.personalInfo?.email ? sanitizeString(data.personalInfo.email) : "",
        phone: data.personalInfo?.phone ? sanitizeString(data.personalInfo.phone) : "",
        location: data.personalInfo?.location ? sanitizeString(data.personalInfo.location) : "",
        summary: data.personalInfo?.summary ? sanitizeString(data.personalInfo.summary) : "",
        website: data.personalInfo?.website ? sanitizeUrl(data.personalInfo.website) : "",
        linkedIn: data.personalInfo?.linkedIn ? sanitizeString(data.personalInfo.linkedIn) : "",
      },
      experience: (data.experience || []).map((exp) => ({
        title: sanitizeString(exp.title),
        company: sanitizeString(exp.company),
        location: exp.location ? sanitizeString(exp.location) : "",
        startDate: exp.startDate || "",
        endDate: exp.endDate || "",
        current: exp.current || false,
        description: exp.description ? sanitizeString(exp.description) : "",
      })),
      education: (data.education || []).map((edu) => ({
        school: sanitizeString(edu.school),
        degree: sanitizeString(edu.degree),
        field: edu.field ? sanitizeString(edu.field) : "",
        location: edu.location ? sanitizeString(edu.location) : "",
        startDate: edu.startDate || "",
        endDate: edu.endDate || "",
        gpa: edu.gpa || "",
      })),
      skills: (data.skills || []).map((skill) => sanitizeString(skill)),
      projects: (data.projects || []).map((proj) => ({
        name: sanitizeString(proj.name),
        description: proj.description ? sanitizeString(proj.description) : "",
        technologies: (proj.technologies || []).map((t) => sanitizeString(t)),
        link: proj.link ? sanitizeUrl(proj.link) : "",
      })),
      certifications: (data.certifications || []).map((cert) => ({
        name: sanitizeString(cert.name),
        issuer: cert.issuer ? sanitizeString(cert.issuer) : "",
        date: cert.date || "",
      })),
      languages: (data.languages || []).map((lang) => ({
        name: sanitizeString(lang.name),
        proficiency: lang.proficiency ? sanitizeString(lang.proficiency) : "",
      })),
      awards: (data.awards || []).map((award) => ({
        title: sanitizeString(award.title),
        issuer: award.issuer ? sanitizeString(award.issuer) : "",
        date: award.date || "",
      })),
    };

    // Generate HTML based on template
    const html = generateResumeHTML(template, sanitizedData);

    return NextResponse.json({
      html,
      template,
      remaining: rateLimitResult.remaining,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

function generateResumeHTML(
  template: string,
  data: {
    personalInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      location: string;
      summary: string;
      website: string | null;
      linkedIn: string;
    };
    experience: Array<{
      title: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      description: string;
    }>;
    education: Array<{
      school: string;
      degree: string;
      field: string;
      location: string;
      startDate: string;
      endDate: string;
      gpa: string;
    }>;
    skills: string[];
    projects: Array<{
      name: string;
      description: string;
      technologies: string[];
      link: string | null;
    }>;
    certifications: Array<{
      name: string;
      issuer: string;
      date: string;
    }>;
    languages: Array<{
      name: string;
      proficiency: string;
    }>;
    awards: Array<{
      title: string;
      issuer: string;
      date: string;
    }>;
  }
) {
  const { personalInfo, experience, education, skills, projects, certifications, languages, awards } = data;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Escape HTML to prevent XSS in PDF generation
  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  };

  // Template-specific styles
  const getStyles = () => {
    const baseStyles = {
      modern: `
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
        h1 { font-size: 28px; margin-bottom: 8px; color: #1a1a1a; }
        h2 { font-size: 16px; border-bottom: 2px solid #4f46e5; padding-bottom: 4px; margin-top: 24px; color: #1a1a1a; }
        h3 { font-size: 14px; margin-bottom: 4px; color: #374151; }
        .contact { margin-bottom: 16px; font-size: 13px; color: #6b7280; }
        .section { margin-bottom: 20px; }
        .item { margin-bottom: 16px; }
        .header { display: flex; justify-content: space-between; align-items: baseline; }
        .date { font-size: 13px; color: #6b7280; }
        .subtitle { font-size: 13px; color: #6b7280; margin-bottom: 4px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
      `,
      professional: `
        body { font-family: Georgia, serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
        h1 { font-size: 28px; margin-bottom: 8px; border-bottom: 1px solid #333; padding-bottom: 8px; }
        h2 { font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 4px; margin-top: 24px; }
        h3 { font-size: 14px; margin-bottom: 4px; }
        .contact { margin-bottom: 16px; font-size: 13px; color: #666; }
        .section { margin-bottom: 20px; }
        .item { margin-bottom: 16px; }
        .header { display: flex; justify-content: space-between; align-items: baseline; }
        .date { font-size: 13px; color: #666; font-style: italic; }
        .subtitle { font-size: 13px; color: #666; margin-bottom: 4px; }
        .skills { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill { background: #f5f5f5; padding: 2px 8px; border-radius: 4px; font-size: 12px; border: 1px solid #ddd; }
      `,
      minimal: `
        body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 40px; }
        h1 { font-size: 24px; margin-bottom: 8px; font-weight: 300; }
        h2 { font-size: 14px; margin-top: 24px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        h3 { font-size: 13px; margin-bottom: 2px; }
        .contact { margin-bottom: 16px; font-size: 12px; color: #666; }
        .section { margin-bottom: 16px; }
        .item { margin-bottom: 12px; }
        .header { display: flex; justify-content: space-between; align-items: baseline; }
        .date { font-size: 12px; color: #999; }
        .subtitle { font-size: 12px; color: #666; margin-bottom: 2px; }
        .skills { display: flex; flex-wrap: wrap; gap: 4px; }
        .skill { padding: 1px 6px; font-size: 11px; color: #666; }
      `,
      ats: `
        body { font-family: Arial, sans-serif; line-height: 1.5; color: #000; max-width: 800px; margin: 0 auto; padding: 40px; }
        h1 { font-size: 24px; margin-bottom: 8px; }
        h2 { font-size: 14px; margin-top: 20px; text-transform: uppercase; }
        h3 { font-size: 12px; margin-bottom: 2px; }
        .contact { margin-bottom: 12px; font-size: 11px; }
        .section { margin-bottom: 16px; }
        .item { margin-bottom: 10px; }
        .header { display: flex; justify-content: space-between; align-items: baseline; }
        .date { font-size: 11px; }
        .subtitle { font-size: 11px; margin-bottom: 2px; }
        .skills { font-size: 11px; }
      `,
    };

    return baseStyles[template as keyof typeof baseStyles] || baseStyles.professional;
  };

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${getStyles()}</style>
</head>
<body>
  <h1>${escapeHtml(personalInfo.firstName)} ${escapeHtml(personalInfo.lastName)}</h1>
  <div class="contact">
    ${[personalInfo.email, personalInfo.phone, personalInfo.location]
      .filter(Boolean)
      .join(" | ")}
    ${personalInfo.website ? ` | ${escapeHtml(personalInfo.website)}` : ""}
    ${personalInfo.linkedIn ? ` | ${escapeHtml(personalInfo.linkedIn)}` : ""}
  </div>
  ${personalInfo.summary ? `<div class="section">${escapeHtml(personalInfo.summary).replace(/\n/g, "<br>")}</div>` : ""}

  ${experience.length > 0 ? `
  <div class="section">
    <h2>Work Experience</h2>
    ${experience.map((exp) => `
      <div class="item">
        <div class="header">
          <h3>${escapeHtml(exp.title)}</h3>
          <span class="date">${formatDate(exp.startDate)} - ${exp.current ? "Present" : formatDate(exp.endDate)}</span>
        </div>
        <div class="subtitle">${escapeHtml(exp.company)}${exp.location ? `, ${escapeHtml(exp.location)}` : ""}</div>
        ${exp.description ? `<div>${escapeHtml(exp.description).replace(/\n/g, "<br>")}</div>` : ""}
      </div>
    `).join("")}
  </div>
  ` : ""}

  ${education.length > 0 ? `
  <div class="section">
    <h2>Education</h2>
    ${education.map((edu) => `
      <div class="item">
        <div class="header">
          <h3>${escapeHtml(edu.school)}</h3>
          <span class="date">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</span>
        </div>
        <div class="subtitle">${escapeHtml(edu.degree)}${edu.field ? ` in ${escapeHtml(edu.field)}` : ""}${edu.gpa ? ` (GPA: ${escapeHtml(edu.gpa)})` : ""}</div>
      </div>
    `).join("")}
  </div>
  ` : ""}

  ${skills.length > 0 ? `
  <div class="section">
    <h2>Skills</h2>
    <div class="skills">
      ${skills.map((skill) => `<span class="skill">${escapeHtml(skill)}</span>`).join("")}
    </div>
  </div>
  ` : ""}

  ${certifications.length > 0 ? `
  <div class="section">
    <h2>Certifications</h2>
    ${certifications.map((cert) => `
      <div>${escapeHtml(cert.name)}${cert.issuer ? `, ${escapeHtml(cert.issuer)}` : ""}${cert.date ? ` (${formatDate(cert.date)})` : ""}</div>
    `).join("")}
  </div>
  ` : ""}

  ${languages.length > 0 ? `
  <div class="section">
    <h2>Languages</h2>
    <div>${languages.map((lang) => `${escapeHtml(lang.name)}${lang.proficiency ? ` (${escapeHtml(lang.proficiency)})` : ""}`).join(", ")}</div>
  </div>
  ` : ""}

  ${awards.length > 0 ? `
  <div class="section">
    <h2>Awards</h2>
    ${awards.map((award) => `
      <div>${escapeHtml(award.title)}${award.issuer ? `, ${escapeHtml(award.issuer)}` : ""}${award.date ? ` (${formatDate(award.date)})` : ""}</div>
    `).join("")}
  </div>
  ` : ""}

  ${projects.length > 0 ? `
  <div class="section">
    <h2>Projects</h2>
    ${projects.map((proj) => `
      <div class="item">
        <h3>${escapeHtml(proj.name)}${proj.link ? ` (${escapeHtml(proj.link)})` : ""}</h3>
        ${proj.technologies.length > 0 ? `<div class="subtitle">${proj.technologies.map((t) => escapeHtml(t)).join(", ")}</div>` : ""}
        ${proj.description ? `<div>${escapeHtml(proj.description).replace(/\n/g, "<br>")}</div>` : ""}
      </div>
    `).join("")}
  </div>
  ` : ""}
</body>
</html>`;
}
