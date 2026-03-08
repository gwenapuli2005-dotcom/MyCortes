-- Create admin account for admin@cortes.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('de93bf2f-a9fd-49e3-b6ba-6f4d69e7919d', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
