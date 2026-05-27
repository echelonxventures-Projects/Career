"use client";

import { ResumeData } from "@/types/resume";
import { Mail, Phone, MapPin, Globe, Link as LinkIcon } from "lucide-react";
import { format } from "date-fns";

export function ModernTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, projects, certifications, languages, awards } = data;

  return (
    <div className="mx-auto max-w-[800px] bg-white p-8 font-sans text-gray-900">
      {/* Header */}
      <header className="mb-6 border-b-2 border-indigo-600 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.summary && (
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            {personalInfo.summary}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4 text-indigo-600" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4 text-indigo-600" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-indigo-600" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedIn && (
            <div className="flex items-center gap-1">
              <LinkIcon className="h-4 w-4 text-indigo-600" />
              <span>{personalInfo.linkedIn.replace(/^https?:\/\//, "")}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4 text-indigo-600" />
              <span>{personalInfo.website.replace(/^https?:\/\//, "")}</span>
            </div>
          )}
        </div>
      </header>

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-bold uppercase tracking-wide text-indigo-600">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                    <p className="text-sm text-gray-600">
                      {exp.company}
                      {exp.location && ` • ${exp.location}`}
                    </p>
                  </div>
                  <span className="text-right text-sm text-gray-500">
                    {exp.startDate && format(new Date(exp.startDate), "MMM yyyy")} - {exp.current ? "Present" : exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : ""}
                  </span>
                </div>
                {exp.description && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600">
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
          <h2 className="mb-3 text-lg font-bold uppercase tracking-wide text-indigo-600">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">
                      {edu.school}
                      {edu.location && ` • ${edu.location}`}
                    </p>
                  </div>
                  <span className="text-right text-sm text-gray-500">
                    {edu.startDate && format(new Date(edu.startDate), "MMM yyyy")} - {edu.endDate ? format(new Date(edu.endDate), "MMM yyyy") : "Present"}
                  </span>
                </div>
                {edu.description && (
                  <p className="mt-1 text-sm text-gray-600">{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-bold uppercase tracking-wide text-indigo-600">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-bold uppercase tracking-wide text-indigo-600">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="flex items-baseline gap-2">
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:underline"
                    >
                      {project.link.replace(/^https?:\/\//, "")}
                    </a>
                  )}
                </div>
                {project.technologies.length > 0 && (
                  <p className="text-sm text-gray-500">
                    {project.technologies.join(" • ")}
                  </p>
                )}
                {project.description && (
                  <p className="mt-1 whitespace-pre-wrap text-sm text-gray-600">
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
          <h2 className="mb-3 text-lg font-bold uppercase tracking-wide text-indigo-600">
            Certifications
          </h2>
          <div className="space-y-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-baseline justify-between">
                <div>
                  <span className="font-medium text-gray-900">{cert.name}</span>
                  <span className="text-gray-600"> — {cert.issuer}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {cert.date && format(new Date(cert.date), "MMM yyyy")}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-lg font-bold uppercase tracking-wide text-indigo-600">
            Languages
          </h2>
          <div className="flex flex-wrap gap-4">
            {languages.map((lang) => (
              <div key={lang.id} className="text-sm">
                <span className="font-medium text-gray-900">{lang.name}</span>
                <span className="text-gray-500"> — {lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Awards */}
      {awards.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold uppercase tracking-wide text-indigo-600">
            Awards & Achievements
          </h2>
          <div className="space-y-2">
            {awards.map((award) => (
              <div key={award.id}>
                <div className="flex items-baseline justify-between">
                  <span className="font-medium text-gray-900">{award.title}</span>
                  <span className="text-sm text-gray-500">
                    {award.date && format(new Date(award.date), "MMM yyyy")}
                  </span>
                </div>
                <span className="text-sm text-gray-600">{award.issuer}</span>
                {award.description && (
                  <p className="text-sm text-gray-600">{award.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
