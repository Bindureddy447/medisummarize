import { useState, useCallback } from 'react';
import { Upload, FileText, File, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DocumentUploaderProps {
  onDocumentSubmit: (text: string) => void;
  isProcessing: boolean;
}

const DocumentUploader = ({ onDocumentSubmit, isProcessing }: DocumentUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [inputMode, setInputMode] = useState<'upload' | 'text'>('upload');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/plain' || file.type === 'application/pdf')) {
      handleFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    setUploadedFile(file);
    
    if (file.type === 'text/plain') {
      const text = await file.text();
      setTextContent(text);
    } else if (file.type === 'application/pdf') {
      // For PDF, we'll show a message that PDF parsing would happen server-side
      setTextContent(`[PDF File: ${file.name}]\n\nPDF content extraction would be handled by the backend. For demo purposes, please use a text file or paste content directly.`);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setTextContent('');
  };

  const handleSubmit = () => {
    if (textContent.trim()) {
      onDocumentSubmit(textContent);
    }
  };

  return (
    <div className="medical-card">
      <div className="flex items-center gap-2 mb-4">
        <div className="section-badge">
          <Upload className="h-3 w-3" />
          Upload Document
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant={inputMode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setInputMode('upload')}
        >
          <FileText className="h-4 w-4 mr-1" />
          Upload File
        </Button>
        <Button
          variant={inputMode === 'text' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setInputMode('text')}
        >
          <File className="h-4 w-4 mr-1" />
          Paste Text
        </Button>
      </div>

      {inputMode === 'upload' ? (
        <div
          className={cn(
            'upload-zone cursor-pointer',
            isDragging && 'dragging'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".txt,.pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {uploadedFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-foreground font-medium mb-1">
                Drag and drop your document here
              </p>
              <p className="text-sm text-muted-foreground">
                Supports TXT and PDF formats
              </p>
            </>
          )}
        </div>
      ) : (
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder="Paste your clinical document text here...

Example: Discharge summaries, radiology reports, lab results, consultation notes, etc."
          className="w-full h-48 p-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      )}

      <div className="mt-4 flex justify-end">
        <Button
          variant="medical"
          size="lg"
          onClick={handleSubmit}
          disabled={!textContent.trim() || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4" />
              Generate Summary
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploader;
