import { AlertTriangle, Info } from 'lucide-react';
import { DrugWarning } from '@/types/analysis';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DrugInteractionWarningsProps {
  warnings: DrugWarning[];
}

const DrugInteractionWarnings = ({ warnings }: DrugInteractionWarningsProps) => {
  if (warnings.length === 0) return null;

  return (
    <div className="medical-card">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <h3 className="text-lg font-semibold text-foreground">Drug Interaction Alerts</h3>
      </div>
      
      <Alert className="mb-4 border-muted">
        <Info className="h-4 w-4" />
        <AlertTitle>Informational Only</AlertTitle>
        <AlertDescription>
          These are rule-based alerts for educational purposes. They are NOT a medical diagnosis. 
          Always consult a healthcare professional for medication advice.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        {warnings.map((warning, idx) => (
          <div 
            key={idx}
            className="flex items-start gap-3 bg-warning/10 border border-warning/30 rounded-lg p-4"
          >
            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-warning capitalize">{warning.drug1}</span>
                <span className="text-muted-foreground">↔</span>
                <span className="font-medium text-warning capitalize">{warning.drug2}</span>
              </div>
              <p className="text-sm text-foreground">{warning.warning}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DrugInteractionWarnings;
