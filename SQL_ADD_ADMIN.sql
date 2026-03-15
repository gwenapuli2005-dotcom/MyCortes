-- Run this SQL in Supabase Dashboard to make admin@cortes.com an admin
-- Go to: SQL Editor in Supabase → Execute this query

-- Add admin role for the specified user UUID
INSERT INTO public.user_roles (user_id, role)
VALUES ('76eb3736-f882-4b22-8b70-4b723decc713', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify it was added:
SELECT * FROM public.user_roles 
WHERE user_id = '76eb3736-f882-4b22-8b70-4b723decc713';
