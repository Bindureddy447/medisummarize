export interface HighlightedTerms {
  diseases: string[];
  medications: string[];
  tests: string[];
}

export interface Severity {
  level: 'low' | 'medium' | 'high';
  score: number;
  indicators: string[];
}

export interface TimelineEvent {
  type: string;
  date: string;
}

export interface Abbreviation {
  abbr: string;
  full: string;
}

export interface DrugWarning {
  drug1: string;
  drug2: string;
  warning: string;
}

export interface Summaries {
  clinical: string;
  patient: string;
  emergency: string;
}

export interface AnalysisResult {
  summaries: Summaries;
  keyFindings: string[];
  medications: string[];
  followUpInstructions: string[];
  diagnoses: string[];
  procedures: string[];
  vitalSigns: Record<string, string>;
  highlightedTerms: HighlightedTerms;
  severity: Severity;
  timeline: TimelineEvent[];
  department: string;
  abbreviations: Abbreviation[];
  drugWarnings: DrugWarning[];
  analyzedAt: string;
}

export type SummaryMode = 'clinical' | 'patient' | 'emergency';
