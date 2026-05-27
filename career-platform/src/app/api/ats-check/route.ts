import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { resumeText, resumeId, jobDescription } = body;

    if (!resumeText && !resumeId) {
      return NextResponse.json(
        { error: "Resume text or ID is required" },
        { status: 400 }
      );
    }

    if (!jobDescription) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Use NLP to extract keywords from job description
    // 2. Compare against resume text
    // 3. Calculate scores based on matches
    // 4. Generate suggestions using AI

    // For demo, we'll use a simple keyword extraction and scoring
    const jobKeywords = extractKeywords(jobDescription);
    const resumeContent = resumeText.toLowerCase();
    const matched: string[] = [];
    const missing: string[] = [];

    jobKeywords.forEach((keyword) => {
      if (resumeContent.includes(keyword.toLowerCase())) {
        matched.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    // Calculate scores
    const keywordScore = Math.min(100, Math.round((matched.length / Math.max(jobKeywords.length * 0.7, 1)) * 100));
    const formattingScore = 85; // Would analyze actual formatting
    const contentScore = 75; // Would analyze content quality
    const skillsScore = Math.min(100, matched.length * 15);

    const overallScore = Math.round((keywordScore + formattingScore + contentScore + skillsScore) / 4);

    const result = {
      overallScore,
      sectionScores: {
        keywords: keywordScore,
        formatting: formattingScore,
        content: contentScore,
        skills: skillsScore,
      },
      keywordMatches: {
        matched,
        missing,
      },
      suggestions: generateSuggestions(overallScore, missing.length, matched.length),
      improvements: generateImprovements(missing),
    };

    // Save the ATS check
    await prisma.aTSCheck.create({
      data: {
        userId: session.user.id,
        resumeId: resumeId || null,
        jobDescription,
        overallScore,
        sectionScores: result.sectionScores,
        keywordMatches: result.keywordMatches,
        suggestions: result.suggestions,
        improvements: result.improvements,
      },
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume" },
      { status: 500 }
    );
  }
}

function extractKeywords(text: string): string[] {
  // Simple keyword extraction - in production, use proper NLP
  const commonSkills = [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust",
    "React", "Vue", "Angular", "Node.js", "Express", "Django", "Flask",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform",
    "Git", "CI/CD", "Jenkins", "GitHub Actions", "GitLab CI",
    "Agile", "Scrum", "Kanban", "Jira", "Confluence",
    "REST API", "GraphQL", "gRPC", "WebSocket",
    "Machine Learning", "AI", "Data Science", "Analytics",
    "Leadership", "Communication", "Problem Solving", "Team Management",
  ];

  return commonSkills.filter((skill) =>
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function generateSuggestions(score: number, missingCount: number, matchedCount: number): string[] {
  const suggestions: string[] = [];

  if (score < 60) {
    suggestions.push("Your resume needs significant improvements to match this job. Focus on adding missing keywords.");
  } else if (score < 80) {
    suggestions.push("Your resume is decent but could be improved. Add more relevant keywords from the job description.");
  } else {
    suggestions.push("Great job! Your resume matches well with this position.");
  }

  if (missingCount > 0) {
    suggestions.push(`Add ${missingCount} missing keywords to improve your ATS score.`);
  }

  suggestions.push("Use quantifiable achievements (e.g., 'Increased revenue by 25%').");
  suggestions.push("Ensure your contact information is at the top of your resume.");
  suggestions.push("Use strong action verbs to describe your experience.");

  return suggestions.slice(0, 5);
}

function generateImprovements(missing: string[]): { skills?: string[] } {
  return {
    skills: missing.slice(0, 8),
  };
}
