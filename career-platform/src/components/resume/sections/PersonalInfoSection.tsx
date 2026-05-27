"use client";

import { PersonalInfo } from "@/types";
import { useId } from "react";

interface PersonalInfoSectionProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export function PersonalInfoSection({ data, onChange }: PersonalInfoSectionProps) {
  const id = useId();

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-firstName`} className="mb-1 block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            type="text"
            id={`${id}-firstName`}
            value={data.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="John"
          />
        </div>
        <div>
          <label htmlFor={`${id}-lastName`} className="mb-1 block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            type="text"
            id={`${id}-lastName`}
            value={data.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-email`} className="mb-1 block text-sm font-medium text-gray-700">
            Email *
          </label>
          <input
            type="email"
            id={`${id}-email`}
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className="mb-1 block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id={`${id}-phone`}
            value={data.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-location`} className="mb-1 block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id={`${id}-location`}
            value={data.location || ""}
            onChange={(e) => handleChange("location", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="New York, NY"
          />
        </div>
        <div>
          <label htmlFor={`${id}-website`} className="mb-1 block text-sm font-medium text-gray-700">
            Website
          </label>
          <input
            type="url"
            id={`${id}-website`}
            value={data.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-linkedIn`} className="mb-1 block text-sm font-medium text-gray-700">
          LinkedIn URL
        </label>
        <input
          type="url"
          id={`${id}-linkedIn`}
          value={data.linkedIn || ""}
          onChange={(e) => handleChange("linkedIn", e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="https://linkedin.com/in/johndoe"
        />
      </div>

      <div>
        <label htmlFor={`${id}-summary`} className="mb-1 block text-sm font-medium text-gray-700">
          Professional Summary
        </label>
        <textarea
          id={`${id}-summary`}
          value={data.summary || ""}
          onChange={(e) => handleChange("summary", e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="Write a brief summary of your professional background and career goals..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Tip: Keep it concise (3-5 sentences) and highlight your key achievements.
        </p>
      </div>
    </div>
  );
}
