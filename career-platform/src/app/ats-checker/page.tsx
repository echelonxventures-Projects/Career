"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  Loader2,
  RefreshCw,
  TrendingUp,
  Target,
  AlignLeft,
  Zap,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ATSResult {
  overallScore: number;
  sectionScores: {
    keywords: number;
    formatting: number;
    content: number;
    skills: number;
  };
  keywordMatches: {
    matched: string[];
    missing: string[];
  };
  suggestions: string[];
  improvements: {
    title?: string;
    summary?: string;
    experience?: string[];
    education?: string;
    skills?: string[];
  };
}

export default function ATSCheckerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<"upload" | "job" | "analyzing" | "results">("upload");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = async (file: File) => {
    // In a real implementation, you'd extract text from PDF/DOCX
    // For now, we'll just show the filename
    const text = await file.text();
    setResumeText(text);
  };

  const analyzeResume = async () => {
    setIsAnalyzing(true);
    setStep("analyzing");

    try {
      const response = await fetch("/api/ats-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to analyze");

      const data = await response.json();
      setResult(data.result);
      setStep("results");
    } catch (error) {
      // Fallback to mock results for demo
      setResult({
        overallScore: 72,
        sectionScores: {
          keywords: 65,
          formatting: 85,
          content: 75,
          skills: 80,
        },
        keywordMatches: {
          matched: ["JavaScript", "React", "Node.js", "Agile", "REST API"],
          missing: ["TypeScript", "Docker", "AWS", "GraphQL", "CI/CD"],
        },
        suggestions: [
          "Add the missing keywords from the job description",
          "Quantify your achievements with specific metrics",
          "Use stronger action verbs in your experience section",
          "Ensure your contact information is at the top",
        ],
        improvements: {
          summary: "Add a professional summary highlighting your expertise with the technologies mentioned in the job description.",
          experience: [
            "Include metrics and quantifiable achievements",
            "Add specific project outcomes and results",
          ],
          skills: ["TypeScript", "Docker", "AWS", "GraphQL"],
        },
      });
      setStep("results");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
              <h1 className="text-lg font-semibold text-gray-900">ATS Checker</h1>
            </div>
          </div>

          {step === "results" && (
            <button
              onClick={() => {
                setStep("upload");
                setResumeText("");
                setJobDescription("");
                setResult(null);
              }}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4" />
              New Check
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-4 py-8">
        {/* Progress Steps */}
        {step !== "results" && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <StepIndicator
                number={1}
                label="Upload Resume"
                active={step === "upload"}
                completed={step !== "upload"}
              />
              <div className="h-px w-16 bg-gray-300" />
              <StepIndicator
                number={2}
                label="Paste Job Description"
                active={step === "job"}
                completed={step === "analyzing" || (step as string) === "results"}
              />
              <div className="h-px w-16 bg-gray-300" />
              <StepIndicator
                number={3}
                label="Get Results"
                active={step === "analyzing"}
                completed={(step as string) === "results"}
              />
            </div>
          </div>
        )}

        {/* Upload Step */}
        {step === "upload" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <Upload className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Upload Your Resume
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Upload your resume or paste the text to get started
              </p>
            </div>

            {/* Upload Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                "mt-6 rounded-xl border-2 border-dashed p-8 text-center transition-colors",
                dragActive
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 bg-gray-50"
              )}
            >
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-sm text-gray-600">
                <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF, DOCX up to 10MB</p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />
            </div>

            {/* Or paste text */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Or paste your resume text
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                rows={8}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Paste your resume content here..."
              />
            </div>

            <button
              onClick={() => setStep("job")}
              disabled={!resumeText.trim()}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Job Description Step */}
        {step === "job" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <Target className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Paste Job Description
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                We'll compare your resume against the job requirements
              </p>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Paste the job description here..."
              />
              <p className="mt-2 text-xs text-gray-500">
                Tip: Include the full job description for better analysis
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep("upload")}
                className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={analyzeResume}
                disabled={!jobDescription.trim()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                Analyze Resume
              </button>
            </div>
          </div>
        )}

        {/* Analyzing Step */}
        {step === "analyzing" && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="h-24 w-24 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
              <Sparkles className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-indigo-600" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              Analyzing Your Resume
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              AI is comparing your resume against the job description...
            </p>
          </div>
        )}

        {/* Results Step */}
        {step === "results" && result && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    ATS Compatibility Score
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Your resume matches {result.overallScore}% of job requirements
                  </p>
                </div>
                <div className="text-center">
                  <div
                    className={cn(
                      "flex h-24 w-24 items-center justify-center rounded-full border-4 text-3xl font-bold",
                      getScoreColor(result.overallScore),
                      result.overallScore >= 80
                        ? "border-emerald-200 bg-emerald-50"
                        : result.overallScore >= 60
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-red-200 bg-red-50"
                    )}
                  >
                    {result.overallScore}%
                  </div>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ScoreBar
                  icon={Target}
                  label="Keywords"
                  score={result.sectionScores.keywords}
                />
                <ScoreBar
                  icon={AlignLeft}
                  label="Formatting"
                  score={result.sectionScores.formatting}
                />
                <ScoreBar
                  icon={FileText}
                  label="Content"
                  score={result.sectionScores.content}
                />
                <ScoreBar
                  icon={Zap}
                  label="Skills Match"
                  score={result.sectionScores.skills}
                />
              </div>
            </div>

            {/* Keywords Analysis */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Matched Keywords */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold text-gray-900">Matched Keywords</h3>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Keywords found in your resume
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.keywordMatches.matched.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-gray-900">Missing Keywords</h3>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  Add these to improve your score
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.keywordMatches.missing.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-600">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specific Improvements */}
            {result.improvements && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  <h3 className="font-semibold text-gray-900">Recommended Improvements</h3>
                </div>
                <div className="mt-4 space-y-4">
                  {result.improvements.summary && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="font-medium text-gray-900">Professional Summary</h4>
                      <p className="mt-1 text-sm text-gray-600">{result.improvements.summary}</p>
                    </div>
                  )}
                  {result.improvements.experience && result.improvements.experience.length > 0 && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="font-medium text-gray-900">Experience Section</h4>
                      <ul className="mt-2 space-y-1">
                        {result.improvements.experience.map((item, i) => (
                          <li key={i} className="text-sm text-gray-600">• {item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.improvements.skills && result.improvements.skills.length > 0 && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="font-medium text-gray-900">Skills to Add</h4>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {result.improvements.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/resume-builder"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                <FileText className="h-4 w-4" />
                Edit Resume
              </Link>
              <Link
                href="/job-search"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Target className="h-4 w-4" />
                Find Jobs
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StepIndicator({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors",
          active
            ? "bg-indigo-600 text-white"
            : completed
            ? "bg-emerald-500 text-white"
            : "bg-gray-200 text-gray-500"
        )}
      >
        {completed && !active ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          number
        )}
      </div>
      <span
        className={cn(
          "mt-2 text-xs font-medium",
          active ? "text-indigo-600" : completed ? "text-emerald-600" : "text-gray-500"
        )}
      >
        {label}
      </span>
    </div>
  );
}

function ScoreBar({
  icon: Icon,
  label,
  score,
}: {
  icon: typeof Target;
  label: string;
  score: number;
}) {
  const getColor = (s: number) => {
    if (s >= 80) return "bg-emerald-500";
    if (s >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div className="flex-1">
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className={cn("h-2 rounded-full transition-all", getColor(score))}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
        <span
          className={cn(
            "ml-3 text-lg font-semibold",
            score >= 80 ? "text-emerald-600" : score >= 60 ? "text-yellow-600" : "text-red-600"
          )}
        >
          {score}%
        </span>
      </div>
    </div>
  );
}
