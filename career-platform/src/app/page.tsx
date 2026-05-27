import Link from "next/link";
import {
  FileText,
  Search,
  CheckCircle,
  Briefcase,
  Link as LinkIcon,
  CreditCard,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Award
} from "lucide-react";

const services = [
  {
    title: "Resume Builder",
    description: "Create professional resumes with AI-powered suggestions and multiple templates.",
    icon: FileText,
    href: "/resume-builder",
    color: "bg-blue-500",
  },
  {
    title: "CV Builder",
    description: "Build academic and research-focused CVs tailored for your field.",
    icon: Briefcase,
    href: "/cv-builder",
    color: "bg-emerald-500",
  },
  {
    title: "Cover Letters",
    description: "Generate personalized cover letters for any job application.",
    icon: FileText,
    href: "/cover-letter",
    color: "bg-purple-500",
  },
  {
    title: "Job Search",
    description: "Find jobs from multiple sources and track your applications.",
    icon: Search,
    href: "/job-search",
    color: "bg-orange-500",
  },
  {
    title: "ATS Checker",
    description: "Optimize your resume for Applicant Tracking Systems.",
    icon: CheckCircle,
    href: "/ats-checker",
    color: "bg-rose-500",
  },
  {
    title: "LinkedIn Tools",
    description: "Import profiles, optimize content, and share job applications.",
    icon: LinkIcon,
    href: "/linkedin",
    color: "bg-sky-600",
  },
];

const stats = [
  { label: "Resumes Created", value: "50K+", icon: FileText },
  { label: "Jobs Found", value: "100K+", icon: Search },
  { label: "Success Rate", value: "85%", icon: TrendingUp },
  { label: "Happy Users", value: "25K+", icon: Users },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-600 via-indigo-700 to-indigo-800 pb-32 pt-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Career Platform</span>
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your Complete Career
              <span className="text-indigo-200"> Success Platform</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100">
              Build resumes, write cover letters, check ATS scores, find jobs, and manage your entire job search in one place.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/auth/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-lg transition-all hover:bg-indigo-50 hover:shadow-xl"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/20"
              >
                View All Services
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white/10 p-6 backdrop-blur sm:grid-cols-4 sm:gap-8 sm:p-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto h-8 w-8 text-indigo-200" />
                <div className="mt-2 text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-indigo-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative -mt-20 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className={`${service.color} absolute right-4 top-4 rounded-xl p-3 text-white opacity-80 transition-opacity group-hover:opacity-100`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                <p className="mt-2 text-gray-600">{service.description}</p>
                <div className="mt-4 flex items-center text-indigo-600 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="font-medium">Get started</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to land your dream job</h2>
            <p className="mt-4 text-lg text-gray-600">Powerful features designed to accelerate your career growth</p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Award}
              title="ATS-Optimized Templates"
              description="Resume templates designed to pass Applicant Tracking Systems with high scores."
            />
            <FeatureCard
              icon={Sparkles}
              title="AI-Powered Writing"
              description="Smart suggestions for bullet points, summaries, and cover letter content."
            />
            <FeatureCard
              icon={Search}
              title="Job Aggregation"
              description="Search jobs from LinkedIn, Indeed, Glassdoor, and other major platforms."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Real-time ATS Check"
              description="Instant feedback on your resume's ATS compatibility before applying."
            />
            <FeatureCard
              icon={LinkIcon}
              title="LinkedIn Integration"
              description="Import your profile and share applications directly to LinkedIn."
            />
            <FeatureCard
              icon={CreditCard}
              title="Flexible Pricing"
              description="From free basic features to premium plans for power users."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-900 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ready to advance your career?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-200">
            Join thousands of professionals who use Career Platform to find their dream jobs.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-indigo-900 shadow-lg transition-all hover:bg-indigo-50"
            >
              Create Free Account
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Award;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="inline-flex rounded-lg bg-indigo-50 p-3">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}
