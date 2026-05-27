"use client";

import { useState } from "react";
import { Plus, Trash2, X, Sparkles } from "lucide-react";

interface SkillsSectionProps {
  items: string[];
  onChange: (items: string[]) => void;
}

const AI_SUGGESTIONS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL",
  "AWS", "Docker", "Kubernetes", "Git", "Agile", "Project Management",
  "Data Analysis", "Machine Learning", "UI/UX Design", "Figma",
  "Leadership", "Communication", "Problem Solving", "Team Collaboration",
];

export function SkillsSection({ items, onChange }: SkillsSectionProps) {
  const [newSkill, setNewSkill] = useState("");
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);

  const addSkill = (skill: string) => {
    if (skill.trim() && !items.includes(skill.trim())) {
      onChange([...items, skill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    onChange(items.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill(newSkill);
    }
  };

  const filteredSuggestions = AI_SUGGESTIONS.filter(
    (s) => !items.includes(s) && s.toLowerCase().includes(newSkill.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {items.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
          >
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="ml-1 rounded-full p-0.5 hover:bg-indigo-100"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a skill (e.g., React, Python, Project Management)"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          />
          <button
            onClick={() => addSkill(newSkill)}
            disabled={!newSkill.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        {newSkill && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
            {filteredSuggestions.slice(0, 5).map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => addSkill(suggestion)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setShowAiSuggestions(!showAiSuggestions)}
        className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
      >
        <Sparkles className="h-4 w-4" />
        {showAiSuggestions ? "Hide AI suggestions" : "Show AI suggestions"}
      </button>

      {showAiSuggestions && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="mb-3 text-sm font-medium text-gray-700">Popular skills:</p>
          <div className="flex flex-wrap gap-2">
            {AI_SUGGESTIONS.filter((s) => !items.includes(s)).map((skill) => (
              <button
                key={skill}
                onClick={() => addSkill(skill)}
                className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:border-indigo-500 hover:text-indigo-600"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <p className="text-sm text-gray-500">
          Add skills to showcase your expertise. Include both technical and soft skills.
        </p>
      )}
    </div>
  );
}
