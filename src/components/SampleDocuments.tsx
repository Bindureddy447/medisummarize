import { FileText, FlaskConical, Stethoscope, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sampleDocuments, getDocumentTypeLabel, getDocumentTypeColor, SampleDocument } from '@/data/sampleDocuments';
import { cn } from '@/lib/utils';

interface SampleDocumentsProps {
  onSelectDocument: (content: string) => void;
  isProcessing: boolean;
}

const getDocumentIcon = (type: SampleDocument['type']) => {
  const icons = {
    discharge: FileText,
    radiology: Scan,
    lab: FlaskConical,
    consultation: Stethoscope
  };
  return icons[type];
};

const SampleDocuments = ({ onSelectDocument, isProcessing }: SampleDocumentsProps) => {
  return (
    <div className="medical-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="section-badge">
          <FileText className="h-3 w-3" />
          Sample Documents
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Try the summarizer with these de-identified clinical documents:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sampleDocuments.map((doc) => {
          const Icon = getDocumentIcon(doc.type);
          return (
            <Button
              key={doc.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start text-left hover:border-primary/50 transition-all"
              onClick={() => onSelectDocument(doc.content)}
              disabled={isProcessing}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="h-4 w-4 text-primary" />
                <span className={cn('text-xs px-2 py-0.5 rounded-full', getDocumentTypeColor(doc.type))}>
                  {getDocumentTypeLabel(doc.type)}
                </span>
              </div>
              <span className="font-medium text-foreground">{doc.title}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default SampleDocuments;
