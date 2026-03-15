# OAuth Google Setup - Complete Verification & Troubleshooting Guide

## Problem
Getting 404 error when clicking "Continue with Google" despite completing Supabase and Google Cloud setup.

## Root Cause Analysis
The 404 error typically indicates one of these issues:
1. **Redirect URI Mismatch** - Google Cloud, Supabase, and your app are using different redirect URLs
2. **Missing OAuth Configuration** - Google Client ID or Secret not properly configured in Supabase
3. **URL Misconfiguration** - Using wrong domain or port number
4. **Cache Issues** - Old credentials cached in browser

---

## ✅ Complete Setup Verification

### Step 1: Determine Your Application URL
```
Local Development:     http://localhost:8080
Staging:              https://staging-domain.com
Production:           https://your-domain.com
```

**Important**: Replace all instances with YOUR actual URL.

---

### Step 2: Google Cloud Console Configuration

Go to: https://console.cloud.google.com/

#### 2a. Enable APIs
1. In search box, type "Google+ API"
2. Click on **Google+ API** 
3. Click **ENABLE**
   
#### 2b. Create/Configure OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth 2.0 Client ID** (if you don't have one)
3. Select **Application type: Web application**
4. Under **Authorized redirect URIs**, click **Add URI**, then add BOTH:
   ```
   http://localhost:8080/auth
   https://your-domain.com/auth
   ```
5. **Save** and copy your:
   - **Client ID** (save this)
   - **Client Secret** (save this)

#### 2c. Configure OAuth Consent Screen
1. Go to **OAuth consent screen**
2. Set **User type: External**
3. Fill in your app details
4. Add yourself as a test user if needed
5. Save

---

### Step 3: Supabase Configuration

Go to: https://app.supabase.com/

#### 3a. Add Google Provider Credentials
1. Select your **Project**
2. Go to **Authentication** (🔑 icon in sidebar)
3. Select **Providers**
4. Find **Google** and click to expand
5. **Enable** the Google provider
6. Paste your **Google Client ID** (from Step 2b)
7. Paste your **Google Client Secret** (from Step 2b)
8. Click **Save**

#### 3b. Verify Redirect URL
1. Still on the Providers page
2. At the top, you'll see: **Redirect URLs**
3. Copy the URL shown there (should be `https://your-project.supabase.co/auth/v1/callback`)
4. Go back to **Google Cloud Console** → **Credentials**
5. Edit your OAuth Client
6. Add this Supabase callback URL to **Authorized redirect URIs**:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```

---

### Step 4: Environment Variables

Check your `.env.local` file:

```env
# Get these from Supabase Project Settings → API
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...your-key...
```

---

### Step 5: Restart Development Server

```bash
# Stop the server (press Ctrl+C)
# Wait a moment, then restart:
npm run dev
```

Clear your browser cache and try again.

---

## 🔍 Verification Checklist

- [ ] Google Cloud OAuth 2.0 Client ID created
- [ ] Google Cloud Authorized Redirect URIs include:
  - [ ] `http://localhost:8080/auth`
  - [ ] `https://your-project.supabase.co/auth/v1/callback`
  - [ ] `https://your-domain.com/auth` (if production)
- [ ] Supabase Google Provider is **ENABLED**
- [ ] Google Client ID pasted in Supabase
- [ ] Google Client Secret pasted in Supabase
- [ ] Environment variables `.env.local` are correct
- [ ] Development server restarted
- [ ] Browser cache cleared

---

## 🐛 Troubleshooting If Still Getting 404

### Method 1: Browser DevTools Inspection
1. Open DevTools (**F12**)
2. Go to **Network** tab
3. Click "Continue with Google"
4. Look for requests to `accounts.google.com`
5. Check if you see a successful redirect or an error
6. Look for any error messages in **Console** tab

### Method 2: Check Exact Error
1. Open **Console** tab in DevTools
2. Click "Continue with Google"
3. Copy any red error messages
4. Common errors:
   - `redirect_uri mismatch` → URLs don't match
   - `invalid_client` → Wrong Client ID/Secret
   - `access_denied` → You rejected permissions

### Method 3: Verify Supabase OAuth Redirect URIs
1. Go to https://app.supabase.com/
2. Select your project
3. Authentication → Providers
4. Look at the top - you'll see your redirect URIs
5. Screenshot these and compare with what you configured in Google Cloud

### Method 4: Hard Reset
```bash
# Clear everything and restart
rm -rf node_modules
npm install
npm run dev
```
Then clear browser cache and try again.

---

## 🔧 Common Scenarios & Solutions

### Scenario: "Error: Failed to fetch"
- Likely CORS issue or network problem
- Check browser console for full error
- Verify domain is correct

### Scenario: "invalid_client"
- Client ID or Secret is wrong
- Double-check values in Google Cloud and Supabase match exactly
- No extra spaces

### Scenario: "redirect_uri_mismatch"
- The URL you're redirecting to doesn't match Google Cloud settings
- URLS must match EXACTLY (including protocol, domain, path)
- Check for typos

### Scenario: Gets to `/auth` but shows "Page not found"
- React Router might not be configured correctly
- This is handled in the updated app
- Clear browser cache and restart dev server

---

## 📋 Updated Code Changes Made

The app code has been updated to:
1. Use Supabase's native OAuth method (more reliable)
2. Better error handling with specific messages
3. OAuth callback parameter detection
4. Improved logging for debugging

These updates are in:
- `src/hooks/useAuth.tsx` - OAuth method
- `src/pages/Auth.tsx` - Error handling & callback detection

---

## ⚠️ Still Having Issues?

If you've gone through all steps and still have issues:

1. **Take a screenshot** of:
   - Google Cloud OAuth 2.0 Client Settings (redirect URIs section)
   - Supabase Google Provider Settings (showing Client ID, Client Secret fields)
   - Your `.env.local` file
   - DevTools Console error message

2. **Provide**:
   - Your actual domain/URL you're testing with
   - The exact error message from DevTools
   - Screenshot of Supabase Redirect URLs

3. **We can then**:
   - Implement custom OAuth callback handler
   - Create auth debugging utilities
   - Set up proper error logging

---

## 📚 Useful Links

- [Supabase Google OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Cloud OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Authentication Docs](https://supabase.com/docs/guides/auth)
