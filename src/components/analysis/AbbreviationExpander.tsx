import { BookOpen } from 'lucide-react';
import { Abbreviation } from '@/types/analysis';

interface AbbreviationExpanderProps {
  abbreviations: Abbreviation[];
}

const AbbreviationExpander = ({ abbreviations }: AbbreviationExpanderProps) => {
  if (abbreviations.length === 0) return null;

  return (
    <div className="medical-card">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Medical Abbreviations</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Common medical abbreviations found in the document, expanded for better patient understanding.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {abbreviations.map(({ abbr, full }, idx) => (
          <div 
            key={idx}
            className="flex items-start gap-3 bg-secondary/30 rounded-lg p-3 border border-border/50"
          >
            <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded text-sm">
              {abbr}
            </span>
            <span className="text-sm text-foreground">{full}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AbbreviationExpander;
