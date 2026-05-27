"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  ChevronRight,
  Loader2,
  Camera,
  Mail,
  Key,
  Trash2,
  AlertTriangle,
} from "lucide-react";

const settingsNav = [
  { id: "profile", name: "Profile", icon: User, href: "/settings" },
  { id: "notifications", name: "Notifications", icon: Bell, href: "/settings/notifications" },
  { id: "security", name: "Security", icon: Shield, href: "/settings/security" },
  { id: "billing", name: "Billing", icon: CreditCard, href: "/settings/billing" },
];

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    location: "",
    website: "",
    bio: "",
  });

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

  const handleSave = async () => {
    setIsSaving(true);
    // In real implementation, call API to update profile
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-600">
            Manage your account and preferences
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar Navigation */}
          <nav className="space-y-1">
            {settingsNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </button>
            ))}
          </nav>

          {/* Main Content */}
          <div className="space-y-6">
            {activeTab === "profile" && (
              <>
                {/* Profile Info */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Profile Information
                  </h2>
                  <p className="text-sm text-gray-600">
                    Update your personal information and profile picture
                  </p>

                  {/* Avatar */}
                  <div className="mt-6 flex items-center gap-4">
                    <div className="relative">
                      {session?.user?.image ? (
                        <img
                          src={session?.user?.image}
                          alt={session?.user?.name || ""}
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                          <User className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                      <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Change Photo
                      </button>
                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+1 (555) 123-4567"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="City, Country"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        placeholder="https://yourwebsite.com"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>

                {/* Delete Account */}
                <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    <div>
                      <h3 className="font-semibold text-red-900">
                        Delete Account
                      </h3>
                      <p className="mt-1 text-sm text-red-700">
                        Once you delete your account, all your data will be
                        permanently removed. This action cannot be undone.
                      </p>
                      <button className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "notifications" && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Notification Preferences
                </h2>
                <p className="text-sm text-gray-600">
                  Choose what notifications you want to receive
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    {
                      id: "job-alerts",
                      label: "Job Alerts",
                      description: "Get notified when new jobs match your criteria",
                    },
                    {
                      id: "application-updates",
                      label: "Application Updates",
                      description: "Receive updates on your job applications",
                    },
                    {
                      id: "ats-scores",
                      label: "ATS Score Updates",
                      description: "Get notified when your resume ATS scores are ready",
                    },
                    {
                      id: "tips",
                      label: "Career Tips",
                      description: "Weekly tips and insights for your career",
                    },
                    {
                      id: "marketing",
                      label: "Marketing Emails",
                      description: "Receive offers and promotions",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.label}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" />
                        <div className="h-6 w-11 rounded-full bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Password
                  </h2>
                  <p className="text-sm text-gray-600">
                    Update your password regularly to keep your account secure
                  </p>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <button className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Two-Factor Authentication
                  </h2>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security to your account
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                        <Key className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Authenticator App
                        </h3>
                        <p className="text-sm text-gray-600">
                          Use an authenticator app to generate codes
                        </p>
                      </div>
                    </div>
                    <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Enable
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "billing" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Current Plan
                  </h2>
                  <div className="mt-6 flex items-center justify-between rounded-lg bg-indigo-50 p-4">
                    <div>
                      <p className="font-semibold text-indigo-900">Free Plan</p>
                      <p className="text-sm text-indigo-700">
                        Basic features for getting started
                      </p>
                    </div>
                    <Link
                      href="/pricing"
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Upgrade
                    </Link>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Payment Methods
                  </h2>
                  <p className="text-sm text-gray-600">
                    Manage your payment methods
                  </p>

                  <div className="mt-6 text-center">
                    <p className="text-gray-500">No payment methods added</p>
                    <button className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Add Payment Method
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Billing History
                  </h2>
                  <p className="text-sm text-gray-600">
                    View your past invoices
                  </p>

                  <div className="mt-6 text-center">
                    <p className="text-gray-500">No billing history</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
