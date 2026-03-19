import { AlertTriangle } from 'lucide-react';

const DisclaimerBanner = () => {
  return (
    <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-foreground mb-1">Important Medical Disclaimer</p>
          <p className="text-muted-foreground">
            This tool provides AI-generated summaries for informational purposes only. It does{' '}
            <strong>not</strong> predict diseases, recommend treatments, or provide medical diagnoses. 
            Always consult qualified healthcare professionals for medical decisions. No patient data is stored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
