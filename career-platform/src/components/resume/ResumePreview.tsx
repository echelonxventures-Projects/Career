"use client";

import { ResumeData } from "@/types/resume";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ExecutiveTemplate } from "./templates/advanced/ExecutiveTemplate";
import { TechnicalTemplate } from "./templates/advanced/TechnicalTemplate";
import { CreativeTemplate } from "./templates/advanced/CreativeTemplate";
import { AcademicTemplate } from "./templates/advanced/AcademicTemplate";
import { MedicalTemplate } from "./templates/advanced/MedicalTemplate";
import { LegalTemplate } from "./templates/advanced/LegalTemplate";

interface ResumePreviewProps {
  template: string;
  data: ResumeData;
}

export function ResumePreview({ template, data }: ResumePreviewProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-hidden rounded-xl bg-white">
        {template === "modern" && <ModernTemplate data={data} />}
        {template === "classic" && <ClassicTemplate data={data} />}
        {template === "minimal" && <MinimalTemplate data={data} />}
        {template === "creative" && <CreativeTemplate data={data} />}
        {template === "executive" && <ExecutiveTemplate data={data} />}
        {template === "technical" && <TechnicalTemplate data={data} />}
        {template === "academic" && <AcademicTemplate data={data} />}
        {template === "medical" && <MedicalTemplate data={data} />}
        {template === "legal" && <LegalTemplate data={data} />}
      </div>
    </div>
  );
}
