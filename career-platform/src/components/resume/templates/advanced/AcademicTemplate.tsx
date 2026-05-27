"use client";

import { ResumeData } from "@/types/resume";
import { format } from "date-fns";

export function AcademicTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, projects, certifications, publications, languages, awards } = data;

  return (
    <div className="mx-auto max-w-[800px] bg-white p-8 font-serif text-gray-900">
      {/* Header - Academic Style */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {personalInfo.summary?.split('.')[0] || "Academic & Research Professional"}
        </p>
        <div className="mt-3 flex justify-center gap-4 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
      </header>

      {/* Research Interests */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-800 pb-1 text-base font-bold uppercase tracking-wide">
            Research Interests
          </h2>
          <p className="text-sm text-gray-700">
            {skills.join('; ')}
          </p>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-800 pb-1 text-base font-bold uppercase tracking-wide">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between">
                  <span className="font-bold">{edu.school}</span>
                  <span className="text-sm text-gray-600">
                    {edu.startDate && format(new Date(edu.startDate), "yyyy")}–{edu.endDate ? format(new Date(edu.endDate), "yyyy") : "Present"}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="italic">{edu.degree}</span>
                  {edu.description && <span className="text-gray-600"> — {edu.description}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Research Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-800 pb-1 text-base font-bold uppercase tracking-wide">
            Research & Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between">
                  <span className="font-bold">{exp.company}</span>
                  <span className="text-sm text-gray-600">
                    {exp.startDate && format(new Date(exp.startDate), "yyyy")}–{exp.current ? "Present" : exp.endDate ? format(new Date(exp.endDate), "yyyy") : ""}
                  </span>
                </div>
                <div className="text-sm italic">{exp.title}</div>
                {exp.description && (
                  <ul className="mt-1 list-disc pl-5 text-sm text-gray-700">
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

      {/* Publications */}
      {publications && publications.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-800 pb-1 text-base font-bold uppercase tracking-wide">
            Publications
          </h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm">
            {publications.map((pub: any) => (
              <li key={pub.id}>
                <span className="font-semibold">{pub.authors.join(", ")}</span>
                ({pub.year}). {pub.title}.
                <span className="italic"> {pub.journal || pub.conference}</span>
                {pub.doi && <span>. doi: {pub.doi}</span>}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-800 pb-1 text-base font-bold uppercase tracking-wide">
            Research Projects
          </h2>
          <div className="space-y-2">
            {projects.map((project) => (
              <div key={project.id} className="text-sm">
                <span className="font-bold">{project.name}</span>
                {project.technologies.length > 0 && (
                  <span className="text-gray-600"> — {project.technologies.join(", ")}</span>
                )}
                {project.description && (
                  <p className="mt-1 text-gray-700">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Awards */}
      {certifications.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 border-b border-gray-800 pb-1 text-base font-bold uppercase tracking-wide">
            Certifications & Awards
          </h2>
          <div className="space-y-1 text-sm">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <span className="font-semibold">{cert.name}</span>
                <span className="text-gray-600">, {cert.issuer} ({cert.date && format(new Date(cert.date), "yyyy")})</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section>
          <h2 className="mb-3 border-b border-gray-800 pb-1 text-base font-bold uppercase tracking-wide">
            Languages
          </h2>
          <p className="text-sm">
            {languages.map((lang: any) => `${lang.name} (${lang.proficiency})`).join("; ")}
          </p>
        </section>
      )}
    </div>
  );
}
