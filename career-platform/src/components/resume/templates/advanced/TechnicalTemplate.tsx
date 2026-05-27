"use client";

import { ResumeData } from "@/types/resume";
import { format } from "date-fns";

export function TechnicalTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, projects, certifications } = data;

  return (
    <div className="mx-auto max-w-[800px] bg-white p-8 font-mono text-gray-900">
      {/* Header - Tech Style */}
      <header className="mb-6 border-b-2 border-cyan-600 pb-4">
        <h1 className="text-3xl font-bold text-cyan-900">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <p className="mt-1 text-lg text-cyan-700">
          {personalInfo.summary?.split('.')[0] || "Software Engineer"}
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-600">
          {personalInfo.email && <span className="rounded bg-cyan-100 px-2 py-1">{personalInfo.email}</span>}
          {personalInfo.phone && <span className="rounded bg-cyan-100 px-2 py-1">{personalInfo.phone}</span>}
          {personalInfo.location && <span className="rounded bg-cyan-100 px-2 py-1">{personalInfo.location}</span>}
          {personalInfo.website && <span className="rounded bg-cyan-100 px-2 py-1">{personalInfo.website.replace(/^https?:\/\//, "")}</span>}
          {personalInfo.linkedIn && <span className="rounded bg-cyan-100 px-2 py-1">LinkedIn</span>}
          {personalInfo.github && <span className="rounded bg-cyan-100 px-2 py-1">GitHub</span>}
        </div>
      </header>

      {/* Technical Skills - Grid */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cyan-900">
            <span className="h-2 w-2 rounded-full bg-cyan-600"></span>
            Technical Skills
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded bg-gray-50 p-3">
              <span className="font-semibold text-cyan-900">Languages:</span>
              <span className="ml-2 text-gray-700">
                {skills.filter(s => ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'Ruby'].some(lang => s.includes(lang))).join(', ') || 'Not specified'}
              </span>
            </div>
            <div className="rounded bg-gray-50 p-3">
              <span className="font-semibold text-cyan-900">Frameworks:</span>
              <span className="ml-2 text-gray-700">
                {skills.filter(s => ['React', 'Vue', 'Angular', 'Node', 'Express', 'Django', 'Flask', 'Spring'].some(fw => s.includes(fw))).join(', ') || 'Not specified'}
              </span>
            </div>
            <div className="rounded bg-gray-50 p-3">
              <span className="font-semibold text-cyan-900">Databases:</span>
              <span className="ml-2 text-gray-700">
                {skills.filter(s => ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'DynamoDB'].some(db => s.includes(db))).join(', ') || 'Not specified'}
              </span>
            </div>
            <div className="rounded bg-gray-50 p-3">
              <span className="font-semibold text-cyan-900">Cloud/Tools:</span>
              <span className="ml-2 text-gray-700">
                {skills.filter(s => ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Git', 'CI/CD', 'Terraform'].some(tool => s.includes(tool))).join(', ') || 'Not specified'}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cyan-900">
            <span className="h-2 w-2 rounded-full bg-cyan-600"></span>
            Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="border-l-2 border-cyan-300 pl-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-bold text-gray-900">{exp.title}</h3>
                  <span className="text-xs text-gray-500">
                    {exp.startDate && format(new Date(exp.startDate), "MMM yyyy")} - {exp.current ? "Present" : exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : ""}
                  </span>
                </div>
                <p className="text-sm font-medium text-cyan-700">{exp.company}</p>
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {exp.technologies.map((tech) => (
                      <span key={tech} className="text-xs text-gray-500">{tech}</span>
                    ))}
                  </div>
                )}
                {exp.description && (
                  <ul className="mt-2 space-y-1 text-xs text-gray-700">
                    {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                      <li key={i}>• {line.replace(/^[-•]\s*/, '')}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cyan-900">
            <span className="h-2 w-2 rounded-full bg-cyan-600"></span>
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <div key={project.id} className="rounded bg-gray-50 p-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                  {project.link && (
                    <a href={project.link} className="text-xs text-cyan-600 hover:underline">
                      View →
                    </a>
                  )}
                </div>
                {project.technologies.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="rounded bg-cyan-100 px-1.5 py-0.5 text-xs text-cyan-800">{tech}</span>
                    ))}
                  </div>
                )}
                {project.description && (
                  <p className="mt-1 text-xs text-gray-700">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cyan-900">
            <span className="h-2 w-2 rounded-full bg-cyan-600"></span>
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="flex items-baseline justify-between text-sm">
                <div>
                  <span className="font-semibold text-gray-900">{edu.degree}</span>
                  <span className="text-gray-600"> — {edu.school}</span>
                </div>
                <span className="text-xs text-gray-500">{edu.endDate ? format(new Date(edu.endDate), "yyyy") : ""}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-cyan-900">
            <span className="h-2 w-2 rounded-full bg-cyan-600"></span>
            Certifications
          </h2>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <div key={cert.id} className="rounded bg-cyan-50 px-3 py-1 text-xs">
                <span className="font-semibold text-cyan-900">{cert.name}</span>
                <span className="text-cyan-700"> ({cert.issuer})</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
