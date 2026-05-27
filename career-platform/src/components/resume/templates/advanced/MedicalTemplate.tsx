"use client";

import { ResumeData } from "@/types/resume";
import { format } from "date-fns";

export function MedicalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, certifications, licenses, awards } = data;

  return (
    <div className="mx-auto max-w-[800px] bg-white p-8 font-sans text-gray-900">
      {/* Header */}
      <header className="mb-6 border-b-2 border-teal-700 pb-4">
        <h1 className="text-3xl font-bold text-teal-900">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-lg text-teal-700">
          {personalInfo.summary?.split('.')[0] || "Healthcare Professional"}
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
          {personalInfo.email && <span>📧 {personalInfo.email}</span>}
          {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
        </div>
      </header>

      {/* Licenses & Certifications */}
      {(licenses || certifications.length > 0) && (
        <section className="mb-6 rounded-lg bg-teal-50 p-4">
          <h2 className="mb-3 text-base font-bold uppercase tracking-wide text-teal-900">
            Licenses & Certifications
          </h2>
          <div className="space-y-2 text-sm">
            {licenses?.map((license: any) => (
              <div key={license.id} className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">{license.name}</span>
                  <span className="text-gray-600"> — {license.state || license.country}</span>
                </div>
                <span className="text-xs text-teal-700">Valid through {license.expires && format(new Date(license.expires), "MMM yyyy")}</span>
              </div>
            ))}
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">{cert.name}</span>
                  <span className="text-gray-600"> — {cert.issuer}</span>
                </div>
                <span className="text-xs text-teal-700">{cert.date && format(new Date(cert.date), "yyyy")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-teal-300 pb-1 text-base font-bold uppercase tracking-wide text-teal-900">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Clinical Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-teal-300 pb-1 text-base font-bold uppercase tracking-wide text-teal-900">
            Clinical Skills & Specialties
          </h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {skills.map((skill) => (
              <div key={skill} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-600"></span>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-teal-300 pb-1 text-base font-bold uppercase tracking-wide text-teal-900">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-bold text-gray-900">{exp.title}</h3>
                  <span className="text-sm text-gray-600">
                    {exp.startDate && format(new Date(exp.startDate), "MMM yyyy")} - {exp.current ? "Present" : exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : ""}
                  </span>
                </div>
                <p className="text-sm font-medium text-teal-700">{exp.company}</p>
                <p className="text-xs text-gray-600">{exp.location}</p>
                {exp.description && (
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-gray-700">
                    {exp.description.split('\n').filter(line => line.trim()).slice(0, 4).map((line, i) => (
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
        <section className="mb-6">
          <h2 className="mb-3 border-b border-teal-300 pb-1 text-base font-bold uppercase tracking-wide text-teal-900">
            Education & Training
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-baseline justify-between">
                  <span className="font-bold">{edu.school}</span>
                  <span className="text-sm text-gray-600">
                    {edu.endDate && format(new Date(edu.endDate), "yyyy")}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{edu.degree}</p>
                {edu.description && <p className="text-xs text-gray-600">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <section>
          <h2 className="mb-3 border-b border-teal-300 pb-1 text-base font-bold uppercase tracking-wide text-teal-900">
            Honors & Awards
          </h2>
          <div className="space-y-1 text-sm">
            {awards.map((award) => (
              <div key={award.id}>
                <span className="font-semibold">{award.title}</span>
                <span className="text-gray-600"> — {award.issuer} ({award.date && format(new Date(award.date), "yyyy")})</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
