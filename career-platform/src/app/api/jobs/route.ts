import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { jobSearchSchema, RATE_LIMITS } from "@/lib/security/schemas";
import { checkRateLimit, getRateLimitKey } from "@/lib/security/rateLimit";
import { sanitizeString } from "@/lib/security/sanitize";
import { z } from "zod";

// Job search query schema
const jobQuerySchema = z.object({
  q: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  type: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP", "REMOTE"]).optional(),
  remote: z.enum(["true", "false"]).optional(),
  page: z.string().regex(/^\d+$/).optional().default("1"),
  limit: z.string().regex(/^\d+$/).optional().default("20"),
});

// GET /api/jobs - Search jobs with filtering
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request, "JOB_SEARCH");
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMITS.JOB_SEARCH);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);

    const validation = jobQuerySchema.safeParse({
      q: searchParams.get("q"),
      location: searchParams.get("location"),
      type: searchParams.get("type"),
      remote: searchParams.get("remote"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { q, location, type, remote, page, limit } = validation.data;

    // Validate pagination
    const pageNum = Math.min(Math.max(parseInt(page, 10), 1), 1000);
    const limitNum = Math.min(Math.max(parseInt(limit, 10), 1), 100);

    // Build Prisma where clause
    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (q) {
      const sanitizedQuery = sanitizeString(q).substring(0, 200);
      where.OR = [
        { title: { contains: sanitizedQuery, mode: "insensitive" } },
        { description: { contains: sanitizedQuery, mode: "insensitive" } },
        { company: { contains: sanitizedQuery, mode: "insensitive" } },
      ];
    }

    if (location) {
      where.location = {
        contains: sanitizeString(location).substring(0, 100),
        mode: "insensitive",
      };
    }

    if (type) {
      where.jobType = type;
    }

    if (remote === "true") {
      where.remote = true;
    }

    const skip = (pageNum - 1) * limitNum;

    // Get session for saved jobs check
    const session = await getServerSession(authOptions);

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { postedAt: "desc" },
      skip,
      take: limitNum,
      select: {
        id: true,
        title: true,
        company: true,
        companyLogo: true,
        location: true,
        remote: true,
        salary: true,
        jobType: true,
        description: true,
        requirements: true,
        responsibilities: true,
        benefits: true,
        postedAt: true,
        sourceUrl: true,
        savedJobs: session?.user?.id
          ? {
              where: { userId: session.user.id },
              select: { id: true },
            }
          : undefined,
      },
    });

    const total = await prisma.job.count({ where });

    // Sanitize output
    const sanitizedJobs = jobs.map((job) => ({
      id: job.id,
      title: sanitizeString(job.title),
      company: sanitizeString(job.company),
      companyLogo: job.companyLogo,
      location: job.location ? sanitizeString(job.location) : null,
      remote: job.remote,
      salary: job.salary,
      jobType: job.jobType,
      description: job.description ? sanitizeString(job.description) : null,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      benefits: job.benefits,
      postedAt: job.postedAt,
      sourceUrl: job.sourceUrl,
      isSaved: job.savedJobs && job.savedJobs.length > 0,
    }));

    return NextResponse.json({
      jobs: sanitizedJobs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a job (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Check admin role
    // For now, we'll allow any authenticated user to create jobs (for demo purposes)
    // In production, add: if (session.user.role !== "admin") return 403

    // Rate limiting
    const rateLimitKey = getRateLimitKey(request, "JOB_SEARCH", session.user.id);
    const rateLimitResult = await checkRateLimit(rateLimitKey, RATE_LIMITS.JOB_SEARCH);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
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

    // Validate job data
    const jobSchema = z.object({
      title: z.string().min(1).max(200),
      company: z.string().min(1).max(200),
      companyLogo: z.string().url().max(500).optional(),
      location: z.string().max(200).optional(),
      remote: z.boolean().default(false),
      salary: z.string().max(100).optional(),
      jobType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP", "REMOTE"]),
      description: z.string().max(10000).optional(),
      requirements: z.array(z.string().max(500)).max(50).optional(),
      responsibilities: z.array(z.string().max(500)).max(50).optional(),
      benefits: z.array(z.string().max(200)).max(30).optional(),
      source: z.string().max(100).optional(),
      sourceUrl: z.string().url().max(1000).optional(),
      externalId: z.string().max(200).optional(),
    });

    const validation = jobSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Create job with sanitized data
    const job = await prisma.job.create({
      data: {
        title: sanitizeString(data.title),
        company: sanitizeString(data.company),
        companyLogo: data.companyLogo,
        location: data.location ? sanitizeString(data.location) : null,
        remote: data.remote,
        salary: data.salary,
        jobType: data.jobType as import("@prisma/client").JobType,
        description: data.description ? sanitizeString(data.description) : "",
        requirements: data.requirements,
        responsibilities: data.responsibilities,
        benefits: data.benefits,
        source: data.source || "manual",
        sourceUrl: data.sourceUrl,
        externalId: data.externalId,
        postedAt: new Date(),
        isActive: true,
      },
    });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
