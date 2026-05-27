export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: "USER" | "PREMIUM" | "PRO" | "ADMIN";
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  template: string;
  isDefault: boolean;
  personalInfo?: PersonalInfo;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  projects?: Project[];
  certifications?: Certification[];
  languages?: Language[];
  awards?: Award[];
  atsScore?: number;
  downloads: number;
  views: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedIn?: string;
  github?: string;
  summary?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  technologies?: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expires?: string;
  credentialId?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "Native" | "Fluent" | "Advanced" | "Intermediate" | "Basic";
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface CV {
  id: string;
  userId: string;
  title: string;
  template: string;
  isDefault: boolean;
  personalInfo?: PersonalInfo;
  education?: Education[];
  research?: Research[];
  publications?: Publication[];
  presentations?: Presentation[];
  grants?: Grant[];
  teaching?: Teaching[];
  awards?: Award[];
  professionalMemberships?: ProfessionalMembership[];
  references?: Reference[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Research {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  conference?: string;
  year: number;
  doi?: string;
  url?: string;
}

export interface Presentation {
  id: string;
  title: string;
  event: string;
  location?: string;
  date: string;
  type: "Keynote" | "Talk" | "Poster" | "Workshop";
}

export interface Grant {
  id: string;
  title: string;
  agency: string;
  amount: string;
  startDate: string;
  endDate: string;
  role: "Principal Investigator" | "Co-Investigator" | "Collaborator";
}

export interface Teaching {
  id: string;
  course: string;
  institution: string;
  semester: string;
  role: "Instructor" | "Teaching Assistant" | "Guest Lecturer";
}

export interface ProfessionalMembership {
  id: string;
  organization: string;
  role?: string;
  startDate: string;
  endDate?: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone?: string;
  relationship: string;
}

export interface CoverLetter {
  id: string;
  userId: string;
  title: string;
  jobTitle?: string;
  company?: string;
  recipient?: Recipient;
  body: string;
  signature?: string;
  template: string;
  isAiGenerated: boolean;
  aiPrompt?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipient {
  name?: string;
  title?: string;
  company?: string;
  address?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location?: string;
  remote: boolean;
  salary?: Salary;
  jobType: JobType;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  source: string;
  sourceUrl?: string;
  externalId?: string;
  postedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  isSaved?: boolean;
}

export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE" | "TEMPORARY";

export interface Salary {
  min?: number;
  max?: number;
  currency: string;
  period: "hourly" | "monthly" | "yearly";
}

export interface JobApplication {
  id: string;
  userId: string;
  jobId: string;
  resumeId?: string;
  coverLetterId?: string;
  status: ApplicationStatus;
  appliedAt: Date;
  notes?: string;
  job: Job;
  stages: ApplicationStage[];
}

export type ApplicationStatus =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "TECHNICAL"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN"
  | "HIRED";

export interface ApplicationStage {
  id: string;
  stage: string;
  status: string;
  date: Date;
  notes?: string;
}

export interface ATSCheck {
  id: string;
  userId: string;
  resumeId?: string;
  jobDescription: string;
  overallScore: number;
  sectionScores: SectionScores;
  keywordMatches: KeywordMatches;
  suggestions: string[];
  improvements?: ATSImprovements;
  createdAt: Date;
}

export interface SectionScores {
  keywords: number;
  formatting: number;
  content: number;
  skills: number;
}

export interface KeywordMatches {
  matched: string[];
  missing: string[];
}

export interface ATSImprovements {
  title?: string;
  summary?: string;
  experience?: string[];
  education?: string;
  skills?: string[];
}

export interface Subscription {
  id: string;
  userId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

export type SubscriptionStatus =
  | "INCOMPLETE"
  | "INCOMPLETE_EXPIRED"
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "UNPAID"
  | "PAUSED";

export type SubscriptionPlan = "FREE" | "BASIC" | "PREMIUM" | "PRO" | "ENTERPRISE";

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: PaymentType;
  description?: string;
  createdAt: Date;
}

export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "CANCELED" | "REFUNDED";
export type PaymentType = "SUBSCRIPTION" | "ONE_TIME" | "USAGE_BASED" | "CREDIT_PACK";

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  periodStart: Date;
  periodEnd: Date;
  paidAt?: Date;
  pdfUrl?: string;
  items: InvoiceItem[];
}

export type InvoiceStatus = "DRAFT" | "OPEN" | "PAID" | "UNCOLLECTIBLE" | "VOID";

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
}

export interface LinkedInProfile {
  id: string;
  userId: string;
  linkedInId: string;
  profileUrl?: string;
  headline?: string;
  summary?: string;
  industry?: string;
  location?: string;
  connections?: number;
  followers?: number;
  lastSyncedAt?: Date;
  syncStatus: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  type: ServiceType;
  basePrice?: number;
  monthlyPrice?: number;
  creditsCost?: number;
  features: string[];
  limitations?: Record<string, any>;
  isActive: boolean;
  sortOrder: number;
}

export type ServiceType = "FREE" | "SUBSCRIPTION" | "ONE_TIME" | "CREDIT_BASED" | "USAGE_BASED";
