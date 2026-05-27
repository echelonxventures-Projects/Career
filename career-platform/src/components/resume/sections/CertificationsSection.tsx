"use client";

import { Certification } from "@/types";
import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { format } from "date-fns";

interface CertificationsSectionProps {
  items: Certification[];
  onChange: (items: Certification[]) => void;
}

export function CertificationsSection({ items, onChange }: CertificationsSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addItem = () => {
    const newItem: Certification = {
      id: crypto.randomUUID(),
      name: "",
      issuer: "",
      date: "",
    };
    onChange([...items, newItem]);
    setEditingId(newItem.id);
  };

  const updateItem = (id: string, updates: Partial<Certification>) => {
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
          <p className="text-gray-500">No certifications added yet.</p>
          <button
            onClick={addItem}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Certification
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
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Certification Name
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, { name: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        placeholder="AWS Certified Solutions Architect"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Issuing Organization
                        </label>
                        <input
                          type="text"
                          value={item.issuer}
                          onChange={(e) => updateItem(item.id, { issuer: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                          placeholder="Amazon Web Services"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Date Obtained
                        </label>
                        <input
                          type="month"
                          value={item.date}
                          onChange={(e) => updateItem(item.id, { date: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Credential ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={item.credentialId || ""}
                        onChange={(e) => updateItem(item.id, { credentialId: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                        placeholder="ABC-123-XYZ"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Expiration Date (Optional)
                      </label>
                      <input
                        type="month"
                        value={item.expires || ""}
                        onChange={(e) => updateItem(item.id, { expires: e.target.value })}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                      />
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
                        {item.name || "Untitled Certification"}
                      </h4>
                      <p className="text-sm text-gray-600">{item.issuer}</p>
                      <p className="text-xs text-gray-500">
                        {item.date && format(new Date(item.date), "MMM yyyy")}
                        {item.expires && ` - Expires ${format(new Date(item.expires), "MMM yyyy")}`}
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
            Add Certification
          </button>
        </>
      )}
    </div>
  );
}
