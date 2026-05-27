"use client";

import { ResumeData } from "@/types/resume";
import { format } from "date-fns";

export function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, projects, certifications, languages, awards } = data;

  return (
    <div className="mx-auto max-w-[800px] bg-white p-8 font-serif text-gray-900">
      {/* Header - Centered Traditional */}
      <header className="mb-6 border-b-2 border-gray-800 pb-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div className="mt-2 text-sm text-gray-700">
          {[
            personalInfo.email,
            personalInfo.phone,
            personalInfo.location,
            personalInfo.linkedIn?.replace(/^https?:\/\//, ""),
            personalInfo.website?.replace(/^https?:\/\//, ""),
          ]
            .filter(Boolean)
            .join(" | ")}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h2 className="mb-2 border-b border-gray-800 pb-1 text-sm font-bold uppercase tracking-wide text-gray-900">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed text-gray-800">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-800 pb-1 text-sm font-bold uppercase tracking-wide text-gray-900">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-bold text-gray-900">{exp.title}</h3>
                  <span className="text-sm text-gray-700">
                    {exp.startDate && format(new Date(exp.startDate), "MMM yyyy")} – {exp.current ? "Present" : exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : ""}
                  </span>
                </div>
                <p className="text-sm italic text-gray-700">
                  {exp.company}
                  {exp.location && ` — ${exp.location}`}
                </p>
                {exp.description && (
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-800 pb-1 text-sm font-bold uppercase tracking-wide text-gray-900">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-bold text-gray-900">{edu.school}</h3>
                  <span className="text-sm text-gray-700">
                    {edu.startDate && format(new Date(edu.startDate), "yyyy")} – {edu.endDate ? format(new Date(edu.endDate), "yyyy") : "Present"}
                  </span>
                </div>
                <p className="text-sm text-gray-800">
                  {edu.degree}
                  {edu.location && ` — ${edu.location}`}
                </p>
                {edu.description && (
                  <p className="mt-1 text-sm text-gray-700">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-800 pb-1 text-sm font-bold uppercase tracking-wide text-gray-900">
            Skills
          </h2>
          <p className="text-sm text-gray-800">
            {skills.join(", ")}
          </p>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-800 pb-1 text-sm font-bold uppercase tracking-wide text-gray-900">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex items-baseline gap-2">
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                  {project.link && (
                    <span className="text-xs text-gray-600">
                      ({project.link.replace(/^https?:\/\//, "")})
                    </span>
                  )}
                </div>
                {project.technologies.length > 0 && (
                  <p className="text-xs italic text-gray-600">
                    Technologies: {project.technologies.join(", ")}
                  </p>
                )}
                {project.description && (
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-800 pb-1 text-sm font-bold uppercase tracking-wide text-gray-900">
            Certifications
          </h2>
          <div className="space-y-1">
            {certifications.map((cert) => (
              <div key={cert.id} className="text-sm text-gray-800">
                <span className="font-semibold">{cert.name}</span>
                {cert.issuer && `, ${cert.issuer}`}
                {cert.date && ` (${format(new Date(cert.date), "MMM yyyy")})`}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-800 pb-1 text-sm font-bold uppercase tracking-wide text-gray-900">
            Languages
          </h2>
          <p className="text-sm text-gray-800">
            {languages.map((lang) => `${lang.name} (${lang.proficiency})`).join(", ")}
          </p>
        </section>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <section>
          <h2 className="mb-3 border-b border-gray-800 pb-1 text-sm font-bold uppercase tracking-wide text-gray-900">
            Awards & Honors
          </h2>
          <div className="space-y-1">
            {awards.map((award) => (
              <div key={award.id} className="text-sm text-gray-800">
                <span className="font-semibold">{award.title}</span>
                {award.issuer && ` — ${award.issuer}`}
                {award.date && `, ${format(new Date(award.date), "yyyy")}`}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
