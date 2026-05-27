"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Eye,
  Save,
  ChevronLeft,
  GraduationCap,
  BookOpen,
  Award,
  Users,
  Microscope,
  Presentation,
  DollarSign,
} from "lucide-react";
import { CVData } from "@/types/resume";

const defaultCVData: CVData = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedIn: "",
    summary: "",
  },
  education: [],
  research: [],
  publications: [],
  presentations: [],
  grants: [],
  teaching: [],
  awards: [],
  professionalMemberships: [],
  references: [],
};

export default function CVBuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [selectedTemplate, setSelectedTemplate] = useState("academic");
  const [cvData, setCVData] = useState<CVData>(defaultCVData);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("Untitled CV");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    // Save logic here
    setTimeout(() => setIsSaving(false), 1000);
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
              <GraduationCap className="h-6 w-6 text-emerald-600" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-none bg-transparent text-lg font-semibold text-gray-900 focus:outline-none focus:ring-0"
                placeholder="CV Title"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === "edit"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Eye className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === "preview"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isSaving ? "Saving..." : "Save"}
              </span>
            </button>

            <button className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4">
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-emerald-600" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Academic CV Builder
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create a comprehensive academic CV tailored for research positions,
            graduate school applications, and academic careers.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> Publications
            </span>
            <span className="flex items-center gap-1">
              <Microscope className="h-4 w-4" /> Research
            </span>
            <span className="flex items-center gap-1">
              <Presentation className="h-4 w-4" /> Presentations
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" /> Grants
            </span>
          </div>
        </div>

        {/* Template Selection */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-medium text-gray-900">Choose Template</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { id: "academic", name: "Academic", desc: "Traditional academic format" },
              { id: "research", name: "Research", desc: "Publication-focused" },
              { id: "modern", name: "Modern", desc: "Contemporary academic" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t.id)}
                className={`rounded-lg border px-4 py-2 text-left transition-all ${
                  selectedTemplate === t.id
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <span className="font-medium">{t.name}</span>
                <span className="ml-2 text-xs text-gray-500">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Placeholder for CV sections */}
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Sidebar - sections */}
          <div className="space-y-2">
            {[
              { id: "personal", name: "Personal Information", icon: Users },
              { id: "education", name: "Education", icon: GraduationCap },
              { id: "research", name: "Research Experience", icon: Microscope },
              { id: "publications", name: "Publications", icon: BookOpen },
              { id: "presentations", name: "Presentations", icon: Presentation },
              { id: "grants", name: "Grants & Awards", icon: DollarSign },
              { id: "teaching", name: "Teaching Experience", icon: Users },
              { id: "memberships", name: "Professional Memberships", icon: Users },
              { id: "references", name: "References", icon: Users },
            ].map((section) => (
              <button
                key={section.id}
                className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-left transition-colors hover:border-emerald-500 hover:bg-emerald-50"
              >
                <section.icon className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-900">{section.name}</span>
              </button>
            ))}
          </div>

          {/* Main content area */}
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <div className="text-center">
              <FileText className="mx-auto h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                CV Builder Coming Soon
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                The Academic CV Builder is under development. This will include:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" />
                  Full academic section support (Publications, Research, Grants)
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-600" />
                  Citation formatting (APA, MLA, Chicago)
                </li>
                <li className="flex items-center gap-2">
                  <Presentation className="h-4 w-4 text-emerald-600" />
                  Conference and presentation tracking
                </li>
                <li className="flex items-center gap-2">
                  <Microscope className="h-4 w-4 text-emerald-600" />
                  Research project documentation
                </li>
              </ul>
              <Link
                href="/resume-builder"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Use Resume Builder Instead
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
