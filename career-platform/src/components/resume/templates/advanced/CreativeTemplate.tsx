"use client";

import { ResumeData } from "@/types/resume";
import { format } from "date-fns";

export function CreativeTemplate({ data }: { data: ResumeData }) {
  const { personalInfo, experience, education, skills, projects, certifications } = data;

  return (
    <div className="mx-auto max-w-[800px] bg-white p-8">
      {/* Sidebar + Main Layout */}
      <div className="flex gap-8">
        {/* Left Sidebar */}
        <aside className="w-1/3 border-r-2 border-purple-500 pr-6">
          {/* Profile */}
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-3xl font-bold text-white">
              {personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}
            </div>
            <h1 className="mt-4 text-xl font-bold text-gray-900">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-sm text-purple-600">{personalInfo.summary?.split('.')[0]}</p>
          </div>

          {/* Contact */}
          <div className="mb-6 space-y-2 text-xs text-gray-600">
            {personalInfo.email && <p>✉️ {personalInfo.email}</p>}
            {personalInfo.phone && <p>📱 {personalInfo.phone}</p>}
            {personalInfo.location && <p>📍 {personalInfo.location}</p>}
            {personalInfo.website && <p>🌐 {personalInfo.website.replace(/^https?:\/\//, "")}</p>}
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 border-b border-purple-300 pb-1 text-sm font-bold uppercase text-purple-900">
                Skills
              </h3>
              <div className="space-y-2">
                {skills.slice(0, 10).map((skill) => (
                  <div key={skill} className="flex items-center gap-2">
                    <div className="h-1 flex-1 rounded-full bg-purple-100">
                      <div className="h-full w-3/4 rounded-full bg-purple-500"></div>
                    </div>
                    <span className="text-xs text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h3 className="mb-3 border-b border-purple-300 pb-1 text-sm font-bold uppercase text-purple-900">
                Certifications
              </h3>
              <div className="space-y-1 text-xs text-gray-600">
                {certifications.map((cert) => (
                  <p key={cert.id}>• {cert.name}</p>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="w-2/3">
          {/* About */}
          {personalInfo.summary && (
            <section className="mb-6">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-purple-900">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                About Me
              </h2>
              <p className="text-sm leading-relaxed text-gray-700">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-purple-900">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-4">
                    <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-pink-500"></div>
                    <h3 className="font-bold text-gray-900">{exp.title}</h3>
                    <p className="text-sm text-purple-600">{exp.company}</p>
                    <p className="text-xs text-gray-500">
                      {exp.startDate && format(new Date(exp.startDate), "MMM yyyy")} - {exp.current ? "Present" : exp.endDate ? format(new Date(exp.endDate), "MMM yyyy") : ""}
                    </p>
                    {exp.description && (
                      <p className="mt-1 text-xs text-gray-600">
                        {exp.description.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-6">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-purple-900">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                Projects
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {projects.map((project) => (
                  <div key={project.id} className="rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-3">
                    <h3 className="font-semibold text-sm text-gray-900">{project.name}</h3>
                    {project.technologies.length > 0 && (
                      <p className="text-xs text-purple-600">
                        {project.technologies.slice(0, 3).join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-purple-900">
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-sm">
                    <span className="font-semibold text-gray-900">{edu.degree}</span>
                    <span className="text-gray-600"> — {edu.school}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
