
-- Fix 1: Make uploads bucket private (path-based policies already exist)
UPDATE storage.buckets SET public = false WHERE id = 'uploads';

-- Fix 2: Add explicit auth requirement to profiles table for defense-in-depth
-- Using PERMISSIVE policy that requires auth, combined with existing restrictive policies
-- Note: existing policies are RESTRICTIVE, so we add a PERMISSIVE one requiring auth
CREATE POLICY "Require authentication for profiles"
ON public.profiles
FOR SELECT
TO public
USING (auth.uid() IS NOT NULL);
