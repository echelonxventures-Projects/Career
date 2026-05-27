"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Brain,
  Target,
  TrendingUp,
  DollarSign,
  Map,
  Users,
  Sparkles,
  ChevronLeft,
  Loader2,
  CheckCircle,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Award,
  Zap,
} from "lucide-react";

const assessmentQuestions = [
  {
    id: 1,
    category: "Work Style",
    question: "How do you prefer to work?",
    options: [
      { value: "independent", label: "Independently with minimal supervision", traits: ["self-motivated", "autonomous"] },
      { value: "team", label: "In a collaborative team environment", traits: ["collaborative", "team-player"] },
      { value: "mixed", label: "A mix of both, depending on the task", traits: ["adaptable", "flexible"] },
    ],
  },
  {
    id: 2,
    category: "Problem Solving",
    question: "When faced with a complex problem, you typically:",
    options: [
      { value: "analytical", label: "Analyze data and facts systematically", traits: ["analytical", "logical"] },
      { value: "creative", label: "Think outside the box for innovative solutions", traits: ["creative", "innovative"] },
      { value: "practical", label: "Rely on practical experience and intuition", traits: ["practical", "experienced"] },
    ],
  },
  {
    id: 3,
    category: "Environment",
    question: "Your ideal work environment is:",
    options: [
      { value: "office", label: "A structured office setting", traits: ["structured", "traditional"] },
      { value: "remote", label: "Remote/flexible from anywhere", traits: ["remote-friendly", "self-disciplined"] },
      { value: "field", label: "On-site/field work (traveling, outdoor)", traits: ["adventurous", "mobile"] },
    ],
  },
  {
    id: 4,
    category: "Impact",
    question: "What motivates you most?",
    options: [
      { value: "helping", label: "Helping others and making a difference", traits: ["altruistic", "service-oriented"] },
      { value: "achieving", label: "Achieving goals and recognition", traits: ["ambitious", "driven"] },
      { value: "creating", label: "Creating something new and innovative", traits: ["creative", "entrepreneurial"] },
      { value: "learning", label: "Continuous learning and growth", traits: ["curious", "growth-minded"] },
    ],
  },
  {
    id: 5,
    category: "Skills",
    question: "Which of these best describes your strengths?",
    options: [
      { value: "technical", label: "Technical/STEM skills (coding, engineering, data)", traits: ["technical", "analytical"] },
      { value: "creative", label: "Creative skills (design, writing, art)", traits: ["artistic", "creative"] },
      { value: "social", label: "People skills (communication, leadership, empathy)", traits: ["interpersonal", "empathetic"] },
      { value: "business", label: "Business skills (strategy, sales, operations)", traits: ["strategic", "business-minded"] },
    ],
  },
];

const careerRecommendations = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    category: "Technology",
    match: 95,
    salary: "$80,000 - $200,000",
    growth: "+22%",
    description: "Design, develop, and maintain software applications and systems.",
    traits: ["analytical", "technical", "logical", "problem-solver"],
    education: ["Bachelor's in Computer Science", "Coding Bootcamp", "Self-taught with portfolio"],
    skills: ["Programming", "Problem Solving", "System Design", "Debugging"],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    category: "Technology",
    match: 88,
    salary: "$90,000 - $180,000",
    growth: "+35%",
    description: "Analyze complex data to help organizations make better decisions.",
    traits: ["analytical", "curious", "technical", "detail-oriented"],
    education: ["Bachelor's in Statistics/Math", "Master's in Data Science"],
    skills: ["Python/R", "Machine Learning", "Statistics", "SQL"],
  },
  {
    id: "product-manager",
    title: "Product Manager",
    category: "Technology",
    match: 85,
    salary: "$85,000 - $200,000",
    growth: "+14%",
    description: "Lead product development from conception to launch.",
    traits: ["strategic", "collaborative", "business-minded", "leader"],
    education: ["Bachelor's in Business/Engineering", "MBA optional"],
    skills: ["Strategic Thinking", "Communication", "Project Management", "User Research"],
  },
  {
    id: "ux-designer",
    title: "UX Designer",
    category: "Design",
    match: 82,
    salary: "$70,000 - $150,000",
    growth: "+13%",
    description: "Design user-centered digital experiences.",
    traits: ["creative", "empathetic", "problem-solver", "detail-oriented"],
    education: ["Bachelor's in Design/HCI", "UX Bootcamp", "Portfolio"],
    skills: ["User Research", "Wireframing", "Prototyping", "Visual Design"],
  },
  {
    id: "marketing-manager",
    title: "Marketing Manager",
    category: "Marketing",
    match: 78,
    salary: "$65,000 - $150,000",
    growth: "+10%",
    description: "Plan and execute marketing strategies.",
    traits: ["creative", "strategic", "collaborative", "data-driven"],
    education: ["Bachelor's in Marketing/Communications"],
    skills: ["Digital Marketing", "Analytics", "Content Strategy", "Social Media"],
  },
  {
    id: "nurse-practitioner",
    title: "Nurse Practitioner",
    category: "Healthcare",
    match: 92,
    salary: "$90,000 - $140,000",
    growth: "+45%",
    description: "Provide advanced nursing care and primary healthcare.",
    traits: ["altruistic", "empathetic", "detail-oriented", "calm-under-pressure"],
    education: ["Master's in Nursing", "NP Certification"],
    skills: ["Patient Care", "Diagnosis", "Treatment Planning", "Communication"],
  },
  {
    id: "financial-analyst",
    title: "Financial Analyst",
    category: "Finance",
    match: 80,
    salary: "$60,000 - $120,000",
    growth: "+9%",
    description: "Analyze financial data and trends for investment decisions.",
    traits: ["analytical", "detail-oriented", "financially-savvy", "researcher"],
    education: ["Bachelor's in Finance/Economics", "CFA optional"],
    skills: ["Financial Modeling", "Excel", "Data Analysis", "Research"],
  },
];

export default function CareerCounsellingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "assessment" | "analyzing" | "results">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [recommendations, setRecommendations] = useState<typeof careerRecommendations>([]);

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

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers({ ...answers, [questionId]: value });

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep("analyzing");
      // Simulate AI analysis
      setTimeout(() => {
        // In real implementation, this would be based on actual algorithm
        setRecommendations(careerRecommendations.sort(() => Math.random() - 0.5).slice(0, 5));
        setStep("results");
      }, 3000);
    }
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
              <Brain className="h-6 w-6 text-purple-600" />
              <h1 className="text-lg font-semibold text-gray-900">
                Career Counselling
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-4 py-8">
        {step === "intro" && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Discover Your Ideal Career
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
                Answer a few questions about your interests, skills, and preferences.
                Our AI will analyze your profile and recommend the best career paths for you.
              </p>
              <button
                onClick={() => setStep("assessment")}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-purple-700"
              >
                <Sparkles className="h-5 w-5" />
                Start Assessment
              </button>
            </div>

            {/* Features */}
            <div className="grid gap-6 sm:grid-cols-3">
              <FeatureCard
                icon={Target}
                title="Personalized Matches"
                description="AI-powered career recommendations based on your unique profile"
              />
              <FeatureCard
                icon={TrendingUp}
                title="Growth Insights"
                description="See salary potential and job market trends for each career"
              />
              <FeatureCard
                icon={Map}
                title="Career Roadmap"
                description="Get a clear path from where you are to your dream career"
              />
            </div>

            {/* Stats */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
              <p className="text-sm text-gray-600">
                Trusted by <span className="font-bold text-gray-900">50,000+</span> professionals
              </p>
              <div className="mt-4 flex justify-center gap-8">
                <div>
                  <p className="text-2xl font-bold text-purple-600">94%</p>
                  <p className="text-xs text-gray-500">Accuracy Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">500+</p>
                  <p className="text-xs text-gray-500">Career Paths</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">15min</p>
                  <p className="text-xs text-gray-500">Assessment Time</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "assessment" && (
          <div className="mx-auto max-w-2xl">
            {/* Progress */}
            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Question {currentQuestion + 1} of {assessmentQuestions.length}
                </span>
                <span className="text-purple-600">
                  {Math.round(((currentQuestion + 1) / assessmentQuestions.length) * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-purple-600 transition-all"
                  style={{
                    width: `${((currentQuestion + 1) / assessmentQuestions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <span className="text-sm font-medium text-purple-600">
                {assessmentQuestions[currentQuestion].category}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-gray-900">
                {assessmentQuestions[currentQuestion].question}
              </h3>

              <div className="mt-6 space-y-3">
                {assessmentQuestions[currentQuestion].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(assessmentQuestions[currentQuestion].id, option.value)}
                    className="w-full rounded-lg border border-gray-200 p-4 text-left transition-all hover:border-purple-500 hover:bg-purple-50"
                  >
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === "analyzing" && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-24 w-24 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600"></div>
              <Brain className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 text-purple-600" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-gray-900">
              Analyzing Your Profile
            </h2>
            <p className="mt-2 text-gray-600">
              Our AI is matching your traits with ideal career paths...
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
              <Zap className="h-4 w-4" />
              Analyzing {assessmentQuestions.length} dimensions
            </div>
          </div>
        )}

        {step === "results" && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Your Career Matches
              </h2>
              <p className="mt-2 text-gray-600">
                Based on your assessment, here are the top careers for you
              </p>
            </div>

            <div className="space-y-4">
              {recommendations.map((career, index) => (
                <CareerCard key={career.id} career={career} index={index} />
              ))}
            </div>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={() => {
                  setStep("intro");
                  setCurrentQuestion(0);
                  setAnswers({});
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Retake Assessment
              </button>
              <Link
                href="/career-pathways"
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700"
              >
                <Map className="h-4 w-4" />
                Explore Career Pathways
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Target;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
        <Icon className="h-6 w-6 text-purple-600" />
      </div>
      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}

function CareerCard({
  career,
  index,
}: {
  career: typeof careerRecommendations[0];
  index: number;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
          {index + 1}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {career.title}
              </h3>
              <p className="text-sm text-purple-600">{career.category}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-emerald-600">
                <CheckCircle className="h-4 w-4" />
                <span className="font-bold">{career.match}%</span>
              </div>
              <span className="text-xs text-gray-500">Match</span>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-600">{career.description}</p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <DollarSign className="h-4 w-4 text-gray-400" />
              {career.salary}
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <TrendingUp className="h-4 w-4 text-gray-400" />
              Growth {career.growth}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-gray-700">Key Skills:</p>
            <div className="mt-1 flex flex-wrap gap-2">
              {career.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link
              href={`/career-pathways/${career.id}`}
              className="inline-flex items-center gap-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              <Map className="h-4 w-4" />
              View Pathway
            </Link>
            <Link
              href={`/job-search?q=${encodeURIComponent(career.title)}`}
              className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Briefcase className="h-4 w-4" />
              Find Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
