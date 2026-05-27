import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { resumeSchema, RATE_LIMITS } from "@/lib/security/schemas";
import { checkRateLimit, getRateLimitKey } from "@/lib/security/rateLimit";
import { sanitizeString } from "@/lib/security/sanitize";

// GET /api/resumes - Get all resumes for current user
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimitKey = getRateLimitKey(request, "RESUME_GENERATE", session.user.id);
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMITS.JOB_SEARCH);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        template: true,
        createdAt: true,
        updatedAt: true,
        personalInfo: true,
      },
    });

    // Sanitize output
    const sanitizedResumes = resumes.map((resume) => ({
      ...resume,
      title: sanitizeString(resume.title),
    }));

    return NextResponse.json({ resumes: sanitizedResumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

// POST /api/resumes - Create a new resume
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimitKey = getRateLimitKey(request, "RESUME_GENERATE", session.user.id);
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMITS.RESUME_GENERATE);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    // Parse and validate body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    // Validate with Zod schema
    const validation = resumeSchema.safeParse(body);
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

    const { title, template, content } = validation.data;

    // Sanitize input
    const sanitizedTitle = sanitizeString(title);

    // Check user's resume count limit (max 100 per user)
    const existingCount = await prisma.resume.count({
      where: { userId: session.user.id },
    });

    if (existingCount >= 100) {
      return NextResponse.json(
        { error: "Resume limit reached. Maximum 100 resumes allowed." },
        { status: 403 }
      );
    }

    // Create resume with validated data
    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        title: sanitizedTitle,
        template,
        personalInfo: content.personalInfo,
        experience: content.experience,
        education: content.education,
        skills: content.skills,
        projects: content.projects,
        certifications: content.certifications,
        languages: content.languages,
        awards: content.awards,
      },
    });

    return NextResponse.json({ resume }, { status: 201 });
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    );
  }
}

// PUT /api/resumes - Update a resume
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimitKey = getRateLimitKey(request, "RESUME_GENERATE", session.user.id);
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMITS.RESUME_GENERATE);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    // Parse and validate body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { id, ...updateData } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    // Validate update data with partial schema
    const validation = resumeSchema.partial().safeParse(updateData);
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

    // Verify ownership
    const existingResume = await prisma.resume.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingResume) {
      return NextResponse.json(
        { error: "Resume not found or unauthorized" },
        { status: 404 }
      );
    }

    // Sanitize and update
    const updatePayload: Record<string, unknown> = {};

    if (validation.data.title) {
      updatePayload.title = sanitizeString(validation.data.title);
    }
    if (validation.data.template) {
      updatePayload.template = validation.data.template;
    }
    if (validation.data.content) {
      const content = validation.data.content;
      updatePayload.personalInfo = content.personalInfo;
      updatePayload.experience = content.experience;
      updatePayload.education = content.education;
      updatePayload.skills = content.skills;
      if (content.projects) updatePayload.projects = content.projects;
      if (content.certifications) updatePayload.certifications = content.certifications;
      if (content.languages) updatePayload.languages = content.languages;
    }

    const resume = await prisma.resume.update({
      where: { id },
      data: updatePayload,
    });

    return NextResponse.json({ resume });
  } catch (error) {
    console.error("Error updating resume:", error);
    return NextResponse.json(
      { error: "Failed to update resume" },
      { status: 500 }
    );
  }
}

// DELETE /api/resumes - Delete a resume
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    const { id } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Resume ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership before deletion
    const existingResume = await prisma.resume.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingResume) {
      return NextResponse.json(
        { error: "Resume not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.resume.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json(
      { error: "Failed to delete resume" },
      { status: 500 }
    );
  }
}
