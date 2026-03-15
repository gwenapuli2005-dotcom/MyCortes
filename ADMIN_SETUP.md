# Making admin@cortes.com an Admin Account

## Account Details
- **Email**: admin@cortes.com
- **UUID**: 76eb3736-f882-4b22-8b70-4b723decc713
- **Role**: admin (gives access to admin dashboard)

---

## How to Activate Admin Access

### Method 1: Using Supabase Dashboard (Easiest)

1. Go to https://app.supabase.com/
2. Select your **MyCortes** project
3. In the left sidebar, click **SQL Editor**
4. Click **New Query**
5. Copy and paste this SQL:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('76eb3736-f882-4b22-8b70-4b723decc713', 'admin')
   ON CONFLICT (user_id, role) DO NOTHING;
   ```
6. Click **Run** (or press Ctrl+Enter)
7. You should see: `Query executed successfully` and `1 row inserted`

### Verify It Worked
Run this query to confirm:
```sql
SELECT * FROM public.user_roles 
WHERE user_id = '76eb3736-f882-4b22-8b70-4b723decc713';
```

You should see one row with:
- user_id: `76eb3736-f882-4b22-8b70-4b723decc713`
- role: `admin`

---

## Method 2: Using Migration (For Next Deployment)

I've already updated the migration file:
- **File**: `supabase/migrations/20260308000000_create_admin_account.sql`

When you deploy next time, this will automatically add the admin role.

---

## Accessing the Admin Dashboard

Once the admin role is set:

1. **Sign out** from myCortes app
2. **Sign in** with:
   - Email: `admin@cortes.com`
   - Your password
3. You'll be automatically redirected to `/admin` dashboard
4. You'll see the admin sidebar with access to:
   - Dashboard
   - Requests Management
   - Users Management
   - Announcements
   - Posts
   - Tourist Spots
   - Feedback

---

## How Admin Access Works

The app checks for admin status in the `user_roles` table:
- When a user logs in → App checks if they have `role = 'admin'`
- If admin → Redirect to `/admin` dashboard
- If not admin → Show regular user dashboard

The check happens in: `src/hooks/useAuth.tsx` → `checkAdminRole()` function

---

## Adding More Admins in Future

To make any other user an admin, just run:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('their-uuid-here', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
```

You can find user UUIDs in the `auth.users` table in Supabase.

---

## Troubleshooting

### Admin can't access dashboard
1. Make sure the user has logged in at least once (to create their profile)
2. Check that the `user_roles` entry is correctly inserted
3. Clear browser cache and refresh
4. Try logging out and back in

### How to find a user's UUID
1. Go to Supabase Dashboard
2. Click **Authentication** → **Users**
3. Find the user by email
4. Their UUID is shown in the "User ID" column

### Remove admin access (if needed)
```sql
DELETE FROM public.user_roles 
WHERE user_id = '76eb3736-f882-4b22-8b70-4b723decc713' 
AND role = 'admin';
```
