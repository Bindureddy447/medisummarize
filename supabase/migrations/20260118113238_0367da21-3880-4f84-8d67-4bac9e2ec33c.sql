-- Create document access logs table for audit purposes
CREATE TABLE public.document_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_title TEXT,
  document_type TEXT,
  action TEXT NOT NULL DEFAULT 'upload',
  upload_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  summary_generated_timestamp TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.document_access_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own logs
CREATE POLICY "Users can view own access logs" 
ON public.document_access_logs 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own logs
CREATE POLICY "Users can insert own access logs" 
ON public.document_access_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow anonymous logs for non-authenticated users (demo purposes)
CREATE POLICY "Allow anonymous access logs" 
ON public.document_access_logs 
FOR INSERT 
WITH CHECK (user_id IS NULL);

CREATE POLICY "Anonymous can view anonymous logs" 
ON public.document_access_logs 
FOR SELECT 
USING (user_id IS NULL);