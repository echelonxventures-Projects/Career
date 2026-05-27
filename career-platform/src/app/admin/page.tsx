"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Puzzle,
  Palette,
  Globe,
  Users,
  BarChart3,
  ChevronLeft,
  ToggleLeft,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Database,
  Code,
  Sparkles,
} from "lucide-react";

const adminNav = [
  { id: "general", name: "General", icon: Settings },
  { id: "templates", name: "Resume Templates", icon: Palette },
  { id: "integrations", name: "Integrations", icon: Puzzle },
  { id: "features", name: "Feature Flags", icon: ToggleLeft },
  { id: "database", name: "Database", icon: Database },
  { id: "api", name: "API Management", icon: Code },
  { id: "ai", name: "AI Configuration", icon: Sparkles },
  { id: "analytics", name: "Analytics", icon: BarChart3 },
  { id: "users", name: "Users", icon: Users },
];

// Dynamic Template Manager
const DynamicTemplateManager = () => {
  const [templates, setTemplates] = useState([
    { id: "modern", name: "Modern", category: "General", active: true },
    { id: "executive", name: "Executive", category: "Professional", active: true },
    { id: "technical", name: "Technical", category: "Professional", active: true },
  ]);
  const [newTemplate, setNewTemplate] = useState({ name: "", category: "", description: "" });

  const addTemplate = () => {
    if (newTemplate.name) {
      setTemplates([...templates, { ...newTemplate, id: Date.now().toString(), active: true }]);
      setNewTemplate({ name: "", category: "", description: "" });
    }
  };

  const toggleTemplate = (id: string) => {
    setTemplates(templates.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Dynamic Template Manager</h3>
        <p className="text-sm text-gray-600">Add, edit, or disable resume templates without code changes</p>

        {/* Add New Template */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <input
            type="text"
            placeholder="Template Name"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Category"
            value={newTemplate.category}
            onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button
            onClick={addTemplate}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Template
          </button>
        </div>

        {/* Template List */}
        <div className="mt-6 space-y-2">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
            >
              <div>
                <p className="font-medium text-gray-900">{template.name}</p>
                <p className="text-xs text-gray-500">{template.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleTemplate(template.id)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium ${
                    template.active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {template.active ? "Active" : "Disabled"}
                </button>
                <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Template Editor Preview */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Template Editor</h3>
        <p className="text-sm text-gray-600">Edit template HTML/CSS dynamically</p>
        <div className="mt-4">
          <textarea
            rows={10}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 font-mono text-sm"
            placeholder="<!-- Template HTML will appear here -->"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Save className="h-4 w-4" />
            Save Template
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <RefreshCw className="h-4 w-4" />
            Preview
          </button>
        </div>
      </div>
    </div>
  );
};

// Feature Flags Manager
const FeatureFlagsManager = () => {
  const [features, setFeatures] = useState([
    { id: "resume-builder", name: "Resume Builder", enabled: true, rollout: 100 },
    { id: "ats-checker", name: "ATS Checker", enabled: true, rollout: 100 },
    { id: "ai-suggestions", name: "AI Suggestions", enabled: true, rollout: 50 },
    { id: "beta-templates", name: "Beta Templates", enabled: false, rollout: 0 },
  ]);

  const toggleFeature = (id: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-gray-900">Feature Flags</h3>
      <p className="text-sm text-gray-600">Toggle features and control rollout percentages</p>

      <div className="mt-6 space-y-4">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
          >
            <div>
              <p className="font-medium text-gray-900">{feature.name}</p>
              <p className="text-xs text-gray-500">Rollout: {feature.rollout}%</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={feature.rollout}
                className="w-32"
              />
              <button
                onClick={() => toggleFeature(feature.id)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  feature.enabled ? "bg-indigo-600" : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    feature.enabled ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// AI Configuration Panel
const AIConfigurationPanel = () => {
  const [config, setConfig] = useState({
    provider: "openai",
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2000,
    fallbackEnabled: true,
    caching: true,
    personalization: true,
    autoOptimize: true,
  });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">AI Configuration</h3>
        <p className="text-sm text-gray-600">Configure AI providers and behavior</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Provider</label>
            <select
              value={config.provider}
              onChange={(e) => setConfig({ ...config, provider: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="cohere">Cohere</option>
              <option value="auto">Auto-Select</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Model</label>
            <select
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-2">Claude 2</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Temperature</label>
            <input
              type="number"
              min="0"
              max="1"
              step="0.1"
              value={config.temperature}
              onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Max Tokens</label>
            <input
              type="number"
              value={config.maxTokens}
              onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {[
            { key: "fallbackEnabled", label: "Enable Fallback Provider" },
            { key: "caching", label: "Enable Response Caching" },
            { key: "personalization", label: "Enable Personalization" },
            { key: "autoOptimize", label: "Auto-Optimize Prompts" },
          ].map((option) => (
            <div key={option.key} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={config[option.key as keyof typeof config] as boolean}
                onChange={(e) =>
                  setConfig({ ...config, [option.key]: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-indigo-600"
              />
              <label className="text-sm text-gray-700">{option.label}</label>
            </div>
          ))}
        </div>

        <button className="mt-6 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700">
          Save Configuration
        </button>
      </div>

      {/* Self-Improvement Stats */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Self-Improvement Metrics</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-2xl font-bold text-indigo-600">94%</p>
            <p className="text-xs text-gray-500">Recommendation Accuracy</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">12%</p>
            <p className="text-xs text-gray-500">ATS Score Improvement</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">8.5k</p>
            <p className="text-xs text-gray-500">Training Data Points</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");

  // Check if user is admin
  const isAdmin = (session?.user as any)?.role === "ADMIN" || false;

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="mt-2 text-gray-600">You need admin privileges to access this page.</p>
        <Link
          href="/"
          className="mt-4 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Go Home
        </Link>
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
              <span className="hidden sm:inline">Back to App</span>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              System Operational
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl p-4">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar Navigation */}
          <nav className="space-y-1">
            {adminNav.map((item) => (
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
              </button>
            ))}
          </nav>

          {/* Main Content */}
          <div>
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h2 className="text-lg font-semibold text-gray-900">System Configuration</h2>
                  <p className="text-sm text-gray-600">
                    Manage your self-evolving career platform
                  </p>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="font-medium text-gray-900">System Mode</h3>
                      <select className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                        <option>Self-Evolving (AI-Enhanced)</option>
                        <option>Standard</option>
                        <option>Maintenance</option>
                      </select>
                    </div>
                    <div className="rounded-lg border border-gray-200 p-4">
                      <h3 className="font-medium text-gray-900">Learning Mode</h3>
                      <select className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                        <option>Continuous Learning</option>
                        <option>Scheduled Updates</option>
                        <option>Manual Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                <FeatureFlagsManager />
              </div>
            )}

            {activeTab === "templates" && <DynamicTemplateManager />}

            {activeTab === "ai" && <AIConfigurationPanel />}

            {activeTab === "features" && <FeatureFlagsManager />}

            {activeTab === "integrations" && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900">Integrations</h3>
                <p className="text-sm text-gray-600">Manage third-party integrations</p>
                <div className="mt-6 space-y-3">
                  {["LinkedIn", "Google", "GitHub", "Stripe", "WhatsApp", "Slack"].map((integration) => (
                    <div
                      key={integration}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                          <Globe className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{integration}</p>
                          <p className="text-xs text-gray-500">Connected</p>
                        </div>
                      </div>
                      <button className="text-sm text-indigo-600 hover:text-indigo-700">
                        Configure
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "database" && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900">Database Management</h3>
                <div className="mt-4 space-y-2">
                  <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Export Database
                  </button>
                  <button className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Import Data
                  </button>
                  <button className="w-full rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-100">
                    Clear Cache
                  </button>
                </div>
              </div>
            )}

            {activeTab === "api" && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      API Key
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value="sk_live_••••••••••••••••"
                        disabled
                        className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
                      />
                      <button className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700">
                        Copy
                      </button>
                    </div>
                  </div>
                  <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    Generate New Key
                  </button>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600">Manage users and permissions</p>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-gray-900">System Analytics</h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-4">
                    {[
                      { label: "Total Users", value: "12,456", change: "+12%" },
                      { label: "Resumes Created", value: "34,892", change: "+8%" },
                      { label: "Jobs Applied", value: "8,234", change: "+23%" },
                      { label: "ATS Score Avg", value: "72%", change: "+5%" },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-lg bg-gray-50 p-4 text-center">
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-xs text-gray-500">{stat.label}</p>
                        <p className="text-xs text-emerald-600">{stat.change}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
