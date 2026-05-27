"use client";

import { ResumeData } from "@/types/resume";
import { format } from "date-fns";

export function LegalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, certifications, barAdmissions, awards } = data;

  return (
    <div className="mx-auto max-w-[800px] bg-white p-8 font-serif text-gray-900">
      {/* Header - Centered Traditional Legal */}
      <header className="mb-6 border-b-2 border-slate-900 pb-4 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="text-base text-slate-700">
          {personalInfo.summary?.split('.')[0] || "Attorney"}
        </p>
        <div className="mt-2 text-sm text-slate-600">
          {[
            personalInfo.email,
            personalInfo.phone,
            personalInfo.location,
          ].filter(Boolean).join(" | ")}
        </div>
      </header>

      {/* Bar Admissions */}
      {(barAdmissions || []).length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-slate-800 pb-1 text-center text-base font-bold uppercase tracking-wide">
            Bar Admissions
          </h2>
          <p className="text-center text-sm">
            {(barAdmissions || []).map((admission: any) =>
              `${admission.state} (${admission.year})`
            ).join("; ")}
          </p>
        </section>
      )}

      {/* Education - Prominent for Legal */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-slate-800 pb-1 text-base font-bold uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <span className="font-bold">{edu.school}</span>
                  <span className="text-sm">{edu.endDate && format(new Date(edu.endDate), "yyyy")}</span>
                </div>
                <p className="text-sm italic">{edu.degree}</p>
                {edu.description && <p className="text-xs text-slate-600">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-slate-800 pb-1 text-base font-bold uppercase tracking-wide">
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <span className="font-bold">{exp.company}</span>
                  <span className="text-sm">
                    {exp.startDate && format(new Date(exp.startDate), "yyyy")}–{exp.current ? "Present" : exp.endDate ? format(new Date(exp.endDate), "yyyy") : ""}
                  </span>
                </div>
                <p className="text-sm italic">{exp.title}</p>
                {exp.description && (
                  <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
                    {exp.description.split('\n').filter(line => line.trim()).slice(0, 3).map((line, i) => (
                      <li key={i}>{line.replace(/^[-•]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Practice Areas */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-slate-800 pb-1 text-base font-bold uppercase tracking-wide">
            Practice Areas
          </h2>
          <p className="text-sm">
            {skills.join("; ")}
          </p>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-slate-800 pb-1 text-base font-bold uppercase tracking-wide">
            Certifications
          </h2>
          <div className="space-y-1 text-sm">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <span className="font-semibold">{cert.name}</span>
                <span>, {cert.issuer} ({cert.date && format(new Date(cert.date), "yyyy")})</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards & Honors */}
      {awards.length > 0 && (
        <section>
          <h2 className="mb-3 border-b border-slate-800 pb-1 text-base font-bold uppercase tracking-wide">
            Honors & Awards
          </h2>
          <div className="space-y-1 text-sm">
            {awards.map((award) => (
              <div key={award.id}>
                <span className="font-semibold">{award.title}</span>
                <span>, {award.issuer} ({award.date && format(new Date(award.date), "yyyy")})</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
