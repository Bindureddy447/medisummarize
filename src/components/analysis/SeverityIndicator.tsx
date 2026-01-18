import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Severity } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface SeverityIndicatorProps {
  severity: Severity;
}

const SeverityIndicator = ({ severity }: SeverityIndicatorProps) => {
  const config = {
    low: {
      icon: CheckCircle,
      label: 'Low Risk',
      bgColor: 'bg-success/10 border-success/30',
      textColor: 'text-success',
      description: 'Document indicates stable condition with no immediate concerns.'
    },
    medium: {
      icon: AlertCircle,
      label: 'Medium Risk',
      bgColor: 'bg-warning/10 border-warning/30',
      textColor: 'text-warning',
      description: 'Document contains findings that require monitoring or follow-up.'
    },
    high: {
      icon: AlertTriangle,
      label: 'High Risk',
      bgColor: 'bg-destructive/10 border-destructive/30',
      textColor: 'text-destructive',
      description: 'Document indicates critical or urgent medical conditions.'
    }
  };

  const { icon: Icon, label, bgColor, textColor, description } = config[severity.level];

  return (
    <div className={cn('rounded-xl border p-5', bgColor)}>
      <div className="flex items-center gap-3 mb-3">
        <div className={cn('p-2 rounded-lg', bgColor)}>
          <Icon className={cn('h-6 w-6', textColor)} />
        </div>
        <div>
          <h3 className={cn('font-semibold text-lg', textColor)}>{label}</h3>
          <p className="text-sm text-muted-foreground">Severity Score: {severity.score.toFixed(1)}</p>
        </div>
      </div>
      
      <p className="text-sm text-foreground mb-3">{description}</p>
      
      {severity.indicators.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-muted-foreground mb-2">Key Indicators Found:</p>
          <div className="flex flex-wrap gap-2">
            {severity.indicators.map((indicator, idx) => (
              <span 
                key={idx}
                className={cn('text-xs px-2 py-1 rounded-full capitalize', bgColor, textColor)}
              >
                {indicator}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeverityIndicator;
