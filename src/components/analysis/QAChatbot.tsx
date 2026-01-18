import { useState } from 'react';
import { MessageCircle, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface QAChatbotProps {
  documentText: string;
}

const SUGGESTED_QUESTIONS = [
  "What medicines were prescribed?",
  "What is the diagnosis?",
  "What are the follow-up instructions?",
  "What tests were performed?",
  "What is the patient's condition?"
];

const QAChatbot = ({ documentText }: QAChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const askQuestion = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-document', {
        body: { 
          documentText,
          questionQuery: question
        }
      });

      if (error) throw error;

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.answer || "I couldn't find an answer to that question in the document."
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Q&A error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Sorry, I encountered an error processing your question. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="medical-card">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Document Q&A Assistant</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Ask questions about the document and get answers based on its content.
      </p>

      {messages.length === 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-1.5"
                onClick={() => askQuestion(q)}
                disabled={isLoading}
              >
                {q}
              </Button>
            ))}
          </div>
        </div>
      )}

      {messages.length > 0 && (
        <ScrollArea className="h-64 mb-4 rounded-lg border border-border/50 bg-secondary/20 p-3">
          <div className="space-y-3">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={cn(
                  'flex items-start gap-2',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className={cn(
                  'rounded-lg px-3 py-2 max-w-[80%]',
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-foreground'
                )}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-secondary rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the document..."
          onKeyDown={(e) => e.key === 'Enter' && askQuestion(input)}
          disabled={isLoading}
          className="flex-1"
        />
        <Button 
          onClick={() => askQuestion(input)} 
          disabled={isLoading || !input.trim()}
          size="icon"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default QAChatbot;
