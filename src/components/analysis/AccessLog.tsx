import { Clock, FileCheck } from 'lucide-react';

interface AccessLogProps {
  uploadTimestamp: string;
  analysisTimestamp: string;
}

const AccessLog = ({ uploadTimestamp, analysisTimestamp }: AccessLogProps) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="bg-secondary/30 rounded-lg p-4 border border-border/50">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Document Access Log</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Upload Time</p>
            <p className="text-sm font-medium text-foreground">{formatDate(uploadTimestamp)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-success" />
          <div>
            <p className="text-xs text-muted-foreground">Analysis Completed</p>
            <p className="text-sm font-medium text-foreground">{formatDate(analysisTimestamp)}</p>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground mt-3">
        Access logs are maintained for audit and security purposes.
      </p>
    </div>
  );
};

export default AccessLog;
