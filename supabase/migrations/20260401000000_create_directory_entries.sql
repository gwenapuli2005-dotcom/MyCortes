-- Create directory entries table for offices and programs
CREATE TABLE IF NOT EXISTS public.directory_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_type TEXT NOT NULL CHECK (entry_type IN ('office', 'program')),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.directory_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active directory entries"
  ON public.directory_entries FOR SELECT
  USING (is_active = true);

-- Seed example data (safe idempotent insert)
INSERT INTO public.directory_entries (entry_type, name, description, address, phone)
SELECT 'office', 'Municipal Office', 'Main municipal office for citizen service and permits', 'Brgy. 1, Cortes', '0921-000-111'
WHERE NOT EXISTS (SELECT 1 FROM public.directory_entries WHERE entry_type = 'office' AND name = 'Municipal Office');

INSERT INTO public.directory_entries (entry_type, name, description, address, phone)
SELECT 'office', 'Health Office', 'Health office for medical assistance and community care', 'Brgy. 2, Cortes', '0921-000-222'
WHERE NOT EXISTS (SELECT 1 FROM public.directory_entries WHERE entry_type = 'office' AND name = 'Health Office');

INSERT INTO public.directory_entries (entry_type, name, description, address, phone)
SELECT 'office', 'Environment Office', 'Environment office for waste management and green programs', 'Brgy. 3, Cortes', '0921-000-333'
WHERE NOT EXISTS (SELECT 1 FROM public.directory_entries WHERE entry_type = 'office' AND name = 'Environment Office');

INSERT INTO public.directory_entries (entry_type, name, description)
SELECT 'program', 'Community Livelihood Program', 'Livelihood grants and training for local families and entrepreneurs'
WHERE NOT EXISTS (SELECT 1 FROM public.directory_entries WHERE entry_type = 'program' AND name = 'Community Livelihood Program');

INSERT INTO public.directory_entries (entry_type, name, description)
SELECT 'program', 'Youth Empowerment Program', 'Skills development and leadership for youth'
WHERE NOT EXISTS (SELECT 1 FROM public.directory_entries WHERE entry_type = 'program' AND name = 'Youth Empowerment Program');

INSERT INTO public.directory_entries (entry_type, name, description)
SELECT 'program', 'Agricultural Support Program', 'Farmers support, workshops, and farming input distribution'
WHERE NOT EXISTS (SELECT 1 FROM public.directory_entries WHERE entry_type = 'program' AND name = 'Agricultural Support Program');