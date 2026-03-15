-- Create admin accounts
INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('de93bf2f-a9fd-49e3-b6ba-6f4d69e7919d', 'admin'),
  ('76eb3736-f882-4b22-8b70-4b723decc713', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
