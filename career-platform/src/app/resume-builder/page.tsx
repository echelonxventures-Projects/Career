"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { TemplateSelector } from "@/components/resume/TemplateSelector";
import { ResumeData } from "@/types/resume";
import { PersonalInfo, Experience, Education } from "@/types";
import { FileText, Download, Eye, Save, ChevronLeft } from "lucide-react";
import Link from "next/link";

const defaultResumeData: ResumeData = {
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
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
};

export default function ResumeBuilderPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("Untitled Resume");

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "unauthenticated") {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          template: selectedTemplate,
          data: resumeData,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      // Show success notification
      alert("Resume saved successfully!");
    } catch (error) {
      alert("Failed to save resume. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch("/api/resumes/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: selectedTemplate,
          data: resumeData,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to generate PDF. Please try again.");
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
              <FileText className="h-6 w-6 text-indigo-600" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-none bg-transparent text-lg font-semibold text-gray-900 focus:outline-none focus:ring-0"
                placeholder="Resume Title"
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
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isSaving ? "Saving..." : "Save"}
              </span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl p-4">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr_320px]">
          {/* Template Selector - Hidden on mobile when editing */}
          <div
            className={`${activeTab === "edit" ? "block" : "hidden lg:block"}`}
          >
            <TemplateSelector
              selected={selectedTemplate}
              onSelect={setSelectedTemplate}
            />
          </div>

          {/* Editor or Preview */}
          <div className="min-h-[600px]">
            {activeTab === "edit" ? (
              <ResumeEditor
                data={resumeData}
                onChange={setResumeData}
              />
            ) : (
              <ResumePreview
                template={selectedTemplate}
                data={resumeData}
              />
            )}
          </div>

          {/* Live Preview - Only on large screens */}
          <div className="hidden xl:block">
            <div className="sticky top-24">
              <h3 className="mb-4 text-sm font-medium text-gray-500">
                Live Preview
              </h3>
              <div className="scale-[0.6] origin-top">
                <ResumePreview template={selectedTemplate} data={resumeData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
