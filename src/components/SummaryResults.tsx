import { FileText, Stethoscope, Pill, Calendar, Heart, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface SummaryData {
  summary: string;
  keyFindings: string[];
  medications: string[];
  followUpInstructions: string[];
  patientFriendlyExplanation: string;
}

interface SummaryResultsProps {
  data: SummaryData;
}

const SummaryResults = ({ data }: SummaryResultsProps) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sections = [
    {
      id: 'summary',
      title: 'Clinical Summary',
      icon: FileText,
      content: data.summary,
      color: 'text-primary',
      bgColor: 'bg-primary/5 border-primary/20'
    },
    {
      id: 'keyFindings',
      title: 'Key Findings',
      icon: Stethoscope,
      content: data.keyFindings,
      color: 'text-accent',
      bgColor: 'bg-accent/5 border-accent/20'
    },
    {
      id: 'medications',
      title: 'Medications',
      icon: Pill,
      content: data.medications,
      color: 'text-success',
      bgColor: 'bg-success/5 border-success/20'
    },
    {
      id: 'followUp',
      title: 'Follow-up Instructions',
      icon: Calendar,
      content: data.followUpInstructions,
      color: 'text-warning',
      bgColor: 'bg-warning/5 border-warning/20'
    },
    {
      id: 'patientFriendly',
      title: 'Patient-Friendly Explanation',
      icon: Heart,
      content: data.patientFriendlyExplanation,
      color: 'text-primary',
      bgColor: 'bg-medical-light border-primary/20'
    }
  ];

  return (
    <div className="space-y-4 slide-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-semibold text-foreground">
          Document Analysis
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const fullText = `
CLINICAL SUMMARY:
${data.summary}

KEY FINDINGS:
${data.keyFindings.map(f => `• ${f}`).join('\n')}

MEDICATIONS:
${data.medications.map(m => `• ${m}`).join('\n')}

FOLLOW-UP INSTRUCTIONS:
${data.followUpInstructions.map(i => `• ${i}`).join('\n')}

PATIENT-FRIENDLY EXPLANATION:
${data.patientFriendlyExplanation}
            `.trim();
            copyToClipboard(fullText, 'all');
          }}
        >
          {copiedSection === 'all' ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy All
            </>
          )}
        </Button>
      </div>

      {sections.map((section, index) => {
        const Icon = section.icon;
        const isArray = Array.isArray(section.content);
        const hasContent = isArray 
          ? (section.content as string[]).length > 0 
          : typeof section.content === 'string' && section.content.trim().length > 0;

        if (!hasContent) return null;

        const contentAsText = isArray 
          ? (section.content as string[]).join('\n') 
          : section.content as string;

        return (
          <div 
            key={section.id}
            className={cn(
              'rounded-xl border p-5 transition-all fade-in',
              section.bgColor
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon className={cn('h-5 w-5', section.color)} />
                <h3 className="font-semibold text-foreground">{section.title}</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => copyToClipboard(contentAsText, section.id)}
              >
                {copiedSection === section.id ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>

            {isArray ? (
              <ul className="space-y-2">
                {(section.content as string[]).map((item, idx) => (
                  <li 
                    key={idx}
                    className="flex items-start gap-2 text-foreground"
                  >
                    <span className={cn('mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0', section.color.replace('text-', 'bg-'))} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-foreground leading-relaxed">
                {section.content as string}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SummaryResults;
