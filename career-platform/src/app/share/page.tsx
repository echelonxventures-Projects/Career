"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import {
  Share2,
  Mail,
  Link as LinkIcon,
  ChevronLeft,
  Check,
  QrCode,
  Download,
  MessageCircle,
  Copy,
  X,
  Hash,
  Users,
  Send,
  type LucideIcon,
} from "lucide-react";

interface ShareOption {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  shareUrl: string;
}

const shareOptions: ShareOption[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: LinkIcon,
    color: "bg-[#0A66C2]",
    shareUrl: "https://www.linkedin.com/sharing/share-offsite/?url=",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: Hash,
    color: "bg-[#1DA1F2]",
    shareUrl: "https://twitter.com/intent/tweet?url=",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Users,
    color: "bg-[#4267B2]",
    shareUrl: "https://www.facebook.com/sharer/sharer.php?u=",
  },
  {
    id: "email",
    name: "Email",
    icon: Mail,
    color: "bg-gray-600",
    shareUrl: "mailto:?subject=Check%20out%20my%20resume&body=",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: Send,
    color: "bg-[#25D366]",
    shareUrl: "https://wa.me/?text=",
  },
];

export default function SocialSharingPage() {
  const { data: session } = useSession();
  const [publicUrl, setPublicUrl] = useState("https://career-platform.app/r/john-doe-123");
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (option: ShareOption) => {
    const text = `Check out my professional resume on Career Platform! ${publicUrl}`;
    const url = `${option.shareUrl}${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900">Share Resume</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl p-4 py-8">
        <div className="space-y-6">
          {/* Public URL */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Public Resume Link</h2>
            <p className="text-sm text-gray-600">Anyone with this link can view your resume</p>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={publicUrl}
                readOnly
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Share Options */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Share to Social Media</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {shareOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleShare(option)}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-300 hover:bg-gray-50"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${option.color} text-white`}>
                    <option.icon className="h-5 w-5" />
                  </div>
                  <span className="font-medium text-gray-900">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* QR Code */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">QR Code</h2>
                <p className="text-sm text-gray-600">Scan to view resume on mobile</p>
              </div>
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <QrCode className="h-4 w-4" />
                {showQR ? "Hide" : "Show"} QR
              </button>
            </div>
            {showQR && (
              <div className="mt-4 flex justify-center">
                <div className="h-48 w-48 rounded-lg bg-gray-100 flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-gray-400" />
                </div>
              </div>
            )}
          </div>

          {/* Embed Options */}
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Embed on Website</h2>
            <p className="text-sm text-gray-600">Add your resume to your personal website</p>
            <div className="mt-4">
              <code className="block rounded-lg bg-gray-900 p-4 text-xs text-gray-300">
                {`<iframe src="${publicUrl}/embed" width="100%" height="800" frameborder="0"></iframe>`}
              </code>
            </div>
          </div>

          {/* WhatsApp Integration */}
          <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366]">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">WhatsApp Integration</h2>
                <p className="text-sm text-gray-600">Get job alerts and updates on WhatsApp</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <input
                type="tel"
                placeholder="Enter WhatsApp number..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <button className="w-full rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:bg-[#128C7E]">
                Connect WhatsApp
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
