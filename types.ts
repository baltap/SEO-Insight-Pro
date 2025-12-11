export interface SEOAnalysisRequest {
  url: string;
  targetKeywords?: string;
  competitors?: string;
  additionalContext?: string;
}

export interface ReportSection {
  title: string;
  content: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface AnalysisMetric {
  score: number;
  status: 'Critical' | 'Poor' | 'Fair' | 'Good' | 'Excellent';
}

export interface AnalysisMetrics {
  technical: AnalysisMetric;
  onPage: AnalysisMetric;
  content: AnalysisMetric;
  keywords: AnalysisMetric;
  aiReadiness?: AnalysisMetric;
}

export interface AnalysisResult {
  markdown: string;
  sources: GroundingSource[];
  metrics?: AnalysisMetrics;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

// llms.txt Generator Types
export interface LlmsTxtProduct {
  name: string;
  description: string;
  keywords: string;
}

export interface LlmsTxtUrl {
  type: string;
  url: string;
}

export interface LlmsTxtFormData {
  companyName: string;
  websiteUrl: string;
  industry: string;
  description: string;
  foundedYear: string;
  companySize: string;
  products: LlmsTxtProduct[];
  mainValueProp: string;
  targetAudience: {
    industries: string;
    sizes: string;
    roles: string;
    geo: string;
  };
  competitors: string[];
  differentiators: string[];
  marketPosition: string;
  uniqueValue: string;
  importantUrls: LlmsTxtUrl[];
  restrictions: string;
  citationPreference: string;
}