"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FileText,
  Briefcase,
  CheckCircle,
  TrendingUp,
  Plus,
  Download,
  Edit,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  Search,
  FileEdit,
} from "lucide-react";
import { format } from "date-fns";

interface Resume {
  id: string;
  title: string;
  template: string;
  downloads: number;
  atsScore?: number;
  updatedAt: string;
  isDefault: boolean;
}

interface JobApplication {
  id: string;
  job: {
    title: string;
    company: string;
    companyLogo?: string;
  };
  status: string;
  appliedAt: string;
}

interface Activity {
  id: string;
  type: "resume_created" | "resume_downloaded" | "ats_check" | "job_applied" | "cover_letter_created";
  description: string;
  createdAt: string;
}

interface DashboardStats {
  totalResumes: number;
  totalDownloads: number;
  activeApplications: number;
  avgAtsScore: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalResumes: 0,
    totalDownloads: 0,
    activeApplications: 0,
    avgAtsScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  const fetchDashboardData = async () => {
    try {
      // Fetch resumes
      const resumesRes = await fetch("/api/resumes");
      if (resumesRes.ok) {
        const resumesData = await resumesRes.json();
        setResumes(resumesData.resumes || []);
      }

      // Fetch applications
      const appsRes = await fetch("/api/applications");
      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApplications(appsData.applications || []);
      }

      // Calculate stats
      const totalDownloads = resumes.reduce((sum, r) => sum + r.downloads, 0);
      const avgAtsScore = resumes.length > 0
        ? Math.round(resumes.reduce((sum, r) => sum + (r.atsScore || 0), 0) / resumes.length)
        : 0;

      setStats({
        totalResumes: resumes.length,
        totalDownloads,
        activeApplications: applications.filter(a =>
          ["APPLIED", "SCREENING", "INTERVIEW", "TECHNICAL"].includes(a.status)
        ).length,
        avgAtsScore,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {session.user?.name || "User"}
              </h1>
              <p className="text-sm text-gray-600">
                Here's what's happening with your career journey
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/resume-builder"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                New Resume
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4">
        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={FileText}
            label="Total Resumes"
            value={stats.totalResumes}
            trend="+2 this month"
            color="bg-blue-500"
          />
          <StatCard
            icon={Download}
            label="Downloads"
            value={stats.totalDownloads}
            trend="Resumes downloaded"
            color="bg-emerald-500"
          />
          <StatCard
            icon={Briefcase}
            label="Active Applications"
            value={stats.activeApplications}
            trend="In progress"
            color="bg-orange-500"
          />
          <StatCard
            icon={CheckCircle}
            label="Avg ATS Score"
            value={`${stats.avgAtsScore}%`}
            trend={stats.avgAtsScore >= 80 ? "Excellent" : stats.avgAtsScore >= 60 ? "Good" : "Needs work"}
            color="bg-purple-500"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <QuickActionCard
                  href="/resume-builder"
                  icon={FileEdit}
                  title="Build Resume"
                  description="Create or edit your resume"
                  color="bg-blue-50 text-blue-600"
                />
                <QuickActionCard
                  href="/ats-checker"
                  icon={CheckCircle}
                  title="Check ATS Score"
                  description="Optimize for ATS systems"
                  color="bg-emerald-50 text-emerald-600"
                />
                <QuickActionCard
                  href="/cover-letter"
                  icon={FileText}
                  title="Cover Letter"
                  description="Generate personalized letters"
                  color="bg-purple-50 text-purple-600"
                />
                <QuickActionCard
                  href="/job-search"
                  icon={Search}
                  title="Find Jobs"
                  description="Search job opportunities"
                  color="bg-orange-50 text-orange-600"
                />
              </div>
            </section>

            {/* Recent Resumes */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Your Resumes
                </h2>
                <Link
                  href="/resumes"
                  className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {resumes.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-600">No resumes yet</p>
                  <Link
                    href="/resume-builder"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4" />
                    Create your first resume
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumes.slice(0, 5).map((resume) => (
                    <div
                      key={resume.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                          <FileText className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {resume.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            Updated {format(new Date(resume.updatedAt), "MMM d, yyyy")}
                            {resume.atsScore && ` • ATS: ${resume.atsScore}%`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/resume-builder?id=${resume.id}`}
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => downloadResume(resume.id)}
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Recent Applications */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Applications
                </h2>
                <Link
                  href="/applications"
                  className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-gray-600">No applications yet</p>
                  <Link
                    href="/job-search"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    <Search className="h-4 w-4" />
                    Find jobs
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                          {app.job.companyLogo ? (
                            <img
                              src={app.job.companyLogo}
                              alt={app.job.company}
                              className="h-8 w-8 rounded object-contain"
                            />
                          ) : (
                            <Briefcase className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {app.job.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {app.job.company} • Applied {format(new Date(app.appliedAt), "MMM d")}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Suggestions */}
            <section className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  AI Suggestions
                </h2>
              </div>
              <div className="mt-4 space-y-3">
                <AISuggestionCard
                  title="Optimize your resume"
                  description="Your resume could score 15% higher with these changes..."
                  action="View suggestions"
                  href="/ats-checker"
                />
                <AISuggestionCard
                  title="Apply to trending jobs"
                  description="5 new jobs match your profile this week"
                  action="View jobs"
                  href="/job-search"
                />
                <AISuggestionCard
                  title="Complete your profile"
                  description="Add a LinkedIn link to increase visibility"
                  action="Update profile"
                  href="/settings"
                />
              </div>
            </section>

            {/* Recent Activity */}
            <section className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    <Clock className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm">No recent activity</p>
                  </div>
                ) : (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                        <ActivityIcon type={activity.type} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(activity.createdAt), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Upgrade Card */}
            <section className="rounded-xl border border-gray-200 bg-gray-900 p-6 text-white">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-400" />
                <h2 className="text-lg font-semibold">Upgrade to Pro</h2>
              </div>
              <p className="mt-2 text-sm text-gray-300">
                Get unlimited resumes, advanced ATS scoring, and priority support.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Unlimited resumes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  Advanced ATS scoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  AI cover letters
                </li>
              </ul>
              <Link
                href="/pricing"
                className="mt-4 block w-full rounded-lg bg-indigo-600 py-2 text-center text-sm font-medium hover:bg-indigo-500"
              >
                View Plans
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: {
  icon: typeof FileText;
  label: string;
  value: number | string;
  trend: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color} text-white`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500">{trend}</p>
    </div>
  );
}

function QuickActionCard({
  href,
  icon: Icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: typeof FileText;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </Link>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    APPLIED: "bg-blue-100 text-blue-700",
    SCREENING: "bg-yellow-100 text-yellow-700",
    INTERVIEW: "bg-purple-100 text-purple-700",
    TECHNICAL: "bg-orange-100 text-orange-700",
    OFFER: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-red-100 text-red-700",
    HIRED: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function AISuggestionCard({
  title,
  description,
  action,
  href,
}: {
  title: string;
  description: string;
  action: string;
  href: string;
}) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <h3 className="font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
      <Link
        href={href}
        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        {action}
        <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case "resume_created":
      return <FileText className="h-4 w-4 text-blue-600" />;
    case "resume_downloaded":
      return <Download className="h-4 w-4 text-emerald-600" />;
    case "ats_check":
      return <CheckCircle className="h-4 w-4 text-purple-600" />;
    case "job_applied":
      return <Briefcase className="h-4 w-4 text-orange-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
}

async function downloadResume(resumeId: string) {
  // Implementation would call API to download PDF
  console.log("Download resume:", resumeId);
}
