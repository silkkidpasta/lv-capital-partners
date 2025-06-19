# LV Capital Partners - Service Account Setup Guide

## 🎯 Overview

This guide provides detailed, step-by-step instructions for setting up all external service accounts required for the LV Capital Partners platform. Follow each section carefully to ensure proper configuration.

## 📋 Prerequisites

- Business email address for service registrations
- Access to domain DNS settings (if using custom domain)
- Credit card for identity verification (most services are free tier)
- Notepad or password manager to store credentials securely

## 1️⃣ Supabase Database Setup

### Step 1: Create Supabase Account

1. **Visit Supabase**
   - Go to https://supabase.com
   - Click "Start your project" or "Sign up"

2. **Sign Up Process**
   - Choose "Sign up with GitHub" (recommended) or email
   - If using email: Enter business email and create password
   - Verify email address if prompted

3. **Create Organization**
   - Organization name: `LV Capital Partners` or your company name
   - Choose free tier to start

### Step 2: Create Production Project

1. **New Project Setup**
   - Click "New Project" in dashboard
   - **Project name**: `lv-capital-partners-prod`
   - **Database password**: Generate strong password (save securely!)
   - **Region**: Choose closest to your target users:
     - `us-east-1` for East Coast US
     - `us-west-1` for West Coast US
     - `eu-west-1` for Europe
     - `ap-southeast-1` for Asia Pacific

2. **Wait for Initialization**
   - Project creation takes 2-3 minutes
   - You'll see a progress indicator
   - Don't navigate away during this process

### Step 3: Get API Credentials

1. **Access Project Settings**
   - In your project dashboard, click "Settings" (gear icon)
   - Navigate to "API" section

2. **Copy Essential Credentials**
   ```
   Project URL: https://[your-project-id].supabase.co
   Anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   Service role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Save Credentials Securely**
   - Store in password manager or secure note
   - Never share service role key publicly
   - The anon key is safe for frontend use

### Step 4: Configure Database Security

1. **Enable Row Level Security**
   - Go to "Authentication" → "Policies"
   - Ensure RLS is enabled (will be set up during migration)

2. **Configure Authentication Settings**
   - Go to "Authentication" → "Settings"
   - **Site URL**: `https://your-project.vercel.app` (update after deployment)
   - **Redirect URLs**: Add your deployment URLs
   - **JWT expiry**: 3600 seconds (1 hour)

---

## 2️⃣ Clerk Authentication Setup

### Step 1: Create Clerk Account

1. **Visit Clerk Dashboard**
   - Go to https://dashboard.clerk.com
   - Click "Sign up" or "Get started"

2. **Account Registration**
   - Use business email address
   - Create secure password
   - Verify email if prompted

### Step 2: Create Application

1. **New Application Setup**
   - Click "Add application" or "Create Application"
   - **Application name**: `LV Capital Partners`
   - **Application type**: `Regular web application`

2. **Authentication Methods**
   Select authentication options:
   - ✅ **Email address** (required)
   - ✅ **Password** (required)
   - ✅ **Google** (recommended for easier sign-up)
   - ✅ **Phone number** (optional, good for security)
   - ⚠️ **LinkedIn** (optional, professional platform)

3. **Framework Selection**
   - Choose "Next.js"
   - This optimizes the setup for your tech stack

### Step 3: Configure Authentication Settings

1. **Sign-up/Sign-in Configuration**
   - Go to "User & Authentication" → "Email, Phone, Username"
   - **Sign-up modes**: Email address (enable)
   - **Sign-in modes**: Email address + Password
   - **Username**: Optional (disable for simpler flow)
   - **Phone number**: Optional (enable if desired)

2. **Email Verification**
   - Go to "User & Authentication" → "Email, Phone, Username"
   - **Email verification**: Enable email link verification
   - **Email verification strategy**: Email link (recommended)

3. **Security Settings**
   - Go to "User & Authentication" → "Attack Protection"
   - **Enable bot protection**: Yes
   - **Rate limiting**: Enable (protects against attacks)

### Step 4: Customize Appearance

1. **Brand Configuration**
   - Go to "Customization" → "Appearance"
   - **Logo**: Upload your company logo (recommended: 256x256px)
   - **Primary color**: `#1e40af` (blue to match theme)
   - **Background color**: `#ffffff`
   - **Text color**: `#000000`

2. **Theme Settings**
   - **Light theme**: Configure colors to match your brand
   - **Dark theme**: Ensure good contrast
   - **Font**: Use system fonts for best performance

### Step 5: Get API Keys

1. **Access API Keys**
   - Go to "API Keys" in left sidebar
   - You'll see two types of keys

2. **Copy Production Keys**
   ```
   Publishable key: pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   Secret key: sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Key Usage Notes**
   - **Publishable key**: Safe for frontend, starts with `pk_live_`
   - **Secret key**: Server-side only, starts with `sk_live_`
   - For development, use `pk_test_` and `sk_test_` keys

### Step 6: Configure Domain Settings

1. **Allowed Origins** (configure after deployment)
   - Go to "Domains"
   - Add your production domain: `https://your-project.vercel.app`
   - Add development domain: `http://localhost:3000`

---

## 3️⃣ Resend Email Service Setup

### Step 1: Create Resend Account

1. **Visit Resend**
   - Go to https://resend.com
   - Click "Sign up"

2. **Account Registration**
   - **Email**: Use business email
   - **Password**: Create secure password
   - **Name**: Your full name
   - **Company**: LV Capital Partners

3. **Email Verification**
   - Check inbox for verification email
   - Click verification link
   - Complete account setup

### Step 2: Generate API Key

1. **Access API Keys**
   - In Resend dashboard, go to "API Keys"
   - Click "Create API Key"

2. **Configure API Key**
   - **Name**: `LV Capital Partners Production`
   - **Permissions**: "Send access" (default)
   - **Domain**: Select "All domains" or specific domain

3. **Save API Key**
   ```
   API Key: re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   - Copy immediately (won't be shown again)
   - Store securely in password manager

### Step 3: Domain Configuration (Recommended)

1. **Add Custom Domain**
   - Go to "Domains" → "Add Domain"
   - **Domain**: `yourdomain.com` (without www)
   - Click "Add Domain"

2. **DNS Configuration**
   You'll need to add DNS records to your domain:
   ```dns
   Type: TXT
   Name: @
   Value: resend._domainkey.yourdomain.com
   ```

3. **DNS Record Setup**
   - Log into your domain registrar (GoDaddy, Namecheap, etc.)
   - Go to DNS management
   - Add the TXT record provided by Resend
   - Save changes

4. **Verify Domain**
   - Return to Resend dashboard
   - Click "Verify" next to your domain
   - Verification may take up to 48 hours
   - Status will change to "Verified" when complete

### Step 4: Email Configuration

1. **From Email Address**
   - **With verified domain**: `noreply@yourdomain.com`
   - **Without verified domain**: `onboarding@resend.dev` (temporary)

2. **Email Templates** (optional)
   - Consider setting up templates for:
     - Welcome emails
     - Password reset emails
     - Investment notifications

---

## 4️⃣ Google Analytics Setup (Optional)

### Step 1: Google Analytics Account

1. **Access Google Analytics**
   - Go to https://analytics.google.com
   - Sign in with Google account (or create one)

2. **Create Account**
   - Click "Start measuring"
   - **Account name**: `LV Capital Partners`
   - **Data sharing settings**: Choose preferences
   - **Country**: Select your business location

### Step 2: Create Property

1. **Property Setup**
   - **Property name**: `LV Capital Partners Website`
   - **Time zone**: Your business time zone
   - **Currency**: USD (or your local currency)

2. **Business Information**
   - **Industry category**: "Finance and Insurance"
   - **Business size**: Select appropriate size
   - **Usage intentions**:
     - ✅ Analyze user behavior
     - ✅ Measure advertising effectiveness
     - ✅ Improve user experience

### Step 3: Set Up Data Stream

1. **Create Web Stream**
   - **Platform**: Web
   - **Website URL**: `https://your-project.vercel.app` (update after deployment)
   - **Stream name**: `LV Capital Partners Main Site`

2. **Enhanced Measurement**
   - Enable all recommended options:
     - ✅ Page views
     - ✅ Scrolls
     - ✅ Outbound clicks
     - ✅ Site search
     - ✅ File downloads

### Step 4: Get Measurement ID

1. **Copy Measurement ID**
   - In Data Streams, click your web stream
   - Copy the **Measurement ID**: `G-XXXXXXXXXX`
   - Save this for environment variables

2. **Configure Goals** (optional)
   - Set up conversions for:
     - User registrations
     - Investment interest submissions
     - Contact form submissions

---

## 5️⃣ Additional Service Setup (Optional)

### Stripe for Payments (Future Feature)

1. **Create Stripe Account**
   - Go to https://stripe.com
   - **Business type**: Corporation/LLC
   - **Business category**: Financial services
   - Complete business verification

2. **Get API Keys**
   - Dashboard → "Developers" → "API keys"
   - Copy publishable and secret keys
   - Use test keys for development

### Sentry for Error Tracking (Recommended)

1. **Create Sentry Account**
   - Go to https://sentry.io
   - Create account with business email

2. **Create Project**
   - **Platform**: Next.js
   - **Project name**: `lv-capital-partners`
   - Copy DSN for environment variables

---

## 🔐 Security Best Practices

### API Key Management

1. **Secure Storage**
   - Use password manager for all credentials
   - Never commit API keys to version control
   - Use different keys for each environment

2. **Access Control**
   - Limit API key permissions to minimum required
   - Regularly rotate keys (quarterly recommended)
   - Monitor usage for anomalies

3. **Environment Separation**
   - Use test/development keys for non-production
   - Use live/production keys only for production
   - Keep staging environment credentials separate

### Account Security

1. **Strong Passwords**
   - Use unique passwords for each service
   - Enable 2FA where available
   - Use business email for all accounts

2. **Access Monitoring**
   - Regularly review account access logs
   - Set up alerts for suspicious activity
   - Remove unused team member access

---

## 📝 Credentials Checklist

After completing all setups, you should have:

### Supabase
- [ ] Project URL
- [ ] Anon public key
- [ ] Service role key
- [ ] Database password (stored securely)

### Clerk
- [ ] Publishable key (pk_live_...)
- [ ] Secret key (sk_live_...)
- [ ] Application configured
- [ ] Authentication methods enabled

### Resend
- [ ] API key (re_...)
- [ ] From email address configured
- [ ] Domain verified (or using resend.dev)

### Google Analytics (Optional)
- [ ] Measurement ID (G-XXXXXXXXXX)
- [ ] Property configured
- [ ] Enhanced measurement enabled

### Security Keys
- [ ] Generated via: `node scripts/generate-env-keys.js`
- [ ] Unique for production environment
- [ ] Stored securely

---

## 🚀 Next Steps

1. **Save All Credentials**
   - Store securely in password manager
   - Document which keys are for which environment
   - Share securely with team members if needed

2. **Proceed to Deployment**
   - Follow the main deployment guide
   - Add all credentials to Vercel environment variables
   - Test each service integration

3. **Post-Deployment Configuration**
   - Update Clerk webhook URLs
   - Update Google Analytics site URL
   - Verify all services are working

---

## 📞 Support Resources

**Service Documentation:**
- [Supabase Docs](https://supabase.com/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Resend Docs](https://resend.com/docs)
- [Google Analytics Help](https://support.google.com/analytics)

**Community Support:**
- Supabase Discord
- Clerk Discord
- GitHub Issues for project-specific problems

**Business Support:**
- Upgrade to paid plans for priority support
- Consider professional implementation services

---

*Complete this service setup before proceeding with the Vercel deployment. Having all credentials ready will make the deployment process much smoother.*