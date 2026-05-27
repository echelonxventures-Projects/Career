"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  RefreshCw,
  ChevronLeft,
  Loader2,
  Check,
  Save,
  Briefcase,
  User,
  Building2,
  Mail,
  Edit3,
  Eye,
} from "lucide-react";
import { format } from "date-fns";

interface CoverLetterData {
  recipient: {
    name: string;
    title: string;
    company: string;
    address: string;
  };
  jobTitle: string;
  company: string;
  jobDescription: string;
  body: string;
  signature: string;
  template: string;
}

const TEMPLATES = [
  { id: "professional", name: "Professional", description: "Traditional and formal" },
  { id: "modern", name: "Modern", description: "Clean and contemporary" },
  { id: "creative", name: "Creative", description: "Bold and distinctive" },
];

export default function CoverLetterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<"form" | "generating" | "result">("form");
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [data, setData] = useState<CoverLetterData>({
    recipient: { name: "", title: "", company: "", address: "" },
    jobTitle: "",
    company: "",
    jobDescription: "",
    body: "",
    signature: "",
    template: "professional",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const generateCoverLetter = async () => {
    setIsGenerating(true);
    setStep("generating");

    try {
      const response = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "cover_letter",
          context: {
            company: data.company,
            position: data.jobTitle,
            jobDescription: data.jobDescription,
          },
        }),
      });

      let generatedBody: string;

      if (response.ok) {
        const result = await response.json();
        generatedBody = result.suggestion;
      } else {
        // Fallback
        generatedBody = generateFallbackLetter(data);
      }

      setData((prev) => ({ ...prev, body: generatedBody }));
      setStep("result");
    } catch (error) {
      setData((prev) => ({ ...prev, body: generateFallbackLetter(data) }));
      setStep("result");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFallbackLetter = (data: CoverLetterData) => {
    return `Dear ${data.recipient.name || "Hiring Manager"},

I am writing to express my strong interest in the ${data.jobTitle} position at ${data.company}. With my background and expertise, I am confident I can make a significant contribution to your team.

${data.jobDescription ? `After reviewing the job description, I am particularly drawn to this role because of ${data.company}'s commitment to innovation and excellence. ` : ""}Throughout my career, I have developed skills that align well with the requirements of this position.

I am excited about the opportunity to bring my unique perspective and skills to ${data.company}. I would welcome the chance to discuss how my background and qualifications align with your team's needs.

Thank you for your time and consideration. I look forward to the possibility of discussing this opportunity further.

Best regards,
${session?.user?.name || "[Your Name]"}`;
  };

  const copyToClipboard = () => {
    const fullText = getFullLetterText();
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFullLetterText = () => {
    const today = format(new Date(), "MMMM d, yyyy");
    return `${today}

${data.recipient.name}${data.recipient.name ? "\n" : ""}${data.recipient.title}${data.recipient.title ? "\n" : ""}${data.company}${data.recipient.address ? "\n" + data.recipient.address : ""}

Dear ${data.recipient.name || "Hiring Manager"},

${data.body}

${data.signature || session?.user?.name || "Sincerely"},
${session?.user?.name || ""}`;
  };

  const downloadTxt = () => {
    const text = getFullLetterText();
    const blob = new Blob([text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Cover_Letter_${data.company.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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
              <h1 className="text-lg font-semibold text-gray-900">Cover Letter Generator</h1>
            </div>
          </div>
          {step === "result" && (
            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={downloadTxt}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-4 py-8">
        {step === "form" && (
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Choose a Template
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`rounded-lg border p-4 text-left transition-all ${
                      selectedTemplate === template.id
                        ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full border-2 ${
                          selectedTemplate === template.id
                            ? "border-indigo-500 bg-indigo-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedTemplate === template.id && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">
                        {template.name}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Job Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Job Information
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={data.jobTitle}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, jobTitle: e.target.value }))
                    }
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={data.company}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, company: e.target.value }))
                    }
                    placeholder="e.g. TechCorp"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Job Description (optional - helps AI generate better content)
                </label>
                <textarea
                  value={data.jobDescription}
                  onChange={(e) =>
                    setData((prev) => ({ ...prev, jobDescription: e.target.value }))
                  }
                  rows={4}
                  placeholder="Paste the job description here for more personalized content..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Recipient Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Recipient Information
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Hiring Manager Name
                  </label>
                  <input
                    type="text"
                    value={data.recipient.name}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        recipient: { ...prev.recipient, name: e.target.value },
                      }))
                    }
                    placeholder="e.g. John Smith"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    value={data.recipient.title}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        recipient: { ...prev.recipient, title: e.target.value },
                      }))
                    }
                    placeholder="e.g. Hiring Manager"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Company Address (optional)
                </label>
                <textarea
                  value={data.recipient.address}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      recipient: { ...prev.recipient, address: e.target.value },
                    }))
                  }
                  rows={2}
                  placeholder="Company address..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateCoverLetter}
              disabled={!data.jobTitle || !data.company}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-lg font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              <Sparkles className="h-5 w-5" />
              Generate Cover Letter
            </button>
          </div>
        )}

        {step === "generating" && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-24 w-24 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"></div>
              <Sparkles className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-indigo-600" />
            </div>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              Generating Your Cover Letter
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              AI is crafting a personalized letter for you...
            </p>
          </div>
        )}

        {step === "result" && (
          <div className="space-y-6">
            {/* Preview */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600">{format(new Date(), "MMMM d, yyyy")}</p>

                {(data.recipient.name || data.recipient.title || data.company || data.recipient.address) && (
                  <div className="mt-4">
                    {data.recipient.name && <p>{data.recipient.name}</p>}
                    {data.recipient.title && <p>{data.recipient.title}</p>}
                    {data.company && <p>{data.company}</p>}
                    {data.recipient.address && (
                      <p className="whitespace-pre-line">{data.recipient.address}</p>
                    )}
                  </div>
                )}

                <p className="mt-6">Dear {data.recipient.name || "Hiring Manager"},</p>

                <div className="mt-4 whitespace-pre-wrap">{data.body}</div>

                <div className="mt-8">
                  <p>{data.signature || "Sincerely"},</p>
                  <p className="mt-1">{session?.user?.name || "[Your Name]"}</p>
                </div>
              </div>
            </div>

            {/* Edit Section */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Edit Content
                </h2>
              </div>
              <textarea
                value={data.body}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, body: e.target.value }))
                }
                rows={12}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setStep("form")}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4" />
                Start Over
              </button>
              <button
                onClick={copyToClipboard}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied to Clipboard" : "Copy to Clipboard"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
