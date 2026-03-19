import { Stethoscope, User, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SummaryMode, Summaries } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface SummaryModeSelectorProps {
  mode: SummaryMode;
  onModeChange: (mode: SummaryMode) => void;
  summaries: Summaries;
}

const SummaryModeSelector = ({ mode, onModeChange, summaries }: SummaryModeSelectorProps) => {
  const modes = [
    {
      id: 'clinical' as SummaryMode,
      label: 'Doctor View',
      icon: Stethoscope,
      description: 'Technical clinical summary',
      content: summaries.clinical
    },
    {
      id: 'patient' as SummaryMode,
      label: 'Patient View',
      icon: User,
      description: 'Simplified explanation',
      content: summaries.patient
    },
    {
      id: 'emergency' as SummaryMode,
      label: 'Emergency',
      icon: Zap,
      description: 'One-line critical info',
      content: summaries.emergency
    }
  ];

  const currentMode = modes.find(m => m.id === mode)!;

  return (
    <div className="medical-card">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-semibold text-foreground">Summary Modes</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        View the same document summarized differently for each user type.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {modes.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={mode === id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange(id)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      <div className={cn(
        'p-4 rounded-lg border',
        mode === 'emergency' 
          ? 'bg-destructive/10 border-destructive/30' 
          : 'bg-secondary/30 border-border/50'
      )}>
        <div className="flex items-center gap-2 mb-2">
          <currentMode.icon className={cn(
            'h-4 w-4',
            mode === 'emergency' ? 'text-destructive' : 'text-primary'
          )} />
          <span className="text-sm font-medium text-muted-foreground">
            {currentMode.description}
          </span>
        </div>
        <p className={cn(
          'leading-relaxed',
          mode === 'emergency' 
            ? 'text-destructive font-semibold text-lg' 
            : 'text-foreground'
        )}>
          {currentMode.content}
        </p>
      </div>
    </div>
  );
};

export default SummaryModeSelector;
