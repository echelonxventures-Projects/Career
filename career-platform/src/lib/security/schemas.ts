import { z } from "zod";

// Resume schemas
export const resumeSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(200),
  template: z.enum([
    "modern", "professional", "minimal", "creative", "executive",
    "technical", "academic", "federal", "ats-friendly"
  ]),
  content: z.object({
    personalInfo: z.object({
      fullName: z.string().min(1).max(200),
      email: z.string().email().max(254),
      phone: z.string().max(50).optional(),
      location: z.string().max(200).optional(),
      website: z.string().url().max(500).optional(),
      linkedIn: z.string().max(200).optional(),
      summary: z.string().max(5000).optional(),
    }),
    experience: z.array(z.object({
      id: z.string(),
      company: z.string().min(1).max(200),
      position: z.string().min(1).max(200),
      location: z.string().max(200).optional(),
      startDate: z.string().regex(/^\d{4}-\d{2}$/).optional(),
      endDate: z.string().regex(/^\d{4}-\d{2}$/).optional(),
      current: z.boolean().default(false),
      description: z.string().max(5000).optional(),
    })).max(50),
    education: z.array(z.object({
      id: z.string(),
      institution: z.string().min(1).max(200),
      degree: z.string().min(1).max(200),
      field: z.string().max(200).optional(),
      location: z.string().max(200).optional(),
      startDate: z.string().regex(/^\d{4}-\d{2}$/).optional(),
      endDate: z.string().regex(/^\d{4}-\d{2}$/).optional(),
      gpa: z.string().max(10).optional(),
    })).max(20),
    skills: z.array(z.object({
      id: z.string(),
      name: z.string().min(1).max(100),
      level: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
    })).max(100),
    projects: z.array(z.object({
      id: z.string(),
      name: z.string().min(1).max(200),
      description: z.string().max(5000).optional(),
      link: z.string().url().max(500).optional(),
      technologies: z.array(z.string().max(100)).max(20).optional(),
    })).max(30).optional(),
    certifications: z.array(z.object({
      id: z.string(),
      name: z.string().min(1).max(200),
      issuer: z.string().max(200).optional(),
      date: z.string().regex(/^\d{4}-\d{2}$/).optional(),
      expiry: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    })).max(20).optional(),
    languages: z.array(z.object({
      id: z.string(),
      language: z.string().min(1).max(100),
      proficiency: z.enum(["basic", "conversational", "fluent", "native"]),
    })).max(10).optional(),
    awards: z.array(z.object({
      id: z.string(),
      title: z.string().min(1).max(200),
      issuer: z.string().max(200).optional(),
      date: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    })).max(20).optional(),
  }),
});

// CV schema (extends resume)
export const cvSchema = resumeSchema.extend({
  content: z.object({
    personalInfo: z.object({
      fullName: z.string().min(1).max(200),
      email: z.string().email().max(254),
      phone: z.string().max(50).optional(),
      location: z.string().max(200).optional(),
      website: z.string().url().max(500).optional(),
      linkedIn: z.string().max(200).optional(),
      summary: z.string().max(5000).optional(),
    }),
    publications: z.array(z.object({
      id: z.string(),
      title: z.string().min(1).max(500),
      authors: z.array(z.string().max(200)).max(50),
      journal: z.string().max(500).optional(),
      year: z.number().min(1900).max(new Date().getFullYear() + 1),
      doi: z.string().max(500).optional(),
      url: z.string().url().max(500).optional(),
    })).max(100).optional(),
    research: z.array(z.object({
      id: z.string(),
      title: z.string().min(1).max(500),
      institution: z.string().max(200).optional(),
      description: z.string().max(5000).optional(),
      startDate: z.string().regex(/^\d{4}-\d{2}$/).optional(),
      endDate: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    })).max(30).optional(),
    grants: z.array(z.object({
      id: z.string(),
      title: z.string().min(1).max(500),
      agency: z.string().max(200).optional(),
      amount: z.string().max(100).optional(),
      year: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
    })).max(30).optional(),
    teaching: z.array(z.object({
      id: z.string(),
      course: z.string().min(1).max(300),
      institution: z.string().max(200).optional(),
      semester: z.string().max(50).optional(),
    })).max(50).optional(),
    awards: z.array(z.object({
      id: z.string(),
      title: z.string().min(1).max(300),
      organization: z.string().max(200).optional(),
      year: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
    })).max(50).optional(),
    professionalService: z.array(z.object({
      id: z.string(),
      role: z.string().min(1).max(300),
      organization: z.string().max(200).optional(),
      startYear: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
      endYear: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
    })).max(30).optional(),
  }),
});

// Job search schemas
export const jobSearchSchema = z.object({
  query: z.string().max(500).optional(),
  location: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  jobType: z.enum(["full-time", "part-time", "contract", "freelance", "internship", "remote"]).optional(),
  experienceLevel: z.enum(["entry", "mid", "senior", "executive"]).optional(),
  salaryMin: z.number().min(0).max(10000000).optional(),
  salaryMax: z.number().min(0).max(10000000).optional(),
  remote: z.boolean().optional(),
  page: z.number().min(1).max(1000).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Cover letter schema
export const coverLetterSchema = z.object({
  id: z.string().optional(),
  jobTitle: z.string().min(1).max(200),
  company: z.string().min(1).max(200),
  template: z.enum(["professional", "modern", "enthusiastic", "concise"]).default("professional"),
  customParagraphs: z.array(z.string().max(5000)).max(5).optional(),
});

// AI suggestion schema
export const aiSuggestionSchema = z.object({
  type: z.enum(["resume", "coverLetter", "linkedIn", "ats"]),
  content: z.string().min(1).max(50000),
  targetRole: z.string().max(200).optional(),
  industry: z.string().max(100).optional(),
});

// ATS checker schema
export const atsCheckSchema = z.object({
  resumeId: z.string().optional(),
  resumeContent: z.string().max(50000).optional(),
  jobDescription: z.string().max(10000),
});

// User profile schema
export const userProfileSchema = z.object({
  name: z.string().min(1).max(200),
  phone: z.string().max(50).optional(),
  location: z.string().max(200).optional(),
  website: z.string().url().max(500).optional(),
  bio: z.string().max(5000).optional(),
});

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(8).max(128),
  newPassword: z.string().min(8).max(128).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    "Password must contain uppercase, lowercase, number and special character"
  ),
  confirmPassword: z.string().min(8).max(128),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Share schema
export const shareSchema = z.object({
  type: z.enum(["whatsapp", "linkedin", "twitter", "email", "copy"]),
  resumeId: z.string().optional(),
  message: z.string().max(1000).optional(),
});

// Thesis schema
export const thesisSchema = z.object({
  title: z.string().min(1).max(500),
  field: z.string().min(1).max(200),
  level: z.enum(["undergraduate", "masters", "phd"]),
  keywords: z.array(z.string().max(100)).max(10).optional(),
});

// Career counseling schema
export const careerCounselingSchema = z.object({
  skills: z.array(z.string().max(100)).max(50),
  interests: z.array(z.string().max(100)).max(20),
  experience: z.enum(["entry", "mid", "senior", "executive"]),
  preferredLocation: z.string().max(200).optional(),
  preferredSalary: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }).optional(),
});

// Study guide schema
export const studyGuideSchema = z.object({
  interests: z.array(z.string().max(100)).max(20),
  careerGoals: z.array(z.string().max(200)).max(10),
  preferredLocation: z.string().max(200).optional(),
  budget: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }).optional(),
  duration: z.enum(["short", "medium", "long"]).optional(),
});

// API rate limit constants
export const RATE_LIMITS = {
  // Per minute
  RESUME_GENERATE: { limit: 5, window: 60 },
  PDF_EXPORT: { limit: 10, window: 60 },
  AI_SUGGEST: { limit: 20, window: 60 },
  ATS_CHECK: { limit: 10, window: 60 },
  JOB_SEARCH: { limit: 100, window: 60 },
  COVER_LETTER_GENERATE: { limit: 10, window: 60 },
  // Per hour
  AUTH_LOGIN: { limit: 10, window: 3600 },
  AUTH_REGISTER: { limit: 5, window: 3600 },
  PASSWORD_RESET: { limit: 3, window: 3600 },
  // Per day
  EMAIL_SEND: { limit: 50, window: 86400 },
  SHARE: { limit: 50, window: 86400 },
};
