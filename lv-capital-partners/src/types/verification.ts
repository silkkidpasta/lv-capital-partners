// Accredited Investor Verification Types
export interface AccreditedInvestorForm {
  id?: string;
  userId: string;
  status: VerificationStatus;
  submissionDate: string;
  reviewDate?: string;
  expirationDate?: string;

  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    ssn: string;
    phoneNumber: string;
    email: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };

  // Verification Method
  verificationMethod: VerificationMethod;

  // Income/Asset Verification
  financialInfo: {
    annualIncome?: number;
    netWorth?: number;
    liquidNetWorth?: number;
    employmentStatus: string;
    occupation: string;
    employer?: string;
  };

  // Professional Certifications (if applicable)
  professionalInfo?: {
    isFinancialProfessional: boolean;
    certifications: string[];
    firmName?: string;
    registrationNumber?: string;
  };

  // Entity Information (if investing as entity)
  entityInfo?: {
    entityName: string;
    entityType: string;
    taxId: string;
    formationState: string;
    authorizedPerson: string;
    title: string;
  };

  // Document Uploads
  documents: VerificationDocument[];

  // Compliance & Declarations
  compliance: {
    acknowledgedRisks: boolean;
    understoodInvestmentTerms: boolean;
    confirmedAccreditedStatus: boolean;
    agreeToTerms: boolean;
    signature: string;
    signatureDate: string;
    ipAddress: string;
  };

  // Review Information
  reviewInfo?: {
    reviewedBy: string;
    reviewNotes: string;
    additionalDocumentsRequired?: string[];
    approvalDate?: string;
    rejectionReason?: string;
  };
}

export type VerificationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "rejected"
  | "expired"
  | "additional_docs_required";

export type VerificationMethod =
  | "income_verification"
  | "net_worth_verification"
  | "professional_certification"
  | "entity_verification"
  | "third_party_verification";

export interface VerificationDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadDate: string;
  verificationStatus: "pending" | "verified" | "rejected";
  rejectionReason?: string;
}

export type DocumentType =
  | "tax_return"
  | "w2_form"
  | "pay_stub"
  | "bank_statement"
  | "investment_account_statement"
  | "cpa_letter"
  | "attorney_letter"
  | "professional_certification"
  | "government_id"
  | "passport"
  | "entity_formation_docs"
  | "financial_statements"
  | "audit_report"
  | "other";

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
  category: "federal" | "state" | "internal";
  validationFunction?: string;
}

export interface VerificationAuditLog {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  performedBy: string;
  details: Record<string, unknown>;
  ipAddress: string;
}
