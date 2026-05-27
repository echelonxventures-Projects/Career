"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  ChevronLeft,
  Search,
  FileText,
  CheckCircle,
  Users,
  MessageCircle,
  Sparkles,
  Download,
  Quote,
  GraduationCap,
  Award,
  Clock,
  Target,
} from "lucide-react";

const thesisStages = [
  {
    id: "topic-selection",
    title: "Topic Selection",
    description: "Choose a relevant and feasible research topic",
    icon: Target,
    steps: [
      "Identify your research interests",
      "Conduct preliminary literature review",
      "Narrow down to specific research questions",
      "Validate topic feasibility with advisor",
      "Finalize research scope and objectives",
    ],
    resources: [
      { title: "Topic Selection Guide", type: "PDF" },
      { title: "Research Question Framework", type: "Template" },
      { title: "Literature Review Checklist", type: "Checklist" },
    ],
  },
  {
    id: "literature-review",
    title: "Literature Review",
    description: "Survey existing research in your field",
    icon: BookOpen,
    steps: [
      "Search academic databases (Google Scholar, JSTOR)",
      "Organize sources with reference manager",
      "Analyze and synthesize findings",
      "Identify research gaps",
      "Write comprehensive literature review chapter",
    ],
    resources: [
      { title: "Citation Manager Setup", type: "Guide" },
      { title: "Literature Matrix Template", type: "Template" },
      { title: "Academic Writing Style Guide", type: "PDF" },
    ],
  },
  {
    id: "methodology",
    title: "Research Methodology",
    description: "Design your research approach",
    icon: Target,
    steps: [
      "Choose qualitative, quantitative, or mixed methods",
      "Design data collection instruments",
      "Plan sampling strategy",
      "Address ethical considerations",
      "Write methodology chapter",
    ],
    resources: [
      { title: "Methodology Selection Tool", type: "Interactive" },
      { title: "Research Ethics Guidelines", type: "PDF" },
      { title: "Survey Design Best Practices", type: "Guide" },
    ],
  },
  {
    id: "data-collection",
    title: "Data Collection",
    description: "Gather research data",
    icon: Users,
    steps: [
      "Obtain necessary approvals (IRB)",
      "Recruit participants",
      "Conduct experiments/surveys/interviews",
      "Organize and store data securely",
      "Validate data quality",
    ],
    resources: [
      { title: "Data Collection Protocol", type: "Template" },
      { title: "Interview Guide Template", type: "Template" },
      { title: "Data Management Plan", type: "Guide" },
    ],
  },
  {
    id: "analysis",
    title: "Data Analysis",
    description: "Analyze and interpret your data",
    icon: Sparkles,
    steps: [
      "Clean and prepare data",
      "Apply statistical or thematic analysis",
      "Visualize findings",
      "Interpret results in context",
      "Write results/findings chapter",
    ],
    resources: [
      { title: "SPSS/R Tutorial", type: "Video" },
      { title: "Thematic Analysis Guide", type: "PDF" },
      { title: "Data Visualization Best Practices", type: "Guide" },
    ],
  },
  {
    id: "writing",
    title: "Thesis Writing",
    description: "Compile your research into a coherent document",
    icon: FileText,
    steps: [
      "Create detailed outline",
      "Write introduction chapter",
      "Compile literature review",
      "Document methodology",
      "Present results and discussion",
      "Write conclusion and recommendations",
      "Abstract and references",
    ],
    resources: [
      { title: "Thesis Template", type: "Template" },
      { title: "Academic Writing Checklist", type: "Checklist" },
      { title: "Formatting Guidelines", type: "PDF" },
    ],
  },
  {
    id: "defense",
    title: "Defense Preparation",
    description: "Prepare for thesis defense",
    icon: Award,
    steps: [
      "Create defense presentation",
      "Prepare for common questions",
      "Practice presentation",
      "Prepare supporting materials",
      "Schedule and conduct defense",
    ],
    resources: [
      { title: "Defense Presentation Template", type: "Template" },
      { title: "Common Defense Questions", type: "PDF" },
      { title: "Presentation Tips", type: "Guide" },
    ],
  },
];

const topicSuggestions = [
  { field: "Computer Science", topics: [
    "Machine Learning Applications in Healthcare",
    "Blockchain for Supply Chain Transparency",
    "Natural Language Processing for Low-Resource Languages",
    "Edge Computing in IoT Systems",
  ]},
  { field: "Business", topics: [
    "Impact of Remote Work on Organizational Culture",
    "Sustainability Practices in SMEs",
    "Consumer Behavior in Digital Marketing",
    "Fintech Adoption in Developing Markets",
  ]},
  { field: "Psychology", topics: [
    "Social Media Impact on Adolescent Mental Health",
    "Mindfulness-Based Stress Reduction in Workplace",
    "Cognitive Behavioral Therapy Online Effectiveness",
    "Sleep Quality and Academic Performance",
  ]},
  { field: "Education", topics: [
    "Gamification in Online Learning",
    "AI-Powered Personalized Learning Systems",
    "Teacher Training for Digital Classrooms",
    "Assessment Methods in Distance Education",
  ]},
];

export default function ThesisConsultancyPage() {
  const [activeStage, setActiveStage] = useState(0);
  const [selectedField, setSelectedField] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-indigo-600" />
              <h1 className="text-lg font-semibold text-gray-900">Thesis Consultancy</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 py-8">
        {/* Hero */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
          <div className="flex items-center gap-3">
            <BookOpen className="h-10 w-10" />
            <div>
              <h2 className="text-2xl font-bold">Complete Thesis Guidance</h2>
              <p className="mt-1 text-indigo-100">From topic selection to defense - we've got you covered</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>7 Stage Process</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Expert Advisors</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span>1-on-1 Support</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Topic Generator */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">AI Topic Generator</h3>
              <p className="text-sm text-gray-600">Get personalized thesis topic suggestions</p>
              <div className="mt-4 flex gap-2">
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="">Select your field...</option>
                  {topicSuggestions.map((field) => (
                    <option key={field.field} value={field.field}>{field.field}</option>
                  ))}
                </select>
                <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  <Sparkles className="h-4 w-4" />
                  Generate
                </button>
              </div>
              {selectedField && (
                <div className="mt-4 space-y-2">
                  {topicSuggestions
                    .find((f) => f.field === selectedField)
                    ?.topics.map((topic) => (
                      <div key={topic} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                        <span className="text-sm text-gray-700">{topic}</span>
                        <button className="text-xs text-indigo-600 hover:underline">Select</button>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Thesis Roadmap */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900">Thesis Roadmap</h3>
              <div className="mt-4 space-y-3">
                {thesisStages.map((stage, index) => (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(index)}
                    className={`w-full rounded-lg border p-4 text-left transition-all ${
                      activeStage === index
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        activeStage === index ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"
                      }`}>
                        <stage.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{stage.title}</p>
                          <span className="text-xs text-gray-500">Step {index + 1}/7</span>
                        </div>
                        <p className="text-sm text-gray-600">{stage.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Stage Details */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white">
                  {(() => {
                    const Icon = thesisStages[activeStage].icon;
                    return <Icon className="h-6 w-6" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {thesisStages[activeStage].title}
                  </h3>
                  <p className="text-sm text-gray-600">{thesisStages[activeStage].description}</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900">Action Steps:</h4>
                <ul className="mt-2 space-y-2">
                  {thesisStages[activeStage].steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900">Resources:</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {thesisStages[activeStage].resources.map((resource) => (
                    <button
                      key={resource.title}
                      className="flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs hover:bg-gray-50"
                    >
                      <Download className="h-3 w-3" />
                      {resource.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Citation Generator */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">Citation Generator</h3>
              <p className="text-sm text-gray-600">Generate citations in multiple formats</p>
              <div className="mt-4 space-y-2">
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                  <option>APA 7th Edition</option>
                  <option>MLA 9th Edition</option>
                  <option>Chicago</option>
                  <option>Harvard</option>
                  <option>IEEE</option>
                </select>
                <textarea
                  placeholder="Enter source details..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                  Generate Citation
                </button>
              </div>
            </div>

            {/* Plagiarism Checker */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">Plagiarism Checker</h3>
              <p className="text-sm text-gray-600">Check your thesis for originality</p>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Search className="h-4 w-4" />
                Upload Document
              </button>
            </div>

            {/* Advisor Matching */}
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
              <h3 className="font-semibold text-gray-900">Need Expert Help?</h3>
              <p className="mt-1 text-sm text-gray-600">Get matched with a thesis advisor</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  500+ Verified Advisors
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  24/7 Availability
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  Money-Back Guarantee
                </div>
              </div>
              <button className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                Find Advisor
              </button>
            </div>

            {/* Progress Tracker */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">Your Progress</h3>
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Overall Completion</span>
                  <span className="font-medium text-gray-900">28%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div className="h-2 w-[28%] rounded-full bg-indigo-600"></div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-lg bg-gray-50 p-2">
                  <p className="font-medium text-gray-900">45</p>
                  <p className="text-gray-500">Days Left</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-2">
                  <p className="font-medium text-gray-900">3/7</p>
                  <p className="text-gray-500">Stages Done</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
