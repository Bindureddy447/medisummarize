import { useState } from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnalysisResult, SummaryMode } from '@/types/analysis';
import SeverityIndicator from './analysis/SeverityIndicator';
import MedicalTermHighlighter from './analysis/MedicalTermHighlighter';
import TimelineGenerator from './analysis/TimelineGenerator';
import AbbreviationExpander from './analysis/AbbreviationExpander';
import DrugInteractionWarnings from './analysis/DrugInteractionWarnings';
import DepartmentBadge from './analysis/DepartmentBadge';
import SummaryModeSelector from './analysis/SummaryModeSelector';
import QAChatbot from './analysis/QAChatbot';
import FollowUpReminders from './analysis/FollowUpReminders';
import PDFDownload from './analysis/PDFDownload';
import AccessLog from './analysis/AccessLog';

interface EnhancedResultsProps {
  analysis: AnalysisResult;
  documentText: string;
  uploadTimestamp: string;
  onReset: () => void;
}

const EnhancedResults = ({ analysis, documentText, uploadTimestamp, onReset }: EnhancedResultsProps) => {
  const [summaryMode, setSummaryMode] = useState<SummaryMode>('clinical');
  const [copied, setCopied] = useState(false);

  const copyAll = async () => {
    const text = `
CLINICAL SUMMARY:
${analysis.summaries.clinical}

KEY FINDINGS:
${analysis.keyFindings.map(f => `• ${f}`).join('\n')}

MEDICATIONS:
${analysis.medications.map(m => `• ${m}`).join('\n')}

FOLLOW-UP:
${analysis.followUpInstructions.map(i => `• ${i}`).join('\n')}
    `.trim();
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 slide-up">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-serif font-semibold text-foreground">Document Analysis</h2>
          <DepartmentBadge department={analysis.department} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyAll} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy All'}
          </Button>
          <Button variant="outline" size="sm" onClick={onReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Access Log */}
      <AccessLog uploadTimestamp={uploadTimestamp} analysisTimestamp={analysis.analyzedAt} />

      {/* Severity Indicator */}
      <SeverityIndicator severity={analysis.severity} />

      {/* Multi-Summary Modes */}
      <SummaryModeSelector mode={summaryMode} onModeChange={setSummaryMode} summaries={analysis.summaries} />

      {/* Medical Term Highlighter */}
      <MedicalTermHighlighter terms={analysis.highlightedTerms} />

      {/* Timeline */}
      <TimelineGenerator events={analysis.timeline} />

      {/* Follow-up Reminders */}
      <FollowUpReminders instructions={analysis.followUpInstructions} medications={analysis.medications} />

      {/* Drug Interaction Warnings */}
      <DrugInteractionWarnings warnings={analysis.drugWarnings} />

      {/* Q&A Chatbot */}
      <QAChatbot documentText={documentText} />

      {/* Abbreviation Expander */}
      <AbbreviationExpander abbreviations={analysis.abbreviations} />

      {/* PDF Download */}
      <PDFDownload analysis={analysis} />
    </div>
  );
};

export default EnhancedResults;
