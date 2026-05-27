"use client";

import { ResumeData } from "@/types/resume";
import { format } from "date-fns";

export function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, certifications, awards } = data;

  return (
    <div className="mx-auto max-w-[800px] bg-white p-10 font-sans text-gray-900">
      {/* Header - Executive Style */}
      <header className="mb-8 border-b-4 border-slate-800 pb-6">
        <h1 className="text-4xl font-bold uppercase tracking-tight text-slate-900">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="mt-2 text-xl font-medium text-slate-600">
          {personalInfo.summary?.split('.')[0] || "Executive Professional"}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-700">
          {personalInfo.email && (
            <span className="flex items-center gap-1">📧 {personalInfo.email}</span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">📱 {personalInfo.phone}</span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1">📍 {personalInfo.location}</span>
          )}
          {personalInfo.linkedIn && (
            <span className="flex items-center gap-1">💼 {personalInfo.linkedIn.replace(/^https?:\/\//, "")}</span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold uppercase tracking-wide text-slate-900">
            Executive Summary
          </h2>
          <p className="text-sm leading-relaxed text-slate-700">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Core Competencies */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold uppercase tracking-wide text-slate-900">
            Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {skills.map((skill) => (
              <div key={skill} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-800"></span>
                <span className="text-sm text-slate-700">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold uppercase tracking-wide text-slate-900">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-slate-300 pl-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-lg font-bold text-slate-900">{exp.title}</h3>
                  <span className="text-sm text-slate-600">
                    {exp.startDate && format(new Date(exp.startDate), "MMM yyyy")} - {exp.current ? "Present" : exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : ""}
                  </span>
                </div>
                <p className="font-medium text-slate-700">
                  {exp.company}{exp.location && `, ${exp.location}`}
                </p>
                {exp.description && (
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-600">
                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                      <li key={i}>{line.replace(/^[-•]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold uppercase tracking-wide text-slate-900">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex items-baseline justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                  <p className="text-sm text-slate-600">{edu.school}</p>
                </div>
                <span className="text-sm text-slate-600">
                  {edu.endDate ? format(new Date(edu.endDate), "yyyy") : ""}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold uppercase tracking-wide text-slate-900">
            Certifications
          </h2>
          <div className="space-y-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="text-sm">
                <span className="font-semibold text-slate-900">{cert.name}</span>
                <span className="text-slate-600"> — {cert.issuer}</span>
                <span className="text-slate-500"> ({cert.date && format(new Date(cert.date), "yyyy")})</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards & Recognition */}
      {awards.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-bold uppercase tracking-wide text-slate-900">
            Awards & Recognition
          </h2>
          <div className="space-y-2">
            {awards.map((award) => (
              <div key={award.id} className="text-sm">
                <span className="font-semibold text-slate-900">{award.title}</span>
                <span className="text-slate-600"> — {award.issuer}</span>
                <span className="text-slate-500"> ({award.date && format(new Date(award.date), "yyyy")})</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
