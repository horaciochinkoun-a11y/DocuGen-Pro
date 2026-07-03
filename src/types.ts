export interface ProjectData {
  developerName: string;
  developerStatus: string;
  clientName: string;
  companyName: string;
  projectName: string;
  projectType: string;
  description: string;
  technologies: string;
  keyFeatures: string;
  results: string;
  duration: string;
  clientContact: string;
  manualTime: string;
  manualLocation: string;
  githubLink: string;
  linkedinLink: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  useCustomApiKey: boolean;
  userApiKey?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GeneratedDocs {
  // Mode Completion (Default)
  attestation?: string;
  technicalSummary?: string;
  cvVersion?: string;
  linkedinVersion?: string;
  
  // Mode Initiation
  roadmap?: string;
  architecture?: string;
  backlog?: string;
  pitch?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  formData: ProjectData;
  generatedDocs: GeneratedDocs;
  phase: 'completion' | 'initiation';
}
