"use client";

import { ResumeData } from "@/types/resume";
import { format } from "date-fns";

export function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, projects, certifications, languages, awards } = data;

  return (
    <div className="mx-auto max-w-[800px] bg-white p-8 font-sans text-gray-900">
      {/* Header - Simple */}
      <header className="mb-8">
        <h1 className="text-4xl font-light text-gray-900">
          {personalInfo.firstName} <span className="font-semibold">{personalInfo.lastName}</span>
        </h1>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedIn && <span>{personalInfo.linkedIn.replace(/^https?:\/\//, "")}</span>}
          {personalInfo.website && <span>{personalInfo.website.replace(/^https?:\/\//, "")}</span>}
        </div>
        {personalInfo.summary && (
          <p className="mt-4 text-sm leading-relaxed text-gray-700">
            {personalInfo.summary}
          </p>
        )}
      </header>

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Experience
          </h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id} className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">{exp.title}</h3>
                  <p className="text-sm text-gray-600">
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </p>
                  {exp.description && (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                      {exp.description}
                    </p>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {exp.startDate && format(new Date(exp.startDate), "MMM yyyy")} – {exp.current ? "Present" : exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : ""}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">
                    {edu.school}
                    {edu.location && `, ${edu.location}`}
                  </p>
                  {edu.description && (
                    <p className="mt-1 text-sm text-gray-600">{edu.description}</p>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {edu.startDate && format(new Date(edu.startDate), "yyyy")} – {edu.endDate ? format(new Date(edu.endDate), "yyyy") : "Present"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Skills
          </h2>
          <p className="text-sm text-gray-700">
            {skills.join(" • ")}
          </p>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex items-baseline gap-2">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:underline"
                    >
                      {project.link.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]}
                    </a>
                  )}
                </div>
                {project.technologies.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {project.technologies.join(" • ")}
                  </p>
                )}
                {project.description && (
                  <p className="mt-1 text-sm leading-relaxed text-gray-700">
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
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Certifications
          </h2>
          <div className="space-y-1">
            {certifications.map((cert) => (
              <div key={cert.id} className="text-sm text-gray-700">
                {cert.name}, {cert.issuer}
                {cert.date && ` — ${format(new Date(cert.date), "yyyy")}`}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Languages
          </h2>
          <p className="text-sm text-gray-700">
            {languages.map((lang) => `${lang.name} (${lang.proficiency})`).join(" • ")}
          </p>
        </section>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
            Awards
          </h2>
          <div className="space-y-1">
            {awards.map((award) => (
              <div key={award.id} className="text-sm text-gray-700">
                {award.title}, {award.issuer}
                {award.date && ` — ${format(new Date(award.date), "yyyy")}`}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
