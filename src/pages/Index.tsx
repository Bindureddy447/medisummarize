import { useState } from 'react';
import { Sparkles, Shield, Zap, Brain } from 'lucide-react';
import Header from '@/components/Header';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import DocumentUploader from '@/components/DocumentUploader';
import SampleDocuments from '@/components/SampleDocuments';
import EnhancedResults from '@/components/EnhancedResults';
import { useDocumentAnalysis } from '@/hooks/useDocumentAnalysis';

const Index = () => {
  const { isProcessing, analysisResult, uploadTimestamp, analyze, reset } = useDocumentAnalysis();
  const [documentText, setDocumentText] = useState('');

  const handleDocumentSubmit = (text: string) => {
    setDocumentText(text);
    analyze(text);
  };

  const handleReset = () => {
    setDocumentText('');
    reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-12">
        {/* Hero Section */}
        <section className="text-center mb-14 fade-in">
          <div className="inline-flex items-center gap-2 section-badge mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI-Powered NLP Analysis</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-semibold text-foreground mb-6 tracking-tight">
            Clinical Document{' '}
            <span className="gradient-text">Summarization</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Advanced NLP-powered medical record assistant with severity detection, 
            term highlighting, timeline extraction, and interactive Q&A.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full text-sm text-muted-foreground">
              <Brain className="h-4 w-4 text-primary" />
              <span>12 AI Add-ons</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full text-sm text-muted-foreground">
              <Zap className="h-4 w-4 text-warning" />
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-success" />
              <span>Privacy-First</span>
            </div>
          </div>
        </section>

        <DisclaimerBanner />

        {analysisResult ? (
          <EnhancedResults 
            analysis={analysisResult} 
            documentText={documentText}
            uploadTimestamp={uploadTimestamp}
            onReset={handleReset} 
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 slide-up">
            <DocumentUploader onDocumentSubmit={handleDocumentSubmit} isProcessing={isProcessing} />
            <SampleDocuments onSelectDocument={handleDocumentSubmit} isProcessing={isProcessing} />
          </div>
        )}

        {/* Footer */}
        <footer className="py-12 mt-12 border-t border-border">
          <div className="text-center space-y-4">
            <p className="text-base font-medium text-foreground">
              <span className="font-serif">MedDoc</span><span className="text-primary font-serif">AI</span>
              <span className="text-muted-foreground font-normal ml-2">— B.Tech Final Year Project</span>
            </p>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Clinical Document Summarization & Medical Record Assistant using NLP. 
              Educational demonstration only - not for clinical use.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
