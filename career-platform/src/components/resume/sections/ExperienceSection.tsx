"use client";

import { Experience } from "@/types";
import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { format } from "date-fns";

interface ExperienceSectionProps {
  items: Experience[];
  onChange: (items: Experience[]) => void;
}

export function ExperienceSection({ items, onChange }: ExperienceSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addItem = () => {
    const newItem: Experience = {
      id: crypto.randomUUID(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    onChange([...items, newItem]);
    setEditingId(newItem.id);
  };

  const updateItem = (id: string, updates: Partial<Experience>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-gray-500">No work experience added yet.</p>
          <button
            onClick={addItem}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Experience
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-4"
              >
                {editingId === item.id ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Job Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateItem(item.id, { title: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Company
                        </label>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => updateItem(item.id, { company: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                          placeholder="Acme Inc."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        value={item.location || ""}
                        onChange={(e) => updateItem(item.id, { location: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        placeholder="New York, NY"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <input
                          type="month"
                          value={item.startDate}
                          onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          End Date
                        </label>
                        <input
                          type="month"
                          value={item.endDate}
                          onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
                          disabled={item.current}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-${item.id}`}
                        checked={item.current}
                        onChange={(e) => updateItem(item.id, { current: e.target.checked })}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor={`current-${item.id}`} className="text-sm text-gray-700">
                        I currently work here
                      </label>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        placeholder="Describe your responsibilities and achievements..."
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Tip: Use bullet points with action verbs and quantify achievements.
                      </p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingId(null)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => setEditingId(item.id)}
                      className="flex-1 text-left"
                    >
                      <h4 className="font-medium text-gray-900">
                        {item.title || "Untitled Position"}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.company}
                        {item.location && ` • ${item.location}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.startDate && format(new Date(item.startDate), "MMM yyyy")}
                        {item.startDate && " - "}
                        {item.current ? "Present" : item.endDate ? format(new Date(item.endDate), "MMM yyyy") : ""}
                      </p>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveItem(index, "up")}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <GripVertical className="h-4 w-4 rotate-90" />
                      </button>
                      <button
                        onClick={() => moveItem(index, "down")}
                        disabled={index === items.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <GripVertical className="h-4 w-4 -rotate-90" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addItem}
            className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-indigo-500 hover:text-indigo-600"
          >
            <Plus className="h-4 w-4" />
            Add Experience
          </button>
        </>
      )}
    </div>
  );
}
