
-- Drop the overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view uploads" ON storage.objects;

-- Create path-based policies:
-- 1. Public content (tourist spots, announcements) remains publicly viewable
CREATE POLICY "Public content is viewable by anyone"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'uploads' AND (
    (storage.foldername(name))[1] = 'tourist-spots' OR
    (storage.foldername(name))[1] = 'announcement-images'
  )
);

-- 2. Service request photos only viewable by authenticated users
CREATE POLICY "Authenticated users can view service request uploads"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'uploads' AND
  (storage.foldername(name))[1] = 'service-requests' AND
  auth.uid() IS NOT NULL
);
