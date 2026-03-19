import { Calendar, Clock } from 'lucide-react';
import { TimelineEvent } from '@/types/analysis';
import { cn } from '@/lib/utils';

interface TimelineGeneratorProps {
  events: TimelineEvent[];
}

const TimelineGenerator = ({ events }: TimelineGeneratorProps) => {
  if (events.length === 0) return null;

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      'Admission': 'bg-primary text-primary-foreground',
      'Discharge': 'bg-success text-success-foreground',
      'Procedure': 'bg-warning text-warning-foreground',
      'Follow-up': 'bg-accent text-accent-foreground',
      'Date mentioned': 'bg-muted text-muted-foreground'
    };
    return colors[type] || 'bg-secondary text-secondary-foreground';
  };

  return (
    <div className="medical-card">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Treatment Timeline</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Dates extracted from the document and arranged chronologically to represent the patient journey.
      </p>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
        
        <div className="space-y-4">
          {events.map((event, idx) => (
            <div key={idx} className="relative pl-10">
              <div className={cn(
                'absolute left-2 w-5 h-5 rounded-full flex items-center justify-center',
                getEventColor(event.type)
              )}>
                <Clock className="h-3 w-3" />
              </div>
              
              <div className="bg-secondary/30 rounded-lg p-3 border border-border/50">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    getEventColor(event.type)
                  )}>
                    {event.type}
                  </span>
                  <span className="text-sm font-medium text-foreground">{event.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineGenerator;
