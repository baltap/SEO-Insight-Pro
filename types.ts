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