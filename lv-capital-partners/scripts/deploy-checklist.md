# LV Capital Partners - Deployment Checklist

## Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] Code is committed to GitHub repository
- [ ] All environment variables are documented
- [ ] Database migration scripts are ready
- [ ] Vercel configuration is in place

### ✅ External Services Setup

#### 1. GitHub Repository
- [ ] Create GitHub repository (if not exists)
- [ ] Push latest code to main branch
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

#### 2. Supabase Database Setup
- [ ] Create new Supabase project at https://supabase.com/dashboard
- [ ] Note down project URL and API keys
- [ ] Run database migration script (005_realistic_investment_data.sql)
- [ ] Enable Row Level Security
- [ ] Test database connection

#### 3. Clerk Authentication Setup
- [ ] Create Clerk application at https://dashboard.clerk.com
- [ ] Configure sign-in/sign-up options
- [ ] Note down publishable and secret keys
- [ ] Set up production webhook (after Vercel deployment)

#### 4. Resend Email Setup
- [ ] Create Resend account at https://resend.com
- [ ] Generate API key
- [ ] Verify domain (optional but recommended)
- [ ] Test email sending

#### 5. Google Analytics Setup (Optional)
- [ ] Create GA4 property at https://analytics.google.com
- [ ] Get measurement ID (G-XXXXXXXXXX)

## Vercel Deployment Steps

### Step 1: Connect to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js framework

### Step 2: Configure Environment Variables
Add these in Vercel dashboard under "Environment Variables":

**Authentication (Clerk)**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_actual_key
CLERK_SECRET_KEY=sk_live_your_actual_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
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

**Application URLs**
```
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_API_URL=https://your-project.vercel.app/api
```

**Security Keys** (generate random strings)
```
NEXTAUTH_SECRET=your_32_character_random_string
ENCRYPTION_KEY=your_32_character_random_string
JWT_SECRET=your_32_character_random_string
HASH_SALT=your_16_character_random_string
```

**Analytics (Optional)**
```
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
```

### Step 3: Deploy
1. Click "Deploy" in Vercel dashboard
2. Wait for build to complete
3. Note your deployment URL

### Step 4: Configure Webhooks
1. Go back to Clerk dashboard
2. Navigate to "Webhooks"
3. Add endpoint: `https://your-project.vercel.app/api/webhooks/clerk`
4. Subscribe to: `user.created`, `user.updated`, `user.deleted`
5. Copy signing secret and update `CLERK_WEBHOOK_SECRET` in Vercel

## Post-Deployment Verification

### ✅ Core Functionality Tests
- [ ] Homepage loads correctly
- [ ] Navigation works
- [ ] Dark/light theme toggle
- [ ] Mobile responsiveness

### ✅ Authentication Tests
- [ ] Sign up new user
- [ ] Sign in existing user
- [ ] User profile creation
- [ ] Dashboard access after login

### ✅ Dashboard Tests
- [ ] Portfolio data displays
- [ ] Mock data shows correctly
- [ ] Analytics charts render
- [ ] Export functionality works
- [ ] PDF downloads work

### ✅ Investment Features
- [ ] Investment opportunities page loads
- [ ] Deal details display
- [ ] Contact forms work
- [ ] Email notifications send

### ✅ Verification Features
- [ ] Accredited investor form loads
- [ ] File uploads work
- [ ] Form validation works
- [ ] Multi-step process functions

## Troubleshooting Common Issues

### Build Failures
- Check environment variables are set correctly
- Verify all API keys are valid
- Check TypeScript errors in build logs

### Authentication Issues
- Verify Clerk keys are production keys (pk_live_, sk_live_)
- Check webhook URL is correct
- Ensure webhook events are subscribed

### Database Connection Issues
- Verify Supabase URL and keys
- Check database tables exist
- Ensure RLS policies are enabled

### Email Issues
- Verify Resend API key
- Check domain verification status
- Test with simple email first

## Success Criteria

✅ **Deployment Successful When:**
- [ ] Website loads at production URL
- [ ] Users can sign up and sign in
- [ ] Dashboard displays portfolio data
- [ ] All forms and interactions work
- [ ] No console errors
- [ ] Mobile version works properly
- [ ] Performance is acceptable

## Next Steps After Deployment

1. **Custom Domain** (Optional)
   - Add custom domain in Vercel
   - Update DNS records
   - Update environment variables

2. **Monitoring Setup**
   - Enable Vercel Analytics
   - Set up error tracking (Sentry)
   - Monitor performance

3. **Content Updates**
   - Add real investment data
   - Update company information
   - Add actual team photos

4. **SEO Optimization**
   - Add meta tags
   - Create sitemap
   - Optimize images

---

🎉 **Congratulations on deploying LV Capital Partners!**

Your professional real estate investment platform is now live!
