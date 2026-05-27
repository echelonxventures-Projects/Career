import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: jobId } = await params;
    const body = await request.json();
    const { resumeId, coverLetterId } = body;

    // Check if already applied
    const existing = await prisma.jobApplication.findUnique({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already applied to this job" },
        { status: 400 }
      );
    }

    const application = await prisma.jobApplication.create({
      data: {
        userId: session.user.id,
        jobId,
        resumeId,
        coverLetterId,
        status: "APPLIED",
      },
      include: {
        job: true,
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Error applying to job:", error);
    return NextResponse.json(
      { error: "Failed to apply" },
      { status: 500 }
    );
  }
}
