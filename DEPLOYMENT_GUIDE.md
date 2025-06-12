# LV Capital Partners - Complete Deployment Guide

## 🚀 Overview

This guide provides step-by-step instructions to deploy the LV Capital Partners real estate investment platform to production using Vercel, with external service integrations for Supabase, Clerk, Resend, and optional Google Analytics.

## 📋 Prerequisites

- GitHub account with the repository
- Vercel account (free tier sufficient)
- Supabase account (free tier sufficient)
- Clerk account (free tier sufficient)
- Resend account (free tier sufficient)
- Google Analytics account (optional)

## 🔧 Phase 1: Service Account Setup

### 1.1 Supabase Database Setup

**Step 1: Create Project**
1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Select your organization
4. Fill in project details:
   - **Name**: `lv-capital-partners-prod`
   - **Database Password**: Generate a strong password (save it securely)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
5. Click "Create new project"
6. Wait for setup to complete (2-3 minutes)

**Step 2: Get API Credentials**
1. In your Supabase dashboard, go to "Settings" → "API"
2. Copy and save these values:
   - **Project URL**: `https://[your-project-id].supabase.co`
   - **Anon (public) key**: Starts with `eyJhbGc...`
   - **Service role key**: Starts with `eyJhbGc...` (keep this secret!)

**Step 3: Configure Database**
1. Go to "SQL Editor" in Supabase dashboard
2. Run the migration files in order (copy-paste content):
   - `supabase/migrations/001_initial_schema.sql` - Database structure
   - `supabase/migrations/003_production_rls_policies.sql` - Security policies
   - `supabase/migrations/005_realistic_investment_data.sql` - Sample data
3. Verify tables were created in "Table Editor"

### 1.2 Clerk Authentication Setup

**Step 1: Create Application**
1. Go to https://dashboard.clerk.com
2. Click "Add application"
3. Choose application name: `LV Capital Partners`
4. Select authentication options:
   - ✅ Email address
   - ✅ Password
   - ✅ Phone number (optional)
   - ✅ Google OAuth (recommended)
   - ✅ LinkedIn OAuth (professional platform)
5. Click "Create application"

**Step 2: Get API Keys**
1. In Clerk dashboard, go to "API Keys"
2. Copy and save:
   - **Publishable key**: Starts with `pk_live_` or `pk_test_`
   - **Secret key**: Starts with `sk_live_` or `sk_test_`

**Step 3: Configure Authentication Settings**
1. Go to "User & Authentication" → "Email, Phone, Username"
2. Configure:
   - **Sign-up modes**: Email address (required)
   - **Sign-in modes**: Email address + Password
   - **Verification methods**: Email link
3. Go to "Customization" → "Appearance"
4. Set brand colors to match LV Capital Partners theme:
   - **Primary color**: `#1e40af` (blue)
   - **Background**: `#ffffff`

**Note**: Webhook setup will be done after Vercel deployment

### 1.3 Resend Email Setup

**Step 1: Create Account**
1. Go to https://resend.com/signup
2. Sign up with your business email
3. Verify your email address

**Step 2: Generate API Key**
1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name: `LV Capital Partners Production`
4. Permissions: "Send access"
5. Copy and save the API key (starts with `re_`)

**Step 3: Configure Domain (Recommended)**
1. Go to "Domains" → "Add Domain"
2. Enter your domain (e.g., `lvcp.com`)
3. Add DNS records as instructed:
   ```
   TXT record: @  resend._domainkey  [provided-key]
   ```
4. Verify domain (may take up to 48 hours)
5. Use `noreply@yourdomain.com` for from email

### 1.4 Google Analytics Setup (Optional)

**Step 1: Create Property**
1. Go to https://analytics.google.com
2. Click "Start measuring"
3. Create an account:
   - **Account name**: `LV Capital Partners`
   - **Property name**: `LV Capital Partners Website`
   - **Industry**: Financial Services
   - **Business size**: Small business
4. Set up data stream:
   - **Platform**: Web
   - **Website URL**: `https://your-project.vercel.app` (update later)
   - **Stream name**: `LV Capital Partners Main Site`

**Step 2: Get Measurement ID**
1. In property settings, go to "Data Streams"
2. Click on your web stream
3. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

## 🚀 Phase 2: Vercel Deployment

### 2.1 Repository Import

**Step 1: Connect GitHub**
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Choose "Import Git Repository"
4. Select your GitHub account
5. Find and import `lv-capital-partners` repository
6. Click "Import"

**Step 2: Configure Project**
1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `./` (default)
3. **Build and Development Settings**: Use defaults
4. **Environment Variables**: Skip for now (next step)

### 2.2 Environment Variables Configuration

**Step 1: Generate Security Keys**
Run this command locally to generate secure keys:
```bash
cd lv-capital-partners
node scripts/generate-env-keys.js
```

**Step 2: Add Environment Variables**
In Vercel dashboard → Your Project → "Settings" → "Environment Variables"

Add each variable for **Production**, **Preview**, and **Development**:

**Authentication (Clerk)**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_key
CLERK_SECRET_KEY=sk_live_your_actual_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

**Database (Supabase)**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Email (Resend)**
```
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**Application Settings**
```
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_API_URL=https://your-project.vercel.app/api
NODE_ENV=production
```

**Security Keys** (from generated keys)
```
NEXTAUTH_SECRET=your_generated_secret
ENCRYPTION_KEY=your_generated_key
JWT_SECRET=your_generated_jwt_secret
HASH_SALT=your_generated_salt
```

**Analytics (Optional)**
```
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

### 2.3 Deploy Application

**Step 1: Initial Deployment**
1. Click "Deploy" in Vercel dashboard
2. Wait for build to complete (3-5 minutes)
3. Note your deployment URL: `https://your-project.vercel.app`

**Step 2: Verify Deployment**
1. Visit your deployment URL
2. Check that homepage loads correctly
3. Verify no console errors in browser developer tools

## 🔗 Phase 3: Post-Deployment Configuration

### 3.1 Clerk Webhook Setup

**Step 1: Configure Webhook**
1. Go back to Clerk dashboard
2. Navigate to "Webhooks"
3. Click "Add Endpoint"
4. **Endpoint URL**: `https://your-project.vercel.app/api/webhooks/clerk`
5. **Events to listen for**:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
6. Click "Create"

**Step 2: Add Webhook Secret**
1. Copy the signing secret from webhook configuration
2. Go to Vercel → Environment Variables
3. Add: `CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret`
4. Redeploy the application

### 3.2 Update URLs

**Step 1: Update Application URLs**
1. In Vercel environment variables, update:
   ```
   NEXT_PUBLIC_APP_URL=https://your-actual-domain.vercel.app
   NEXT_PUBLIC_API_URL=https://your-actual-domain.vercel.app/api
   ```

**Step 2: Update Google Analytics (if configured)**
1. Go to Google Analytics → Data Streams
2. Update website URL to your actual deployment URL

## ✅ Phase 4: Testing & Verification

### 4.1 Authentication Testing

**Test Sign-Up Flow**
1. Go to `/sign-up`
2. Create a new account with email
3. Verify email verification works
4. Check user appears in Clerk dashboard
5. Verify user data syncs to Supabase

**Test Sign-In Flow**
1. Sign out and go to `/sign-in`
2. Sign in with created account
3. Verify redirect to dashboard
4. Check session persistence

### 4.2 Dashboard Testing

**Portfolio Features**
1. Verify portfolio overview displays
2. Check investment charts render
3. Test dark/light theme toggle
4. Verify mobile responsiveness

**Data Functionality**
1. Test PDF export features
2. Verify contact forms submit
3. Check email notifications send
4. Test investment interest forms

### 4.3 Investment Features

**Opportunities Page**
1. Visit `/opportunities`
2. Verify investment listings display
3. Test filtering and sorting
4. Check individual opportunity details

**Contact Forms**
1. Submit interest form
2. Verify email received via Resend
3. Check form data saved to database
4. Test validation errors

## 🛠️ Troubleshooting Guide

### Build Errors

**TypeScript Errors**
```bash
# Fix locally first
bun run lint
bun run build
```

**Environment Variable Issues**
- Ensure all required variables are set
- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables

### Runtime Errors

**Authentication Issues**
- Verify Clerk keys are production keys (`pk_live_`, `sk_live_`)
- Check webhook URL is correct
- Ensure webhook events are subscribed

**Database Connection Issues**
- Verify Supabase URL and keys
- Check database tables exist
- Ensure RLS policies are enabled

**Email Issues**
- Verify Resend API key
- Check domain verification status
- Test with simple email first

## 📊 Success Criteria

✅ **Deployment is successful when:**
- [ ] Website loads at production URL
- [ ] Users can sign up and sign in
- [ ] Dashboard displays portfolio data
- [ ] All forms and interactions work
- [ ] No console errors
- [ ] Mobile version works properly
- [ ] Email notifications send correctly
- [ ] Performance is acceptable (< 3s load time)

## 🎯 Next Steps

### Immediate
1. Test all functionality thoroughly
2. Monitor error logs for first 24 hours
3. Backup database schema and data

### Short-term (1-2 weeks)
1. Add real investment data
2. Configure SEO meta tags
3. Set up monitoring and alerts

---

🎉 **Congratulations! Your LV Capital Partners platform is now live in production!**