"use client";

import Link from "next/link";
import {
  FileText,
  Briefcase,
  Search,
  CheckCircle,
  Link as LinkIcon,
  CreditCard,
  ArrowRight,
  Sparkles,
  Brain,
  Map,
  BookOpen,
  Share2,
} from "lucide-react";

const services = [
  {
    title: "Resume Builder",
    description:
      "Create professional resumes with AI-powered suggestions, 9+ templates, and PDF export.",
    icon: FileText,
    href: "/resume-builder",
    color: "bg-blue-500",
    features: [
      "9+ specialized templates",
      "AI content suggestions",
      "PDF export",
      "ATS-optimized formats",
    ],
  },
  {
    title: "CV Builder",
    description:
      "Build comprehensive academic CVs with sections for publications, research, grants, and more.",
    icon: Briefcase,
    href: "/cv-builder",
    color: "bg-emerald-500",
    features: [
      "Academic formatting",
      "Publication tracking",
      "Research experience",
      "Citation formatting",
    ],
  },
  {
    title: "Cover Letters",
    description:
      "Generate personalized cover letters tailored to specific job descriptions using AI.",
    icon: FileText,
    href: "/cover-letter",
    color: "bg-purple-500",
    features: [
      "AI-generated content",
      "Multiple templates",
      "Job-specific tailoring",
      "One-click export",
    ],
  },
  {
    title: "Job Search",
    description:
      "Search jobs from multiple sources worldwide and track your applications.",
    icon: Search,
    href: "/job-search",
    color: "bg-orange-500",
    features: [
      "Global job search",
      "50+ job sources",
      "Application tracking",
      "Direct apply links",
    ],
  },
  {
    title: "ATS Checker",
    description:
      "Optimize your resume for Applicant Tracking Systems with AI-powered analysis.",
    icon: CheckCircle,
    href: "/ats-checker",
    color: "bg-rose-500",
    features: [
      "Keyword matching",
      "Score breakdown",
      "Improvement suggestions",
      "Real-time feedback",
    ],
  },
  {
    title: "Career Counselling",
    description:
      "AI-powered career recommendations based on your personality and skills.",
    icon: Brain,
    href: "/career-counselling",
    color: "bg-pink-500",
    features: [
      "Personality assessment",
      "Career matching",
      "Skills analysis",
      "Salary insights",
    ],
  },
  {
    title: "Career Pathways",
    description:
      "Explore detailed career progression paths from entry to executive level.",
    icon: Map,
    href: "/career-pathways",
    color: "bg-indigo-500",
    features: [
      "Interactive roadmaps",
      "Skills progression",
      "Salary growth tracking",
      "Alternative paths",
    ],
  },
  {
    title: "Study Selection Guide",
    description:
      "Find the perfect course and university based on your interests and career goals.",
    icon: BookOpen,
    href: "/study-guide",
    color: "bg-cyan-500",
    features: [
      "Program comparison",
      "Career-aligned paths",
      "Top universities",
      "Salary insights",
    ],
  },
  {
    title: "Thesis Consultancy",
    description:
      "Complete thesis guidance from topic selection to defense.",
    icon: BookOpen,
    href: "/thesis-consultancy",
    color: "bg-amber-500",
    features: [
      "Topic generator",
      "Citation tools",
      "Progress tracking",
      "Advisor matching",
    ],
  },
  {
    title: "LinkedIn Tools",
    description:
      "Import profiles, optimize content, and share job applications to LinkedIn.",
    icon: LinkIcon,
    href: "/linkedin",
    color: "bg-sky-600",
    features: [
      "Profile import",
      "Content optimization",
      "Share applications",
      "Post generator",
    ],
  },
  {
    title: "Social Share",
    description:
      "Share your resume via WhatsApp, LinkedIn, Twitter, and more.",
    icon: Share2,
    href: "/share",
    color: "bg-teal-500",
    features: [
      "WhatsApp integration",
      "QR code generation",
      "Embed on website",
      "Social media sharing",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-indigo-600 to-indigo-800 px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Career Tools</span>
          </div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            All Services
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
            Everything you need to build your career, from resumes to job applications
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Services Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div
                className={`${service.color} mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-white`}
              >
                <service.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {service.title}
              </h3>
              <p className="mt-2 text-gray-600">{service.description}</p>
              <ul className="mt-4 space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center text-indigo-600">
                <span className="font-medium">Get started</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Pricing CTA */}
        <div className="mt-16 rounded-2xl bg-indigo-900 p-8 text-center text-white sm:p-12">
          <h2 className="text-3xl font-bold">Ready to accelerate your career?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-200">
            Choose the plan that works for you. Start free and upgrade as you grow.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-indigo-900 shadow-lg transition-colors hover:bg-indigo-50"
            >
              View Pricing
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/resume-builder"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
            >
              Start Free
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            How It Works
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Create Your Profile",
                description:
                  "Sign up and create your profile with your experience and skills.",
              },
              {
                step: "2",
                title: "Build Your Resume",
                description:
                  "Use our AI-powered tools to create a professional resume in minutes.",
              },
              {
                step: "3",
                title: "Apply & Track",
                description:
                  "Find jobs, apply with your optimized resume, and track applications.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-600">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
