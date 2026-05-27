import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { aiSuggestionSchema, RATE_LIMITS } from "@/lib/security/schemas";
import { checkRateLimit, getRateLimitKey } from "@/lib/security/rateLimit";
import { sanitizeString } from "@/lib/security/sanitize";

// POST /api/ai/suggest - Generate AI-powered suggestions
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting - strict limit for AI endpoints
    const rateLimitKey = getRateLimitKey(request, "AI_SUGGEST", session.user.id);
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMITS.AI_SUGGEST);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "AI suggestion limit reached. Try again later.",
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

    // Validate input with Zod
    const validation = aiSuggestionSchema.safeParse(body);
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

    const { type, content, targetRole, industry } = validation.data;

    // Sanitize content
    const sanitizedContent = sanitizeString(content);
    const sanitizedTargetRole = targetRole ? sanitizeString(targetRole) : undefined;
    const sanitizedIndustry = industry ? sanitizeString(industry) : undefined;

    // Generate suggestion based on type
    let suggestion: string;

    switch (type) {
      case "resume":
        suggestion = generateResumeSuggestion(sanitizedContent, sanitizedTargetRole);
        break;
      case "coverLetter":
        suggestion = generateCoverLetterSuggestion(sanitizedContent, sanitizedTargetRole);
        break;
      case "linkedIn":
        suggestion = generateLinkedInSuggestion(sanitizedContent, sanitizedTargetRole);
        break;
      case "ats":
        suggestion = generateATSSuggestion(sanitizedContent, sanitizedIndustry);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid suggestion type" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      suggestion,
      type,
      remaining: rateLimitResult.remaining,
    });
  } catch (error) {
    console.error("Error generating AI suggestion:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestion" },
      { status: 500 }
    );
  }
}

function generateResumeSuggestion(content: string, targetRole?: string): string {
  const suggestions = [
    `Based on your experience, consider highlighting quantifiable achievements. Instead of "improved performance," try "reduced load time by 40% through optimized database queries."`,
    `Your resume would benefit from stronger action verbs. Replace "responsible for" with "spearheaded," "architected," or "optimized."`,
    `Add more specific technologies and tools. Employers scan for keywords like TypeScript, Docker, AWS, or Kubernetes.`,
    `Include metrics wherever possible. Numbers like "managed team of 5 engineers" or "increased revenue by 25%" grab attention.`,
    `Consider tailoring this section specifically for ${targetRole || "the target role"} by emphasizing relevant achievements.`,
  ];
  return suggestions[Math.floor(Math.random() * suggestions.length)];
}

function generateCoverLetterSuggestion(content: string, targetRole?: string): string {
  const role = targetRole || "the position";
  return `Your cover letter should open with a compelling hook that connects your background to ${role}. Research the company thoroughly and mention specific projects or values that align with your experience. Keep it concise—hiring managers scan quickly. Focus on 2-3 key achievements that demonstrate impact, using the STAR method (Situation, Task, Action, Result). Close with a clear call to action expressing your enthusiasm for an interview.`;
}

function generateLinkedInSuggestion(content: string, targetRole?: string): string {
  const suggestions = [
    `Update your headline to include both your current role and target position. Example: "Software Engineer | React Specialist | Open to Senior Frontend Roles"`,
    `Your About section should tell a story. Start with your mission, showcase key achievements with metrics, and end with what you're looking for next.`,
    `Add featured sections with your best work—GitHub projects, articles, or presentations. Visual content increases profile views significantly.`,
    `Engage consistently by commenting thoughtfully on industry posts and sharing insights. Algorithm favors active users.`,
    `Request recommendations from former managers and colleagues. Third-party validation builds credibility faster than self-promotion.`,
  ];
  return suggestions[Math.floor(Math.random() * suggestions.length)];
}

function generateATSSuggestion(content: string, industry?: string): string {
  const keywords = industry
    ? {
        technology: ["JavaScript", "TypeScript", "React", "Node.js", "AWS", "Docker", "CI/CD", "Agile"],
        healthcare: ["Patient Care", "EMR", "HIPAA", "Clinical", "Certification", "BLS", "ACLS"],
        finance: ["Financial Analysis", "Excel", "SQL", "CPA", "GAAP", "SOX", "Risk Management"],
        marketing: ["SEO", "Google Analytics", "Content Strategy", "Social Media", "Campaign Management"],
      }[industry] || ["Leadership", "Communication", "Project Management"]
    : ["Leadership", "Communication", "Project Management", "Problem Solving", "Teamwork"];

  return `Based on the job description analysis, consider adding these keywords to improve ATS compatibility: ${keywords.join(", ")}. Also, use standard section headings like "Experience" and "Education" rather than creative alternatives, and avoid tables or graphics that ATS can't parse. Mirror the exact language from the job description where appropriate.`;
}
