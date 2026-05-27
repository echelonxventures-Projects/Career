"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Building2,
  Bookmark,
  BookmarkCheck,
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  Loader2,
  X,
  SlidersHorizontal,
  FileText,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Zap,
  Target,
  Users,
  Award,
  Rocket,
} from "lucide-react";
import { format } from "date-fns";
import { Job, JobType } from "@/types";

interface JobFilters {
  query: string;
  location: string;
  jobType: string;
  remote: boolean | null;
  minSalary: string;
  maxSalary: string;
  experience: string;
  industry: string;
}

const JOB_TYPES: { value: string; label: string }[] = [
  { value: "", label: "All Types" },
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "TEMPORARY", label: "Temporary" },
];

const REMOTE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Any" },
  { value: "true", label: "Remote only" },
  { value: "false", label: "On-site" },
];

const EXPERIENCE_LEVELS: { value: string; label: string }[] = [
  { value: "", label: "Any Experience" },
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Lead / Manager" },
];

const INDUSTRIES: { value: string; label: string }[] = [
  { value: "", label: "All Industries" },
  { value: "tech", label: "Technology" },
  { value: "healthcare", label: "Healthcare" },
  { value: "finance", label: "Finance & Banking" },
  { value: "retail", label: "Retail & Consumer" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "education", label: "Education" },
  { value: "media", label: "Media & Entertainment" },
  { value: "consulting", label: "Consulting" },
];

const POPULAR_CATEGORIES = [
  { name: "Software Engineering", count: 12543, icon: Zap },
  { name: "Data Science", count: 8234, icon: Target },
  { name: "Product Management", count: 5634, icon: Rocket },
  { name: "Design", count: 4532, icon: Sparkles },
  { name: "Marketing", count: 3821, icon: TrendingUp },
  { name: "Sales", count: 6743, icon: Users },
];

const TOP_COMPANIES = [
  { name: "Google", jobs: 1234, logo: "G" },
  { name: "Microsoft", jobs: 987, logo: "M" },
  { name: "Amazon", jobs: 2341, logo: "A" },
  { name: "Meta", jobs: 543, logo: "M" },
  { name: "Apple", jobs: 876, logo: "A" },
  { name: "Netflix", jobs: 234, logo: "N" },
];

const JOB_SOURCES = [
  { name: "LinkedIn", count: 52341 },
  { name: "Indeed", count: 45234 },
  { name: "Glassdoor", count: 28976 },
  { name: "AngelList", count: 15678 },
  { name: "We Work Remotely", count: 8943 },
];

export default function JobSearchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({
    query: "",
    location: "",
    jobType: "",
    remote: null,
    minSalary: "",
    maxSalary: "",
    experience: "",
    industry: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append("q", filters.query);
      if (filters.location) params.append("location", filters.location);
      if (filters.jobType) params.append("type", filters.jobType);
      if (filters.remote !== null) params.append("remote", String(filters.remote));
      params.append("page", String(pagination.page));
      params.append("limit", String(pagination.limit));

      const response = await fetch(`/api/jobs?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
        setPagination(data.pagination || pagination);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      // Fallback to mock data
      setJobs(getMockJobs());
      setPagination({ ...pagination, total: 25, pages: 2 });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof JobFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      location: "",
      jobType: "",
      remote: null,
      minSalary: "",
      maxSalary: "",
      experience: "",
      industry: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const toggleSaveJob = async (jobId: string) => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}/save`, {
        method: "POST",
      });
      if (response.ok) {
        setJobs((prev) =>
          prev.map((job) =>
            job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
          )
        );
      }
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

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
              <Search className="h-6 w-6 text-indigo-600" />
              <h1 className="text-lg font-semibold text-gray-900">Job Search</h1>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            My Applications
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4">
        {/* Hero Stats */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white">
          <div className="flex items-center gap-3">
            <Globe className="h-10 w-10" />
            <div>
              <h2 className="text-2xl font-bold">Global Job Search Engine</h2>
              <p className="mt-1 text-indigo-100">
                Search 150,000+ jobs from 50+ sources worldwide
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-2xl font-bold">150K+</p>
              <p className="text-sm text-indigo-200">Active Jobs</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-2xl font-bold">50+</p>
              <p className="text-sm text-indigo-200">Job Sources</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-2xl font-bold">190+</p>
              <p className="text-sm text-indigo-200">Countries</p>
            </div>
            <div className="rounded-lg bg-white/10 p-4">
              <p className="text-2xl font-bold">10K+</p>
              <p className="text-sm text-indigo-200">Companies</p>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Popular Categories</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR_CATEGORIES.map((category) => (
              <button
                key={category.name}
                onClick={() => handleFilterChange("query", category.name)}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                  <category.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{category.name}</p>
                  <p className="text-sm text-gray-600">{category.count.toLocaleString()} jobs</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.query}
                onChange={(e) => handleFilterChange("query", e.target.value)}
                placeholder="Search jobs, companies, or keywords"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                placeholder="Location (city, state, or remote)"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:w-auto"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {(filters.jobType || filters.remote !== null) && (
                <span className="ml-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                  Active
                </span>
              )}
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Job Type
                  </label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange("jobType", e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    {JOB_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Remote
                  </label>
                  <select
                    value={filters.remote === null ? "" : String(filters.remote)}
                    onChange={(e) =>
                      handleFilterChange(
                        "remote",
                        e.target.value === "" ? null : e.target.value === "true"
                      )
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  >
                    {REMOTE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Min Salary
                  </label>
                  <input
                    type="number"
                    value={filters.minSalary}
                    onChange={(e) => handleFilterChange("minSalary", e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Max Salary
                  </label>
                  <input
                    type="number"
                    value={filters.maxSalary}
                    onChange={(e) => handleFilterChange("maxSalary", e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading jobs...
              </span>
            ) : (
              <>
                Showing <span className="font-medium">{jobs.length}</span> of{" "}
                <span className="font-medium">{pagination.total}</span> jobs
              </>
            )}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none">
              <option>Most Relevant</option>
              <option>Newest</option>
              <option>Highest Salary</option>
            </select>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
          {/* Job List */}
          <div className="space-y-4">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                <Search className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No jobs found
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Try adjusting your search filters or try different keywords
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onToggleSave={() => toggleSaveJob(job.id)}
                  isAuthenticated={!!session}
                />
              ))
            )}

            {/* Pagination */}
            {!loading && jobs.length > 0 && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() =>
                    setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))
                  }
                  disabled={pagination.page === 1}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() =>
                    setPagination((p) => ({
                      ...p,
                      page: Math.min(p.pages, p.page + 1),
                    }))
                  }
                  disabled={pagination.page === pagination.pages}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Saved Jobs & Tips */}
          <div className="space-y-4">
            {/* Saved Jobs Preview */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900">Saved Jobs</h3>
              <p className="text-sm text-gray-600">
                Sign in to save jobs and track applications
              </p>
              {!session && (
                <Link
                  href="/auth/signin"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Top Companies Hiring */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900">Top Companies Hiring</h3>
              <div className="mt-3 space-y-2">
                {TOP_COMPANIES.map((company) => (
                  <div
                    key={company.name}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleFilterChange("query", company.name)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-lg font-bold text-gray-600">
                        {company.logo}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{company.name}</p>
                        <p className="text-xs text-gray-600">{company.jobs} open positions</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Job Sources */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900">Job Sources</h3>
              <div className="mt-3 space-y-2">
                {JOB_SOURCES.map((source) => (
                  <div key={source.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{source.name}</span>
                    <span className="text-gray-500">{source.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Job Search Tips */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900">Search Tips</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  Use specific job titles for better results
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  Include remote to find work-from-home positions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  Set salary expectations to filter appropriately
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-600">•</span>
                  Save jobs to apply later with your optimized resume
                </li>
              </ul>
            </div>

            {/* Career Resources */}
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
              <h3 className="font-semibold text-gray-900">Boost Your Chances</h3>
              <div className="mt-3 space-y-3">
                <Link
                  href="/resume-builder"
                  className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Build Resume</p>
                    <p className="text-xs text-gray-600">Create ATS-friendly resume</p>
                  </div>
                </Link>
                <Link
                  href="/ats-checker"
                  className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Check ATS Score</p>
                    <p className="text-xs text-gray-600">Optimize before applying</p>
                  </div>
                </Link>
                <Link
                  href="/cover-letter"
                  className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Cover Letter</p>
                    <p className="text-xs text-gray-600">Generate personalized letter</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function JobCard({
  job,
  onToggleSave,
  isAuthenticated,
}: {
  job: Job;
  onToggleSave: () => void;
  isAuthenticated: boolean;
}) {
  const [showApplyModal, setShowApplyModal] = useState(false);

  const formatSalary = (salary: any) => {
    if (!salary) return null;
    const { min, max, currency = "USD", period = "yearly" } = salary;
    const symbol = currency === "USD" ? "$" : currency;
    const formatted = `${symbol}${min?.toLocaleString() || ""}${max ? ` - ${symbol}${max.toLocaleString()}` : ""}`;
    return `${formatted}/${period === "hourly" ? "hr" : period === "monthly" ? "mo" : "yr"}`;
  };

  const getJobTypeLabel = (type: JobType) => {
    const labels: Record<string, string> = {
      FULL_TIME: "Full-time",
      PART_TIME: "Part-time",
      CONTRACT: "Contract",
      INTERNSHIP: "Internship",
      FREELANCE: "Freelance",
      TEMPORARY: "Temporary",
    };
    return labels[type] || type;
  };

  return (
    <>
      <div className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <Building2 className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
                {job.title}
              </h3>
              <p className="text-sm text-gray-600">{job.company}</p>
            </div>
          </div>
          <button
            onClick={onToggleSave}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            {job.isSaved ? (
              <BookmarkCheck className="h-5 w-5 text-indigo-600" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
          )}
          {job.remote && (
            <span className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              Remote
            </span>
          )}
          <span className="flex items-center gap-1">
            <Briefcase className="h-4 w-4" />
            {getJobTypeLabel(job.jobType)}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {formatSalary(job.salary)}
            </span>
          )}
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-gray-600">
          {job.description}
        </p>

        {job.requirements && job.requirements.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {job.requirements.slice(0, 3).map((req) => (
              <span
                key={req}
                className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
              >
                {req}
              </span>
            ))}
            {job.requirements.length > 3 && (
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">
                +{job.requirements.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            Posted {format(new Date(job.postedAt), "MMM d")}
          </div>
          <div className="flex items-center gap-2">
            {job.sourceUrl && (
              <a
                href={job.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <ExternalLink className="h-4 w-4" />
                View
              </a>
            )}
            <button
              onClick={() => setShowApplyModal(true)}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Apply Modal - Simplified */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Apply to Position</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="rounded-lg p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              You are applying for <strong>{job.title}</strong> at <strong>{job.company}</strong>
            </p>
            {!isAuthenticated ? (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Sign in to apply with your saved resumes</p>
                <Link
                  href="/auth/signin"
                  className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Sign In to Apply
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <Link
                  href={`/applications/apply?jobId=${job.id}`}
                  className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Continue Application
                </Link>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// Mock data for demo
function getMockJobs(): Job[] {
  return [
    {
      id: "1",
      title: "Senior Software Engineer",
      company: "TechCorp",
      companyLogo: "/companies/techcorp.png",
      location: "San Francisco, CA",
      remote: true,
      salary: { min: 150000, max: 200000, currency: "USD", period: "yearly" },
      jobType: "FULL_TIME",
      description: "Join our engineering team to build scalable web applications using React, Node.js, and AWS. You'll work on high-impact projects that serve millions of users.",
      requirements: ["5+ years experience", "React", "Node.js", "AWS"],
      responsibilities: ["Build features", "Code reviews", "Mentoring"],
      benefits: ["Health insurance", "401k", "Unlimited PTO"],
      source: "Internal",
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      id: "2",
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "New York, NY",
      remote: false,
      salary: { min: 120000, max: 160000, currency: "USD", period: "yearly" },
      jobType: "FULL_TIME",
      description: "We're looking for a full stack developer to help us build the next generation of our product. Experience with TypeScript and PostgreSQL preferred.",
      requirements: ["3+ years experience", "TypeScript", "PostgreSQL"],
      responsibilities: ["Full stack development", "Database design"],
      benefits: ["Equity", "Flexible hours"],
      source: "Indeed",
      postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
    {
      id: "3",
      title: "Frontend Engineer",
      company: "DesignHub",
      location: "Remote",
      remote: true,
      salary: { min: 100000, max: 140000, currency: "USD", period: "yearly" },
      jobType: "FULL_TIME",
      description: "Create beautiful and accessible user interfaces. Work with designers and backend engineers to deliver exceptional user experiences.",
      requirements: ["React", "CSS", "Accessibility"],
      responsibilities: ["UI development", "Design system"],
      benefits: ["Remote work", "Learning budget"],
      source: "LinkedIn",
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  ];
}
