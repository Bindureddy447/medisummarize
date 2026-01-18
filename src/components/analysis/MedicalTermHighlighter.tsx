import { Activity, Pill, FlaskConical } from 'lucide-react';
import { HighlightedTerms } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface MedicalTermHighlighterProps {
  terms: HighlightedTerms;
}

const MedicalTermHighlighter = ({ terms }: MedicalTermHighlighterProps) => {
  const categories = [
    {
      title: 'Diseases & Conditions',
      icon: Activity,
      items: terms.diseases,
      bgColor: 'bg-destructive/10',
      textColor: 'text-destructive',
      borderColor: 'border-destructive/20'
    },
    {
      title: 'Medications',
      icon: Pill,
      items: terms.medications,
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
      borderColor: 'border-primary/20'
    },
    {
      title: 'Medical Tests',
      icon: FlaskConical,
      items: terms.tests,
      bgColor: 'bg-success/10',
      textColor: 'text-success',
      borderColor: 'border-success/20'
    }
  ];

  const hasAnyTerms = terms.diseases.length > 0 || terms.medications.length > 0 || terms.tests.length > 0;

  if (!hasAnyTerms) return null;

  return (
    <div className="medical-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Medical Terms Identified</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Terms are highlighted using keyword-based NLP and Named Entity Recognition (NER) techniques.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map(({ title, icon: Icon, items, bgColor, textColor, borderColor }) => (
          items.length > 0 && (
            <div key={title} className={cn('rounded-lg border p-4', borderColor, bgColor)}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className={cn('h-4 w-4', textColor)} />
                <span className={cn('font-medium text-sm', textColor)}>{title}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((item, idx) => (
                  <span 
                    key={idx}
                    className={cn(
                      'text-xs px-2 py-1 rounded-full capitalize',
                      bgColor,
                      textColor,
                      'font-medium'
                    )}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default MedicalTermHighlighter;
