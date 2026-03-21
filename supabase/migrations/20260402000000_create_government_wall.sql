-- Create government wall images table
CREATE TABLE IF NOT EXISTS public.government_wall_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.government_wall_images ENABLE ROW LEVEL SECURITY;

-- Allow public to view government wall images
CREATE POLICY "Anyone can view government wall images"
  ON public.government_wall_images FOR SELECT
  USING (true);

-- Allow admins to manage government wall images
CREATE POLICY "Admins can manage government wall images"
  ON public.government_wall_images FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  ));
