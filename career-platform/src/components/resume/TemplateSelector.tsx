"use client";

import { templates } from "@/types/resume";
import { Check } from "lucide-react";

interface TemplateSelectorProps {
  selected: string;
  onSelect: (template: string) => void;
}

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  const categories = [...new Set(templates.map((t) => t.category || "General"))];

  return (
    <div className="sticky top-24 space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Choose Template</h3>

      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {category}
          </h4>
          <div className="space-y-2">
            {templates
              .filter((t) => (t.category || "General") === category)
              .map((template) => (
                <button
                  key={template.id}
                  onClick={() => onSelect(template.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-all ${
                    selected === template.id
                      ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                        selected === template.id
                          ? "border-indigo-500 bg-indigo-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selected === template.id && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{template.name}</p>
                      <p className="text-xs text-gray-500">{template.description}</p>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}

      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h4 className="text-sm font-medium text-gray-900">Template Tips</h4>
        <ul className="mt-2 space-y-1 text-xs text-gray-600">
          <li>• <strong>Modern/Minimal:</strong> Tech, startups, creative roles</li>
          <li>• <strong>Classic:</strong> Traditional industries, finance, law</li>
          <li>• <strong>Executive:</strong> C-level, senior management</li>
          <li>• <strong>Technical:</strong> Developers, engineers, IT</li>
          <li>• <strong>Academic:</strong> Research, professorships</li>
          <li>• <strong>Medical:</strong> Healthcare, clinical roles</li>
          <li>• <strong>Legal:</strong> Attorneys, law firms</li>
        </ul>
      </div>
    </div>
  );
}
