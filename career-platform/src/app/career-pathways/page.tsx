"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Map,
  ChevronLeft,
  GraduationCap,
  Briefcase,
  Award,
  ArrowRight,
  Clock,
  DollarSign,
  Users,
  Target,
} from "lucide-react";

const careerPathways = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    description: "Build applications and systems that power the digital world",
    entrySalary: "$60,000 - $80,000",
    seniorSalary: "$150,000 - $250,000",
    timeline: "3-5 years to Senior",
    stages: [
      {
        level: "Entry Level",
        title: "Junior Developer",
        years: "0-2 years",
        salary: "$60k - $80k",
        skills: ["Basic Programming", "Git", "Problem Solving"],
        responsibilities: ["Write code under supervision", "Fix bugs", "Learn codebase"],
        certifications: ["AWS Cloud Practitioner", "Language Certifications"],
      },
      {
        level: "Mid Level",
        title: "Software Engineer",
        years: "2-5 years",
        salary: "$80k - $120k",
        skills: ["System Design", "Testing", "Code Review", "Mentoring"],
        responsibilities: ["Design features", "Code review", "Mentor juniors"],
        certifications: ["AWS Developer", "Kubernetes"],
      },
      {
        level: "Senior Level",
        title: "Senior Engineer",
        years: "5-8 years",
        salary: "$120k - $180k",
        skills: ["Architecture", "Leadership", "Technical Strategy"],
        responsibilities: ["Lead projects", "Architect systems", "Drive technical decisions"],
        certifications: ["AWS Solutions Architect", "TOGAF"],
      },
      {
        level: "Staff/Principal",
        title: "Staff Engineer",
        years: "8+ years",
        salary: "$180k - $250k",
        skills: ["Org-wide Impact", "Technical Vision", "Cross-team Leadership"],
        responsibilities: ["Company-wide architecture", "Mentor seniors", "Strategic initiatives"],
        certifications: ["Domain-specific Expert"],
      },
    ],
    alternativePaths: [
      { title: "Engineering Manager", description: "Lead engineering teams" },
      { title: "Architect", description: "Design complex systems" },
      { title: "CTO", description: "Technical leadership" },
    ],
  },
  {
    id: "data-scientist",
    title: "Data Scientist",
    description: "Extract insights from data to drive business decisions",
    entrySalary: "$70,000 - $90,000",
    seniorSalary: "$160,000 - $300,000",
    timeline: "4-6 years to Senior",
    stages: [
      {
        level: "Entry Level",
        title: "Junior Data Scientist",
        years: "0-2 years",
        salary: "$70k - $90k",
        skills: ["Python/R", "Statistics", "SQL", "Data Visualization"],
        responsibilities: ["Clean data", "Run analyses", "Build basic models"],
        certifications: ["Google Data Analytics"],
      },
      {
        level: "Mid Level",
        title: "Data Scientist",
        years: "2-5 years",
        salary: "$100k - $140k",
        skills: ["Machine Learning", "Deep Learning", "Feature Engineering"],
        responsibilities: ["Build ML models", "Deploy to production", "A/B testing"],
        certifications: ["TensorFlow", "AWS ML Specialty"],
      },
      {
        level: "Senior Level",
        title: "Senior Data Scientist",
        years: "5-8 years",
        salary: "$150k - $200k",
        skills: ["MLOps", "Research", "Advanced Modeling"],
        responsibilities: ["Lead ML projects", "Research new techniques", "Mentor team"],
        certifications: ["Advanced ML"],
      },
    ],
    alternativePaths: [
      { title: "ML Engineer", description: "Productionize ML models" },
      { title: "Research Scientist", description: "Research-focused" },
      { title: "Chief Data Officer", description: "Executive data leadership" },
    ],
  },
  {
    id: "product-manager",
    title: "Product Manager",
    description: "Define and execute product vision and strategy",
    entrySalary: "$65,000 - $85,000",
    seniorSalary: "$160,000 - $280,000",
    timeline: "4-6 years to Senior",
    stages: [
      {
        level: "Entry Level",
        title: "Associate PM",
        years: "0-2 years",
        salary: "$65k - $85k",
        skills: ["Communication", "User Research", "Basic Analytics"],
        responsibilities: ["Assist PMs", "User interviews", "Document requirements"],
        certifications: ["Certified Scrum Product Owner"],
      },
      {
        level: "Mid Level",
        title: "Product Manager",
        years: "2-5 years",
        salary: "$95k - $140k",
        skills: ["Roadmapping", "Stakeholder Management", "Strategy"],
        responsibilities: ["Own features", "Define roadmap", "Coordinate teams"],
        certifications: ["Pragmatic Marketing"],
      },
      {
        level: "Senior Level",
        title: "Senior PM / Group PM",
        years: "5-10 years",
        salary: "$150k - $220k",
        skills: ["Portfolio Management", "Executive Communication", "Vision"],
        responsibilities: ["Own product area", "Lead PM team", "Drive strategy"],
        certifications: ["MBA (optional)"],
      },
    ],
    alternativePaths: [
      { title: "Product Director", description: "Multi-product leadership" },
      { title: "VP Product", description: "Executive product role" },
      { title: "CEO", description: "Company leadership" },
    ],
  },
];

export default function CareerPathwaysPage() {
  const [selectedCareer, setSelectedCareer] = useState(careerPathways[0]);
  const [activeStage, setActiveStage] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
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
              <Map className="h-6 w-6 text-emerald-600" />
              <h1 className="text-lg font-semibold text-gray-900">Career Pathways</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 py-8">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Career Selection */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Select Career
            </h2>
            {careerPathways.map((career) => (
              <button
                key={career.id}
                onClick={() => {
                  setSelectedCareer(career);
                  setActiveStage(0);
                }}
                className={`w-full rounded-lg border p-4 text-left transition-all ${
                  selectedCareer.id === career.id
                    ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <p className="font-medium text-gray-900">{career.title}</p>
                <p className="mt-1 text-xs text-gray-600">
                  {career.timeline} • {career.entrySalary} → {career.seniorSalary}
                </p>
              </button>
            ))}
          </div>

          {/* Career Path Visualization */}
          <div className="space-y-6">
            {/* Header */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCareer.title} Career Path
              </h2>
              <p className="mt-1 text-gray-600">{selectedCareer.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Entry:</span> {selectedCareer.entrySalary}
                </div>
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Senior:</span> {selectedCareer.seniorSalary}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">Timeline:</span> {selectedCareer.timeline}
                </div>
              </div>
            </div>

            {/* Career Path Timeline */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">
                Career Progression
              </h3>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200"></div>

                {/* Stages */}
                <div className="space-y-6">
                  {selectedCareer.stages.map((stage, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveStage(index)}
                      className={`relative flex cursor-pointer gap-4 rounded-lg border p-4 transition-all ${
                        activeStage === index
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      {/* Stage Number */}
                      <div
                        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                          activeStage === index
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                              {stage.level}
                            </span>
                            <h4 className="text-lg font-semibold text-gray-900">
                              {stage.title}
                            </h4>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{stage.years}</p>
                            <p className="text-xs text-gray-500">{stage.salary}</p>
                          </div>
                        </div>

                        {activeStage === index && (
                          <div className="mt-4 border-t border-emerald-200 pt-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Key Skills
                                </p>
                                <div className="mt-1 flex flex-wrap gap-1">
                                  {stage.skills.map((skill) => (
                                    <span
                                      key={skill}
                                      className="rounded-full bg-white px-2 py-1 text-xs text-gray-700"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Recommended Certifications
                                </p>
                                <ul className="mt-1 text-xs text-gray-600">
                                  {stage.certifications.map((cert) => (
                                    <li key={cert}>• {cert}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="mt-4">
                              <p className="text-sm font-medium text-gray-700">
                                Responsibilities
                              </p>
                              <ul className="mt-1 text-sm text-gray-600">
                                {stage.responsibilities.map((resp) => (
                                  <li key={resp}>• {resp}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Alternative Paths */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Alternative Career Paths
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                {selectedCareer.alternativePaths.map((path) => (
                  <div
                    key={path.title}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <h4 className="font-medium text-gray-900">{path.title}</h4>
                    <p className="text-sm text-gray-600">{path.description}</p>
                    <Link
                      href={`/career-pathways/${path.title.toLowerCase().replace(/\s+/g, "-")}`}
                      className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-emerald-600"
                    >
                      View Path
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
