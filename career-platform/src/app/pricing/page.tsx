"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  Building2,
  ChevronRight,
} from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    description: "Get started with basic features",
    price: { monthly: 0, yearly: 0 },
    features: [
      { text: "1 resume", included: true },
      { text: "3 PDF downloads", included: true },
      { text: "Basic templates", included: true },
      { text: "ATS checker (1/month)", included: true },
      { text: "Cover letter generator", included: false },
      { text: "AI suggestions", included: false },
      { text: "Job applications", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for job seekers",
    price: { monthly: 9, yearly: 90 },
    features: [
      { text: "3 resumes", included: true },
      { text: "Unlimited PDF downloads", included: true },
      { text: "All templates", included: true },
      { text: "ATS checker (5/month)", included: true },
      { text: "Cover letter generator", included: true },
      { text: "Basic AI suggestions", included: true },
      { text: "Job applications", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Best for active job seekers",
    price: { monthly: 19, yearly: 190 },
    features: [
      { text: "Unlimited resumes", included: true },
      { text: "Unlimited PDF downloads", included: true },
      { text: "All templates + new releases", included: true },
      { text: "Unlimited ATS checks", included: true },
      { text: "Cover letter generator", included: true },
      { text: "Advanced AI suggestions", included: true },
      { text: "Job applications & tracking", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professionals & teams",
    price: { monthly: 49, yearly: 490 },
    features: [
      { text: "Everything in Premium", included: true },
      { text: "Team collaboration", included: true },
      { text: "Custom branding", included: true },
      { text: "API access", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "SSO & SAML", included: true },
      { text: "SLA guarantee", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 14-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes! All paid plans come with a 7-day free trial. No credit card required to start.",
  },
];

export default function PricingPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-indigo-600 to-indigo-800 px-4 py-20 text-center">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          Simple, Transparent Pricing
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">
          Choose the plan that's right for you. Upgrade or downgrade anytime.
        </p>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-12">
        {/* Pricing Grid */}
        <div className="grid gap-6 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border bg-white p-6 shadow-sm ${
                plan.popular
                  ? "border-indigo-500 ring-2 ring-indigo-500"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {plan.description}
                </p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price.monthly}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  ${plan.price.yearly}/year (save 2 months)
                </p>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 shrink-0 text-emerald-500" />
                    ) : (
                      <X className="h-5 w-5 shrink-0 text-gray-300" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={session ? "/dashboard" : "/auth/signin"}
                className={`mt-6 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                  plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Feature Comparison
          </h2>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-4 text-left font-medium text-gray-900">
                    Feature
                  </th>
                  <th className="pb-4 text-center font-medium text-gray-900">
                    Free
                  </th>
                  <th className="pb-4 text-center font-medium text-gray-900">
                    Basic
                  </th>
                  <th className="pb-4 text-center font-medium text-indigo-600">
                    Premium
                  </th>
                  <th className="pb-4 text-center font-medium text-gray-900">
                    Pro
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Resumes", free: "1", basic: "3", premium: "∞", pro: "∞" },
                  { name: "PDF Downloads", free: "3", basic: "∞", premium: "∞", pro: "∞" },
                  { name: "Templates", free: "Basic", basic: "All", premium: "All+", pro: "All+" },
                  { name: "ATS Checks", free: "1/mo", basic: "5/mo", premium: "∞", pro: "∞" },
                  { name: "Cover Letters", free: "—", basic: "✓", premium: "✓", pro: "✓" },
                  { name: "AI Features", free: "—", basic: "Basic", premium: "Advanced", pro: "Advanced" },
                  { name: "Job Tracking", free: "—", basic: "—", premium: "✓", pro: "✓" },
                  { name: "Team Seats", free: "—", basic: "—", premium: "—", pro: "5" },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 text-sm font-medium text-gray-900">
                      {row.name}
                    </td>
                    <td className="py-4 text-center text-sm text-gray-600">
                      {row.free}
                    </td>
                    <td className="py-4 text-center text-sm text-gray-600">
                      {row.basic}
                    </td>
                    <td className="py-4 text-center text-sm font-medium text-indigo-600">
                      {row.premium}
                    </td>
                    <td className="py-4 text-center text-sm text-gray-600">
                      {row.pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-xl border border-gray-200 bg-white p-6">
                <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Still have questions?
          </h2>
          <p className="mt-2 text-gray-600">
            Contact our team for personalized assistance
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Contact Sales
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
