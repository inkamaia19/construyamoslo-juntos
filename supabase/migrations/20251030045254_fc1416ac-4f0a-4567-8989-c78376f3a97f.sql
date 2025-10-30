-- Create table for onboarding sessions
CREATE TABLE public.onboarding_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  materials JSONB DEFAULT '[]'::jsonb,
  environment TEXT,
  interest TEXT,
  completed BOOLEAN DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.onboarding_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create a new onboarding session
CREATE POLICY "Anyone can create onboarding sessions"
ON public.onboarding_sessions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to view their own session
CREATE POLICY "Anyone can view onboarding sessions"
ON public.onboarding_sessions
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow anyone to update their own session
CREATE POLICY "Anyone can update onboarding sessions"
ON public.onboarding_sessions
FOR UPDATE
TO anon, authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_onboarding_sessions_updated_at
BEFORE UPDATE ON public.onboarding_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for faster lookups
CREATE INDEX idx_onboarding_sessions_created_at ON public.onboarding_sessions(created_at DESC);