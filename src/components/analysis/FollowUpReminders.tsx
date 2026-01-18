import { Bell, Calendar, Pill } from 'lucide-react';

interface FollowUpRemindersProps {
  instructions: string[];
  medications: string[];
}

const FollowUpReminders = ({ instructions, medications }: FollowUpRemindersProps) => {
  if (instructions.length === 0 && medications.length === 0) return null;

  // Extract time-based reminders
  const timeBasedReminders = instructions.filter(i => 
    /\d+\s*(day|week|month|year)/i.test(i) || 
    /follow[- ]?up/i.test(i) ||
    /appointment/i.test(i)
  );

  // Extract medication durations
  const medicationReminders = medications.filter(m =>
    /\d+\s*(day|week|month)/i.test(m) ||
    /daily|twice|continue/i.test(m)
  );

  if (timeBasedReminders.length === 0 && medicationReminders.length === 0) return null;

  return (
    <div className="medical-card">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5 text-warning" />
        <h3 className="text-lg font-semibold text-foreground">Follow-Up Reminders</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Important appointments and medication schedules extracted from the document.
      </p>

      {timeBasedReminders.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Appointments</span>
          </div>
          <ul className="space-y-2">
            {timeBasedReminders.map((reminder, idx) => (
              <li 
                key={idx}
                className="flex items-start gap-2 bg-primary/5 rounded-lg p-3 border border-primary/20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-sm text-foreground">{reminder}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {medicationReminders.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Pill className="h-4 w-4 text-success" />
            <span className="text-sm font-medium text-foreground">Medication Schedule</span>
          </div>
          <ul className="space-y-2">
            {medicationReminders.map((med, idx) => (
              <li 
                key={idx}
                className="flex items-start gap-2 bg-success/5 rounded-lg p-3 border border-success/20"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                <span className="text-sm text-foreground">{med}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FollowUpReminders;
