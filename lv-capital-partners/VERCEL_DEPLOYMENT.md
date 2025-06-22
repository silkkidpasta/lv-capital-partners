# Deploy LV Capital Partners to Vercel

This guide will help you deploy the LV Capital Partners application to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A GitHub account with the project repository
3. All required environment variables and API keys

## Quick Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure Environment Variables**
   In the Vercel dashboard, add these environment variables:

   **Authentication (Clerk)**
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_key_here
   CLERK_SECRET_KEY=sk_live_your_key_here
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

   **Database (Supabase)**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

   **Email (Resend)**
   ```
   RESEND_API_KEY=re_your_api_key_here
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```

   **Analytics (Google Analytics)**
   ```
   NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
   ```

   **Application URLs**
   ```
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
   ```

   **Security Keys** (generate random strings)
   ```
   NEXTAUTH_SECRET=your_nextauth_secret_32_chars
   ENCRYPTION_KEY=your_encryption_key_32_chars
   JWT_SECRET=your_jwt_secret_32_chars
   HASH_SALT=your_hash_salt_16_chars
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   cd lv-capital-partners
   vercel
   ```

4. **Configure Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   vercel env add CLERK_SECRET_KEY
   # ... add all other environment variables
   ```

5. **Redeploy with Environment Variables**
   ```bash
   vercel --prod
   ```

## Environment Variables Setup

### 1. Clerk (Authentication)

1. Go to https://dashboard.clerk.com
2. Create a new application or select existing
3. Get your keys from "API Keys" section:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your publishable key
   - `CLERK_SECRET_KEY`: Your secret key
4. Set up webhooks:
   - Go to "Webhooks" in Clerk dashboard
   - Add endpoint: `https://your-domain.vercel.app/api/webhooks/clerk`
   - Subscribe to: `user.created`, `user.updated`, `user.deleted`
   - Copy the signing secret to `CLERK_WEBHOOK_SECRET`

### 2. Supabase (Database)

1. Go to https://supabase.com/dashboard
2. Create a new project or select existing
3. Go to "Settings" → "API"
4. Copy the values:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (keep secret!)

### 3. Resend (Email)

1. Go to https://resend.com/dashboard
2. Create API key in "API Keys" section
3. Set up domain (optional but recommended):
   - Go to "Domains" → "Add Domain"
   - Add your domain and verify DNS records
   - Use `noreply@yourdomain.com` for `RESEND_FROM_EMAIL`

### 4. Google Analytics (Optional)

1. Go to https://analytics.google.com
2. Create a GA4 property
3. Copy the Measurement ID (G-XXXXXXXXXX)
4. Set as `NEXT_PUBLIC_GA_TRACKING_ID`

## Post-Deployment Setup

### 1. Database Setup

After deployment, you need to set up your Supabase database:

1. Go to your Supabase dashboard
2. Navigate to "SQL Editor"
3. Run the migration files in order:
   - `001_initial_schema.sql` - Core database structure
   - `002_sample_data.sql` - Sample investment data
   - `003_production_rls_policies.sql` - Security policies

### 2. Domain Configuration (Optional)

1. **Custom Domain**
   - Go to Vercel dashboard → Your project → "Settings" → "Domains"
   - Add your custom domain
   - Update DNS records as instructed

2. **Update Environment Variables**
   ```
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   NEXT_PUBLIC_API_URL=https://yourdomain.com/api
   ```

### 3. SSL Certificate

Vercel automatically provides SSL certificates for all deployments.

## Verification Checklist

After deployment, verify these features work:

- [ ] Homepage loads correctly
- [ ] User authentication (sign up/sign in)
- [ ] Dashboard displays (with mock data initially)
- [ ] Investment opportunities page
- [ ] Contact form sends emails
- [ ] PDF downloads work
- [ ] Dark/light theme toggle
- [ ] Mobile responsiveness

## Troubleshooting

### Build Errors

1. **TypeScript Errors**
   ```bash
   # Fix locally first
   bun run lint
   bun run build
   ```

2. **Environment Variable Issues**
   - Ensure all required variables are set in Vercel dashboard
   - Check variable names match exactly (case-sensitive)
   - Redeploy after adding variables

3. **Clerk Authentication Issues**
   - Verify publishable key format: `pk_live_...` or `pk_test_...`
   - Check webhook URL is correct
   - Ensure webhook events are subscribed

### Runtime Errors

1. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies are enabled
   - Ensure database tables exist

2. **Email Issues**
   - Verify Resend API key
   - Check domain verification status
   - Test with simple email first

## Monitoring

1. **Vercel Analytics**
   - Enable in project settings
   - Monitor performance and errors

2. **Error Tracking**
   - Consider adding Sentry for error monitoring
   - Set up uptime monitoring

## Automatic Deployments

Vercel will automatically deploy when you push to your main branch. To configure:

1. Go to project settings in Vercel
2. Under "Git" → "Production Branch"
3. Set to `main` or your preferred branch

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Project Issues**: GitHub Issues

---

**🚀 Happy Deploying!**

Your LV Capital Partners platform will be live at: `https://your-project.vercel.app`
