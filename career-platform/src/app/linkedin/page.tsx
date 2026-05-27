"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Link as LinkIcon,
  ChevronLeft,
  Download,
  Share2,
  Sparkles,
  User,
  Briefcase,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  MessageSquare,
  Users,
  Loader2,
} from "lucide-react";

export default function LinkedInToolsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

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

  const handleConnect = () => {
    // In real implementation, this would trigger LinkedIn OAuth
    setIsConnected(true);
    setProfileData({
      headline: "Software Engineer at TechCorp",
      summary: "Passionate about building scalable applications...",
      connections: 500,
      followers: 1200,
    });
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
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
              <LinkIcon className="h-6 w-6 text-[#0A66C2]" />
              <h1 className="text-lg font-semibold text-gray-900">LinkedIn Tools</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 py-8">
        {/* Connection Status */}
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0A66C2]">
                <LinkIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  LinkedIn Integration
                </h2>
                <p className="text-sm text-gray-600">
                  {isConnected
                    ? "Your profile is connected and synced"
                    : "Connect your LinkedIn profile to import data and share applications"}
                </p>
              </div>
            </div>
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <CheckCircle className="h-5 w-5" />
                  Connected
                </div>
                <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                  {isSyncing ? "Syncing..." : "Sync"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="flex items-center gap-2 rounded-lg bg-[#0A66C2] px-4 py-2 text-sm font-medium text-white hover:bg-[#0052a3]"
              >
                <LinkIcon className="h-4 w-4" />
                Connect LinkedIn
              </button>
            )}
          </div>

          {isConnected && profileData && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    Headline
                  </div>
                  <p className="mt-1 font-medium text-gray-900">
                    {profileData.headline}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    Connections
                  </div>
                  <p className="mt-1 font-medium text-gray-900">
                    {profileData.connections}+
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Share2 className="h-4 w-4" />
                    Followers
                  </div>
                  <p className="mt-1 font-medium text-gray-900">
                    {profileData.followers}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tools Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Import Profile */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Import Profile</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Import your LinkedIn profile data directly into your resume
                </p>
                <button
                  disabled={!isConnected}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Import to Resume
                </button>
              </div>
            </div>
          </div>

          {/* Profile Optimization */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                <Sparkles className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Profile Optimization
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Get AI-powered suggestions to improve your LinkedIn profile
                </p>
                <button
                  disabled={!isConnected}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  Get Suggestions
                </button>
              </div>
            </div>
          </div>

          {/* Share Applications */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Share2 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Share Applications
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Share your job applications to your LinkedIn network
                </p>
                <button
                  disabled={!isConnected}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  <Share2 className="h-4 w-4" />
                  Share to LinkedIn
                </button>
              </div>
            </div>
          </div>

          {/* Post Generator */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Post Generator</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Generate engaging LinkedIn posts for job announcements
                </p>
                <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">
                  <MessageSquare className="h-4 w-4" />
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        {!isConnected && (
          <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <LinkIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Connect Your LinkedIn Profile
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Connect your LinkedIn account to unlock powerful tools for job
              searching and profile optimization.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                One-click profile import
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                AI optimization suggestions
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Share applications
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
