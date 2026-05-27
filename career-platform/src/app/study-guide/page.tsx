"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  ChevronLeft,
  Search,
  Filter,
  MapPin,
  DollarSign,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Briefcase,
  TrendingUp,
  Users,
  Award,
  Lightbulb,
  Target,
  Compass,
} from "lucide-react";

interface StudyProgram {
  id: string;
  name: string;
  category: string;
  duration: string;
  level: string;
  careers: string[];
  salaryRange: string;
  description: string;
  skills: string[];
  topSchools: string[];
  trending: boolean;
}

const studyCategories = [
  { id: "all", name: "All Programs", icon: BookOpen },
  { id: "technology", name: "Technology & Engineering", icon: Lightbulb },
  { id: "business", name: "Business & Management", icon: Briefcase },
  { id: "healthcare", name: "Healthcare & Medicine", icon: Users },
  { id: "arts", name: "Arts & Humanities", icon: Star },
  { id: "science", name: "Science & Research", icon: Target },
  { id: "social", name: "Social Sciences", icon: Compass },
];

const studyPrograms: StudyProgram[] = [
  {
    id: "computer-science",
    name: "Computer Science",
    category: "technology",
    duration: "3-4 years",
    level: "Bachelor's",
    careers: ["Software Engineer", "Data Scientist", "AI Researcher", "Cybersecurity Analyst"],
    salaryRange: "$70k - $150k",
    description: "Study computation, algorithms, programming languages, and software engineering principles.",
    skills: ["Programming", "Problem Solving", "Mathematics", "Logical Thinking"],
    topSchools: ["MIT", "Stanford", "Carnegie Mellon", "UC Berkeley"],
    trending: true,
  },
  {
    id: "data-science",
    name: "Data Science",
    category: "technology",
    duration: "3-4 years",
    level: "Bachelor's",
    careers: ["Data Scientist", "Data Analyst", "ML Engineer", "Business Intelligence Analyst"],
    salaryRange: "$80k - $160k",
    description: "Learn to extract insights from data using statistics, machine learning, and visualization.",
    skills: ["Statistics", "Python", "Machine Learning", "SQL"],
    topSchools: ["MIT", "Stanford", "CMU", "Harvard"],
    trending: true,
  },
  {
    id: "business-admin",
    name: "Business Administration",
    category: "business",
    duration: "3-4 years",
    level: "Bachelor's",
    careers: ["Manager", "Consultant", "Entrepreneur", "Marketing Director"],
    salaryRange: "$60k - $120k",
    description: "Comprehensive study of business operations, management, marketing, and finance.",
    skills: ["Leadership", "Communication", "Strategic Thinking", "Analytics"],
    topSchools: ["Harvard", "Wharton", "Stanford", "MIT"],
    trending: false,
  },
  {
    id: "medicine",
    name: "Medicine (MD)",
    category: "healthcare",
    duration: "4-6 years",
    level: "Doctorate",
    careers: ["Doctor", "Surgeon", "Medical Researcher", "Public Health Expert"],
    salaryRange: "$200k - $400k+",
    description: "Intensive medical training to diagnose and treat illnesses, save lives, and advance healthcare.",
    skills: ["Critical Thinking", "Empathy", "Scientific Knowledge", "Decision Making"],
    topSchools: ["Johns Hopkins", "Harvard", "Stanford", "Mayo Clinic"],
    trending: true,
  },
  {
    id: "nursing",
    name: "Nursing",
    category: "healthcare",
    duration: "2-4 years",
    level: "Bachelor's",
    careers: ["Registered Nurse", "Nurse Practitioner", "Nurse Manager", "Healthcare Administrator"],
    salaryRange: "$60k - $120k",
    description: "Train to provide patient care, support doctors, and manage healthcare delivery.",
    skills: ["Patient Care", "Communication", "Medical Knowledge", "Compassion"],
    topSchools: ["Johns Hopkins", "U Penn", "Duke", "University of Washington"],
    trending: true,
  },
  {
    id: "psychology",
    name: "Psychology",
    category: "social",
    duration: "3-4 years",
    level: "Bachelor's",
    careers: ["Psychologist", "HR Specialist", "Counselor", "User Researcher"],
    salaryRange: "$50k - $100k",
    description: "Study human behavior, mental processes, and how people think, feel, and act.",
    skills: ["Empathy", "Research", "Communication", "Critical Analysis"],
    topSchools: ["Stanford", "Harvard", "Yale", "UCLA"],
    trending: false,
  },
  {
    id: "engineering",
    name: "Engineering",
    category: "technology",
    duration: "4-5 years",
    level: "Bachelor's",
    careers: ["Civil Engineer", "Mechanical Engineer", "Electrical Engineer", "Project Manager"],
    salaryRange: "$70k - $130k",
    description: "Apply scientific principles to design, build, and maintain structures, machines, and systems.",
    skills: ["Mathematics", "Problem Solving", "Technical Design", "Project Management"],
    topSchools: ["MIT", "Stanford", "Caltech", "Georgia Tech"],
    trending: false,
  },
  {
    id: "economics",
    name: "Economics",
    category: "business",
    duration: "3-4 years",
    level: "Bachelor's",
    careers: ["Economist", "Financial Analyst", "Policy Advisor", "Investment Banker"],
    salaryRange: "$65k - $140k",
    description: "Study production, distribution, and consumption of goods and services.",
    skills: ["Analytics", "Research", "Critical Thinking", "Mathematics"],
    topSchools: ["Harvard", "MIT", "Stanford", "Chicago"],
    trending: false,
  },
  {
    id: "biology",
    name: "Biology",
    category: "science",
    duration: "3-4 years",
    level: "Bachelor's",
    careers: ["Research Scientist", "Biotechnologist", "Environmental Consultant", "Lab Manager"],
    salaryRange: "$55k - $110k",
    description: "Study living organisms, their processes, and ecosystems.",
    skills: ["Research", "Lab Skills", "Data Analysis", "Critical Thinking"],
    topSchools: ["Harvard", "MIT", "Stanford", "Cambridge"],
    trending: true,
  },
  {
    id: "english",
    name: "English Literature",
    category: "arts",
    duration: "3-4 years",
    level: "Bachelor's",
    careers: ["Writer", "Editor", "Teacher", "Content Strategist"],
    salaryRange: "$45k - $90k",
    description: "Analyze literature, develop writing skills, and explore human expression through text.",
    skills: ["Writing", "Critical Analysis", "Communication", "Research"],
    topSchools: ["Oxford", "Cambridge", "Yale", "Harvard"],
    trending: false,
  },
  {
    id: "design",
    name: "Graphic Design",
    category: "arts",
    duration: "3-4 years",
    level: "Bachelor's",
    careers: ["Graphic Designer", "UX Designer", "Art Director", "Creative Lead"],
    salaryRange: "$50k - $100k",
    description: "Learn visual communication, typography, branding, and digital design.",
    skills: ["Creativity", "Adobe Suite", "Visual Communication", "Typography"],
    topSchools: ["Rhode Island School of Design", "Parsons", "CalArts", "Pratt"],
    trending: true,
  },
  {
    id: "law",
    name: "Law (JD)",
    category: "social",
    duration: "3 years",
    level: "Doctorate",
    careers: ["Lawyer", "Judge", "Legal Consultant", "Corporate Counsel"],
    salaryRange: "$100k - $200k+",
    description: "Study legal systems, case law, and prepare for legal practice.",
    skills: ["Critical Thinking", "Argumentation", "Research", "Writing"],
    topSchools: ["Yale", "Harvard", "Stanford", "Columbia"],
    trending: false,
  },
];

const careerPaths = [
  {
    title: "Tech Professional",
    description: "Build a career in the fast-growing technology sector",
    programs: ["Computer Science", "Data Science", "Engineering"],
    outlook: "Excellent - 22% growth expected",
    icon: Lightbulb,
  },
  {
    title: "Healthcare Provider",
    description: "Make a difference in people's health and wellbeing",
    programs: ["Medicine", "Nursing", "Biology"],
    outlook: "Excellent - 16% growth expected",
    icon: Users,
  },
  {
    title: "Business Leader",
    description: "Lead organizations and drive business success",
    programs: ["Business Administration", "Economics", "Law"],
    outlook: "Good - 9% growth expected",
    icon: Briefcase,
  },
  {
    title: "Creative Professional",
    description: "Express yourself through design, writing, or arts",
    programs: ["Graphic Design", "English Literature", "Psychology"],
    outlook: "Moderate - 4% growth expected",
    icon: Star,
  },
];

export default function StudySelectionGuide() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<StudyProgram | null>(null);

  const filteredPrograms = studyPrograms.filter((program) => {
    const matchesCategory = activeCategory === "all" || program.category === activeCategory;
    const matchesSearch =
      program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.careers.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
              <h1 className="text-lg font-semibold text-gray-900">Study Selection Guide</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 py-8">
        {/* Hero */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
          <div className="flex items-center gap-3">
            <Compass className="h-10 w-10" />
            <div>
              <h2 className="text-2xl font-bold">Find Your Perfect Course</h2>
              <p className="mt-1 text-indigo-100">
                Discover programs that match your interests, goals, and career aspirations
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              <span>50+ Programs</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>Career Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span>Top Universities</span>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search programs, careers, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {studyCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === category.id
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                }`}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Programs List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {filteredPrograms.length} Programs Found
            </h3>
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                onClick={() => setSelectedProgram(program)}
                className={`cursor-pointer rounded-xl border bg-white p-6 transition-all hover:shadow-md ${
                  selectedProgram?.id === program.id
                    ? "border-indigo-500 ring-1 ring-indigo-500"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold text-gray-900">{program.name}</h4>
                      {program.trending && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Trending
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{program.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Clock className="h-4 w-4" />
                    {program.duration}
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Award className="h-4 w-4" />
                    {program.level}
                  </div>
                  <div className="flex items-center gap-1 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    {program.salaryRange}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {program.careers.slice(0, 3).map((career) => (
                    <span
                      key={career}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Program Details */}
            {selectedProgram && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900">{selectedProgram.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{selectedProgram.description}</p>

                <div className="mt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedProgram.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Level:</span>
                    <span className="font-medium">{selectedProgram.level}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Salary Range:</span>
                    <span className="font-medium text-emerald-600">{selectedProgram.salaryRange}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-gray-900">Key Skills</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedProgram.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-gray-900">Career Paths</h4>
                  <ul className="mt-2 space-y-1">
                    {selectedProgram.careers.map((career) => (
                      <li key={career} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        {career}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-gray-900">Top Schools</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedProgram.topSchools.map((school) => (
                      <span
                        key={school}
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                      >
                        {school}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="mt-6 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  View Career Pathway
                </button>
              </div>
            )}

            {/* Career Paths Overview */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">Popular Career Paths</h3>
              <div className="mt-4 space-y-4">
                {careerPaths.map((path) => (
                  <div key={path.title} className="rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2">
                      <path.icon className="h-5 w-5 text-indigo-600" />
                      <h4 className="font-medium text-gray-900">{path.title}</h4>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">{path.description}</p>
                    <div className="mt-2 text-xs text-emerald-600">{path.outlook}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Assessment CTA */}
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
              <h3 className="font-semibold text-gray-900">Not Sure What to Study?</h3>
              <p className="mt-1 text-sm text-gray-600">
                Take our quick assessment to find programs matching your personality and interests.
              </p>
              <Link
                href="/career-counselling"
                className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Target className="h-4 w-4" />
                Take Assessment
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
