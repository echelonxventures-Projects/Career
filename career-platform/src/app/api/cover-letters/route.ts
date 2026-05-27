import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { coverLetterSchema, RATE_LIMITS } from "@/lib/security/schemas";
import { checkRateLimit, getRateLimitKey } from "@/lib/security/rateLimit";
import { sanitizeString } from "@/lib/security/sanitize";

// GET /api/cover-letters - Get all cover letters
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting
    const rateLimitKey = getRateLimitKey(request, "COVER_LETTER_GENERATE", session.user.id);
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMITS.JOB_SEARCH);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    const coverLetters = await prisma.coverLetter.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        jobTitle: true,
        company: true,
        createdAt: true,
        updatedAt: true,
        template: true,
      },
    });

    // Sanitize output
    const sanitizedLetters = coverLetters.map((letter) => ({
      ...letter,
      jobTitle: letter.jobTitle ? sanitizeString(letter.jobTitle) : null,
      company: letter.company ? sanitizeString(letter.company) : null,
    }));

    return NextResponse.json({ coverLetters: sanitizedLetters });
  } catch (error) {
    console.error("Error fetching cover letters:", error);
    return NextResponse.json(
      { error: "Failed to fetch cover letters" },
      { status: 500 }
    );
  }
}

// POST /api/cover-letters - Create a cover letter
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting - strict for AI generation
    const rateLimitKey = getRateLimitKey(request, "COVER_LETTER_GENERATE", session.user.id);
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMITS.COVER_LETTER_GENERATE);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
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

    // Validate with Zod
    const validation = coverLetterSchema.safeParse(body);
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

    const data = validation.data;

    // Check user's cover letter limit (max 50 per user)
    const existingCount = await prisma.coverLetter.count({
      where: { userId: session.user.id },
    });

    if (existingCount >= 50) {
      return NextResponse.json(
        { error: "Cover letter limit reached. Maximum 50 cover letters allowed." },
        { status: 403 }
      );
    }

    // Generate cover letter content using AI
    const generatedContent = generateCoverLetter(data);

    // Create cover letter with sanitized data
    const coverLetter = await prisma.coverLetter.create({
      data: {
        userId: session.user.id,
        title: sanitizeString(data.jobTitle),
        jobTitle: sanitizeString(data.jobTitle),
        company: sanitizeString(data.company),
        body: generatedContent,
        template: data.template,
        isAiGenerated: true,
      },
    });

    return NextResponse.json({
      coverLetter: {
        id: coverLetter.id,
        jobTitle: coverLetter.jobTitle ? sanitizeString(coverLetter.jobTitle) : null,
        company: coverLetter.company ? sanitizeString(coverLetter.company) : null,
        content: coverLetter.body,
        template: coverLetter.template,
        createdAt: coverLetter.createdAt,
      },
      remaining: rateLimitResult.remaining,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating cover letter:", error);
    return NextResponse.json(
      { error: "Failed to create cover letter" },
      { status: 500 }
    );
  }
}

// PUT /api/cover-letters - Update a cover letter
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        { error: "Cover letter ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingLetter = await prisma.coverLetter.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingLetter) {
      return NextResponse.json(
        { error: "Cover letter not found or unauthorized" },
        { status: 404 }
      );
    }

    // Validate and sanitize update data
    const validation = coverLetterSchema.partial().safeParse(updateData);
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

    const data = validation.data;
    const updatePayload: Record<string, unknown> = {};

    if (data.jobTitle) {
      updatePayload.jobTitle = sanitizeString(data.jobTitle);
      updatePayload.title = sanitizeString(data.jobTitle);
    }
    if (data.company) updatePayload.company = sanitizeString(data.company);
    if (data.template) updatePayload.template = data.template;

    // Regenerate content if relevant fields changed
    if (data.jobTitle || data.company || data.customParagraphs) {
      updatePayload.body = generateCoverLetter({
        ...existingLetter,
        ...data,
      });
    }

    const coverLetter = await prisma.coverLetter.update({
      where: { id },
      data: updatePayload,
    });

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error("Error updating cover letter:", error);
    return NextResponse.json(
      { error: "Failed to update cover letter" },
      { status: 500 }
    );
  }
}

// DELETE /api/cover-letters - Delete a cover letter
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
        { error: "Cover letter ID is required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingLetter = await prisma.coverLetter.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingLetter) {
      return NextResponse.json(
        { error: "Cover letter not found or unauthorized" },
        { status: 404 }
      );
    }

    await prisma.coverLetter.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting cover letter:", error);
    return NextResponse.json(
      { error: "Failed to delete cover letter" },
      { status: 500 }
    );
  }
}

// Generate cover letter content
function generateCoverLetter(data: {
  jobTitle?: string | null;
  company?: string | null;
  hiringManager?: string | null;
  jobDescription?: string | null;
  template?: string;
}): string {
  const jobTitle = data.jobTitle || "the position";
  const company = data.company || "your company";
  const salutation = data.hiringManager
    ? `Dear ${data.hiringManager},`
    : "Dear Hiring Manager,";

  const templates: Record<string, string> = {
    professional: `${salutation}

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With my background and expertise, I am confident I would be a valuable addition to your team.

Throughout my career, I have developed strong skills and demonstrated the ability to deliver high-quality results. I am particularly drawn to ${company}'s mission and reputation for excellence in the industry.

I would welcome the opportunity to discuss how my experience and skills align with your needs. Thank you for considering my application.

Sincerely,

[Your Name]`,

    modern: `${salutation}

I'm excited to apply for the ${jobTitle} role at ${company}.

My experience has prepared me to contribute effectively to your team from day one. I'm passionate about creating impact and thrive in collaborative environments.

${company}'s innovative approach aligns perfectly with my career goals, and I would love the opportunity to discuss how I can contribute to your continued success.

Best regards,

[Your Name]`,

    enthusiastic: `${salutation}

I am thrilled to submit my application for the ${jobTitle} position at ${company}! This opportunity perfectly aligns with my career aspirations and passion for excellence.

I have been following ${company}'s journey and have been incredibly impressed by your commitment to innovation and quality. I am confident that my skills and enthusiasm would make me a perfect fit for your team.

I would be honored to discuss how my background and passion can contribute to your continued success.

With excitement,

[Your Name]`,

    concise: `${salutation}

I am applying for the ${jobTitle} position at ${company}.

My experience includes [key relevant experience]. I am skilled in [relevant skills] and have achieved [quantifiable results].

I am confident I can contribute to ${company}'s success and would welcome an interview.

Sincerely,

[Your Name]`,
  };

  return templates[data.template || "professional"] || templates.professional;
}
