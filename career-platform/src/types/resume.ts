import { PersonalInfo, Experience, Education, Project, Certification, Language, Award } from "@/types";

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  awards: Award[];
  // CV-specific fields (optional)
  research?: Array<{
    id: string;
    title: string;
    institution: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  publications?: Array<{
    id: string;
    title: string;
    authors: string;
    journal: string;
    year: string;
    doi?: string;
  }>;
  presentations?: Array<{
    id: string;
    title: string;
    event: string;
    location: string;
    date: string;
  }>;
  grants?: Array<{
    id: string;
    title: string;
    agency: string;
    amount: string;
    year: string;
  }>;
  teaching?: Array<{
    id: string;
    course: string;
    institution: string;
    semester: string;
  }>;
  professionalMemberships?: Array<{
    id: string;
    organization: string;
    role: string;
    startYear: string;
    endYear?: string;
  }>;
  references?: Array<{
    id: string;
    name: string;
    title: string;
    institution: string;
    email: string;
    phone?: string;
  }>;
  // Legal-specific fields
  barAdmissions?: Array<{
    state: string;
    year: string;
  }>;
  // Medical-specific fields
  licenses?: Array<{
    type: string;
    state: string;
    number: string;
    year: string;
  }>;
}

export interface CVData {
  personalInfo: PersonalInfo;
  education: Education[];
  research: Array<{
    id: string;
    title: string;
    institution: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  publications: Array<{
    id: string;
    title: string;
    authors: string;
    journal: string;
    year: string;
    doi?: string;
  }>;
  presentations: Array<{
    id: string;
    title: string;
    event: string;
    location: string;
    date: string;
  }>;
  grants: Array<{
    id: string;
    title: string;
    agency: string;
    amount: string;
    year: string;
  }>;
  teaching: Array<{
    id: string;
    course: string;
    institution: string;
    semester: string;
  }>;
  awards: Award[];
  professionalMemberships: Array<{
    id: string;
    organization: string;
    role: string;
    startYear: string;
    endYear?: string;
  }>;
  references: Array<{
    id: string;
    name: string;
    title: string;
    institution: string;
    email: string;
    phone?: string;
  }>;
}

export const templates = [
  // General
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary with a professional color accent",
    category: "General",
    preview: "/templates/modern.png",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional format trusted by recruiters worldwide",
    category: "General",
    preview: "/templates/classic.png",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant with focus on content",
    category: "General",
    preview: "/templates/minimal.png",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Stand out with a unique visual design",
    category: "Creative",
    preview: "/templates/creative.png",
  },
  // Professional
  {
    id: "executive",
    name: "Executive",
    description: "Sophisticated design for C-level and senior management",
    category: "Professional",
    preview: "/templates/executive.png",
  },
  {
    id: "technical",
    name: "Technical",
    description: "Skills-focused for developers and engineers",
    category: "Professional",
    preview: "/templates/technical.png",
  },
  {
    id: "academic",
    name: "Academic",
    description: "Research and publication-focused for academia",
    category: "Professional",
    preview: "/templates/academic.png",
  },
  {
    id: "medical",
    name: "Medical",
    description: "Clinical-focused for healthcare professionals",
    category: "Professional",
    preview: "/templates/medical.png",
  },
  {
    id: "legal",
    name: "Legal",
    description: "Traditional format for attorneys and legal professionals",
    category: "Professional",
    preview: "/templates/legal.png",
  },
];
