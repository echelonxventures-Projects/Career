"use client";

import { ResumeData } from "@/types/resume";
import { PersonalInfoSection } from "./sections/PersonalInfoSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { EducationSection } from "./sections/EducationSection";
import { SkillsSection } from "./sections/SkillsSection";
import { ProjectsSection } from "./sections/ProjectsSection";
import { CertificationsSection } from "./sections/CertificationsSection";
import { LanguagesSection } from "./sections/LanguagesSection";
import { AwardsSection } from "./sections/AwardsSection";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

type SectionKey = "personal" | "experience" | "education" | "skills" | "projects" | "certifications" | "languages" | "awards";

export function ResumeEditor({ data, onChange }: ResumeEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>({
    personal: true,
    experience: true,
    education: true,
    skills: true,
    projects: false,
    certifications: false,
    languages: false,
    awards: false,
  });

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections: { key: SectionKey; title: string; component: React.ReactNode }[] = [
    {
      key: "personal",
      title: "Personal Information",
      component: (
        <PersonalInfoSection
          data={data.personalInfo}
          onChange={(personalInfo) => onChange({ ...data, personalInfo })}
        />
      ),
    },
    {
      key: "experience",
      title: "Work Experience",
      component: (
        <ExperienceSection
          items={data.experience}
          onChange={(experience) => onChange({ ...data, experience })}
        />
      ),
    },
    {
      key: "education",
      title: "Education",
      component: (
        <EducationSection
          items={data.education}
          onChange={(education) => onChange({ ...data, education })}
        />
      ),
    },
    {
      key: "skills",
      title: "Skills",
      component: (
        <SkillsSection
          items={data.skills}
          onChange={(skills) => onChange({ ...data, skills })}
        />
      ),
    },
    {
      key: "projects",
      title: "Projects",
      component: (
        <ProjectsSection
          items={data.projects}
          onChange={(projects) => onChange({ ...data, projects })}
        />
      ),
    },
    {
      key: "certifications",
      title: "Certifications",
      component: (
        <CertificationsSection
          items={data.certifications}
          onChange={(certifications) => onChange({ ...data, certifications })}
        />
      ),
    },
    {
      key: "languages",
      title: "Languages",
      component: (
        <LanguagesSection
          items={data.languages}
          onChange={(languages) => onChange({ ...data, languages })}
        />
      ),
    },
    {
      key: "awards",
      title: "Awards & Achievements",
      component: (
        <AwardsSection
          items={data.awards}
          onChange={(awards) => onChange({ ...data, awards })}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div
          key={section.key}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <button
            onClick={() => toggleSection(section.key)}
            className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50"
          >
            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            {expandedSections[section.key] ? (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRight className="h-5 w-5 text-gray-500" />
            )}
          </button>
          {expandedSections[section.key] && (
            <div className="border-t border-gray-200 px-6 py-4">
              {section.component}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
