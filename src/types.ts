export interface ESevaService {
  id: string;
  title: string;
  department: string;
  description: string;
  category: "IDENTITY" | "FINANCE" | "HEALTH" | "LABOUR" | "LAND" | "WELFARE" | "AGRICULTURE" | "EDUCATION";
  processingTime: string;
  fees: number;
  documentsRequired: string[];
  launchUrlName?: string;
}

export interface ServiceApplication {
  id: string;
  serviceId: string;
  serviceName: string;
  arn: string; // Application Reference Number
  applicantName: string;
  aadhaarNumber: string;
  state: string;
  submissionDate: string;
  status: "SUBMITTED" | "UNDER_VERIFICATION" | "TENTATIVELY_APPROVED" | "APPROVED" | "REJECTED";
  comments: string;
  formData: Record<string, string>;
  approvedDate?: string;
}

export interface GrievanceRecord {
  id: string;
  department: string;
  serviceAffected: string;
  refNumber: string; // Grievance Reference Number (like CPGRAMS style)
  subject: string;
  description: string;
  stateOfGrievance: string;
  status: "LODGED" | "ASSIGNED" | "UNDER_INVESTIGATION" | "RESOLVED";
  dateFiled: string;
  officialReply?: string;
  replyDate?: string;
}

export interface DigiLockerDocument {
  id: string;
  docType: "AADHAAR" | "PAN" | "ABHA_HEALTH" | "INCOME_CERT" | "E_SHRAM";
  docNumber: string;
  holderName: string;
  issueDate: string;
  digitalSignature: string; // Cryptographic verification code
  qrCodeText: string;
  data: Record<string, string>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  sources?: { title: string; url: string }[];
}
