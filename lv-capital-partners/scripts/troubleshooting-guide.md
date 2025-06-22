# LV Capital Partners - Troubleshooting Guide

## 🔧 Overview

This comprehensive troubleshooting guide covers common issues you may encounter during deployment and operation of the LV Capital Partners platform. Each section includes symptoms, causes, and step-by-step solutions.

## 📋 Quick Diagnostic Checklist

Before diving into specific issues, run through this quick checklist:

- [ ] **Vercel deployment status**: Green (check Vercel dashboard)
- [ ] **Environment variables**: All required variables set
- [ ] **Database connection**: Supabase project running
- [ ] **External services**: Clerk, Resend APIs responding
- [ ] **SSL certificate**: Valid and not expired
- [ ] **Domain DNS**: Properly configured (if using custom domain)

## 🚫 Build and Deployment Issues

### Issue: Build Fails During Deployment

**Symptoms:**
- Vercel deployment shows "Build Failed"
- Red status in deployment logs
- TypeScript or ESLint errors in build logs

**Causes:**
- TypeScript compilation errors
- Missing environment variables during build
- Import/export issues
- Dependency conflicts

**Solutions:**

1. **Check Build Logs**
   ```bash
   # View detailed build logs in Vercel dashboard
   # Look for specific error messages
   ```

2. **Test Build Locally**
   ```bash
   cd lv-capital-partners
   bun install
   bun run build
   ```

3. **Fix TypeScript Errors**
   ```bash
   # Run type checking
   bun run lint
   
   # Fix common TypeScript issues
   # - Missing type definitions
   # - Incorrect imports
   # - Unused variables
   ```

4. **Check Environment Variables**
   - Ensure all required variables are set in Vercel
   - Verify variable names match exactly (case-sensitive)
   - Check for typos in variable names

5. **Clear Build Cache**
   - In Vercel dashboard: Settings → General → Clear Build Cache
   - Redeploy after clearing cache

### Issue: Deployment Succeeds but Site Won't Load

**Symptoms:**
- Vercel shows successful deployment
- Site shows blank page or 500 error
- Console shows JavaScript errors

**Causes:**
- Runtime environment variable issues
- API route failures
- Database connection problems

**Solutions:**

1. **Check Browser Console**
   - Open developer tools (F12)
   - Look for JavaScript errors in Console tab
   - Check Network tab for failed requests

2. **Verify Environment Variables**
   ```bash
   # Check if all production variables are set
   # Variables needed at runtime (not just build time)
   ```

3. **Test API Routes**
   ```bash
   # Test API endpoints directly
   curl https://your-domain.vercel.app/api/health
   ```

4. **Check Vercel Function Logs**
   - Go to Vercel dashboard → Functions tab
   - Look for error logs in function executions

## 🔐 Authentication Issues

### Issue: Clerk Authentication Not Working

**Symptoms:**
- Sign-in/sign-up forms don't respond
- Users redirected to error page
- Console shows Clerk-related errors

**Causes:**
- Incorrect Clerk API keys
- Missing webhook configuration
- Wrong environment configuration

**Solutions:**

1. **Verify Clerk API Keys**
   ```bash
   # Check environment variables
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_... (or pk_test_...)
   CLERK_SECRET_KEY=sk_live_... (or sk_test_...)
   ```

2. **Check Clerk Dashboard**
   - Verify application is active
   - Check API key permissions
   - Ensure production keys for live site

3. **Test Clerk Endpoints**
   ```bash
   # Test if Clerk API is responding
   curl -H "Authorization: Bearer sk_live_your_key" \
        https://api.clerk.dev/v1/users
   ```

4. **Configure Clerk Settings**
   - Check allowed redirect URLs
   - Verify sign-in/sign-up flow settings
   - Ensure email verification is properly configured

### Issue: Webhook Authentication Failures

**Symptoms:**
- User data not syncing to database
- Webhook endpoint returns 401/403 errors
- Clerk dashboard shows failed webhook deliveries

**Causes:**
- Missing or incorrect webhook secret
- Webhook URL incorrect
- Server not processing webhook correctly

**Solutions:**

1. **Verify Webhook Configuration**
   ```
   Webhook URL: https://your-domain.vercel.app/api/webhooks/clerk
   Events: user.created, user.updated, user.deleted
   ```

2. **Check Webhook Secret**
   ```bash
   # Ensure this environment variable is set
   CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

3. **Test Webhook Endpoint**
   ```bash
   # Test if webhook endpoint is accessible
   curl -X POST https://your-domain.vercel.app/api/webhooks/clerk \
        -H "Content-Type: application/json" \
        -d '{"test": true}'
   ```

4. **Check Webhook Logs**
   - Vercel dashboard → Functions → View webhook execution logs
   - Look for signature verification errors

## 💾 Database Connection Issues

### Issue: Supabase Connection Failures

**Symptoms:**
- Database queries fail
- "Connection refused" errors
- Dashboard shows no data

**Causes:**
- Incorrect Supabase credentials
- Network connectivity issues
- Database not properly configured

**Solutions:**

1. **Verify Supabase Credentials**
   ```bash
   # Check these environment variables
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

2. **Test Database Connection**
   ```sql
   -- Run this in Supabase SQL Editor
   SELECT current_database();
   ```

3. **Check Database Tables**
   ```sql
   -- Verify tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

4. **Test API Connection**
   ```bash
   # Test Supabase API directly
   curl -H "apikey: your_anon_key" \
        -H "Authorization: Bearer your_anon_key" \
        https://your-project.supabase.co/rest/v1/users
   ```

### Issue: Row Level Security (RLS) Blocking Queries

**Symptoms:**
- Queries return empty results
- "insufficient_privilege" errors
- Users can't access their own data

**Causes:**
- RLS policies not properly configured
- Missing authentication context
- Incorrect policy conditions

**Solutions:**

1. **Check RLS Policies**
   ```sql
   -- View current policies
   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

2. **Test Policies Manually**
   ```sql
   -- Test with specific user context
   SET request.jwt.claims = '{"sub": "user_clerk_id_here"}';
   SELECT * FROM users WHERE clerk_id = 'user_clerk_id_here';
   ```

3. **Verify Authentication Headers**
   - Check if JWT token is being sent with requests
   - Verify token format and claims

4. **Temporarily Disable RLS for Testing**
   ```sql
   -- CAUTION: Only for debugging, re-enable immediately
   ALTER TABLE users DISABLE ROW LEVEL SECURITY;
   -- Test queries
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ```

## 📧 Email Service Issues

### Issue: Resend Emails Not Sending

**Symptoms:**
- Contact forms submit but no emails received
- Email verification not working
- No error messages shown

**Causes:**
- Incorrect Resend API key
- Domain not verified
- Rate limits exceeded

**Solutions:**

1. **Verify Resend API Key**
   ```bash
   # Check environment variable
   RESEND_API_KEY=re_your_api_key_here
   ```

2. **Test Resend API**
   ```bash
   # Test API key directly
   curl -X POST 'https://api.resend.com/emails' \
        -H 'Authorization: Bearer re_your_api_key' \
        -H 'Content-Type: application/json' \
        -d '{
          "from": "noreply@yourdomain.com",
          "to": ["test@example.com"],
          "subject": "Test",
          "html": "<p>Test email</p>"
        }'
   ```

3. **Check Domain Verification**
   - Login to Resend dashboard
   - Go to Domains section
   - Verify domain status is "Verified"
   - Add DNS records if not verified

4. **Check Resend Logs**
   - Resend dashboard → Logs
   - Look for failed delivery attempts
   - Check bounce/complaint rates

### Issue: Email Domain Not Verified

**Symptoms:**
- Emails sent from generic domain
- Domain verification pending
- SPF/DKIM warnings

**Causes:**
- DNS records not added
- DNS propagation delay
- Incorrect DNS configuration

**Solutions:**

1. **Add Required DNS Records**
   ```dns
   # Add these to your domain's DNS settings
   TXT Record: @ resend._domainkey [provided-value]
   ```

2. **Wait for Propagation**
   - DNS changes can take up to 48 hours
   - Use DNS checker tools to verify propagation

3. **Verify DNS Setup**
   ```bash
   # Check DNS records
   nslookup -type=TXT resend._domainkey.yourdomain.com
   ```

## 🎨 Frontend Issues

### Issue: Styling/CSS Not Loading

**Symptoms:**
- Page appears unstyled
- Missing Tailwind CSS styles
- Fonts not loading

**Causes:**
- Build process not including CSS
- CDN issues
- CSS file corruption

**Solutions:**

1. **Check Build Output**
   ```bash
   # Verify CSS files are generated
   bun run build
   ls -la .next/static/css/
   ```

2. **Test Tailwind Configuration**
   ```bash
   # Verify Tailwind is working
   bunx tailwindcss --input ./src/app/globals.css --output ./test.css
   ```

3. **Clear Browser Cache**
   - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
   - Clear browser cache completely
   - Test in incognito/private mode

### Issue: JavaScript Errors in Browser

**Symptoms:**
- Interactive features not working
- Console shows JavaScript errors
- React components not rendering

**Causes:**
- Build errors not caught
- Missing dependencies
- Environment-specific code issues

**Solutions:**

1. **Check Console Errors**
   - Open browser developer tools
   - Look for specific error messages
   - Note file names and line numbers

2. **Test Different Browsers**
   - Chrome, Firefox, Safari, Edge
   - Check if error is browser-specific

3. **Verify Dependencies**
   ```bash
   # Check for missing dependencies
   bun install
   bun run build
   ```

## 🚀 Performance Issues

### Issue: Slow Page Load Times

**Symptoms:**
- Pages take >5 seconds to load
- Users report slow performance
- Poor Lighthouse scores

**Causes:**
- Large bundle sizes
- Unoptimized images
- Inefficient database queries
- CDN issues

**Solutions:**

1. **Analyze Bundle Size**
   ```bash
   # Check bundle analyzer
   ANALYZE=true bun run build
   ```

2. **Optimize Images**
   - Use Next.js Image component
   - Compress images before upload
   - Use appropriate image formats (WebP, AVIF)

3. **Check Database Queries**
   - Monitor slow queries in Supabase
   - Add appropriate indexes
   - Optimize complex joins

4. **Enable Caching**
   - Configure proper cache headers
   - Use Vercel Edge Network
   - Implement Redis caching if needed

### Issue: High Memory Usage

**Symptoms:**
- Vercel function timeouts
- Out of memory errors
- Slow API responses

**Causes:**
- Memory leaks in API routes
- Large data processing
- Inefficient algorithms

**Solutions:**

1. **Monitor Memory Usage**
   - Check Vercel function metrics
   - Use memory profiling tools

2. **Optimize API Routes**
   ```javascript
   // Implement pagination for large datasets
   // Use streaming for file processing
   // Clean up resources properly
   ```

3. **Upgrade Vercel Plan**
   - Consider Pro plan for higher limits
   - Use Edge Functions for lighter operations

## 🔍 Monitoring and Debugging

### Setting Up Monitoring

1. **Enable Vercel Analytics**
   ```javascript
   // In your app
   import { Analytics } from '@vercel/analytics/react';
   
   function MyApp({ Component, pageProps }) {
     return (
       <>
         <Component {...pageProps} />
         <Analytics />
       </>
     );
   }
   ```

2. **Add Error Boundary**
   ```javascript
   // Catch React errors
   class ErrorBoundary extends React.Component {
     componentDidCatch(error, errorInfo) {
       console.error('Error caught by boundary:', error, errorInfo);
     }
   }
   ```

3. **Log Important Events**
   ```javascript
   // Add logging for debugging
   console.log('User signed in:', user.id);
   console.error('Database error:', error);
   ```

### Debugging Tools

1. **Browser Developer Tools**
   - Console: JavaScript errors and logs
   - Network: API calls and responses
   - Performance: Page load analysis
   - Application: Local storage and cookies

2. **Vercel Dashboard**
   - Deployments: Build logs and status
   - Functions: Serverless function logs
   - Analytics: Performance metrics
   - Domains: DNS configuration

3. **Supabase Dashboard**
   - Logs: Database query logs
   - Auth: User authentication logs
   - API: API usage statistics

## 📞 Getting Help

### When to Escalate

Escalate issues when:
- Security vulnerabilities discovered
- Data corruption detected
- Service completely unavailable >30 minutes
- Performance degradation affects all users

### Support Resources

**Documentation:**
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Resend Docs](https://resend.com/docs)

**Community Support:**
- GitHub Issues (for project-specific issues)
- Vercel Discord
- Next.js Discussions
- Supabase Discord

**Professional Support:**
- Vercel Pro Support (paid plans)
- Supabase Support (paid plans)
- Clerk Support

### Issue Template

When reporting issues, include:

```markdown
**Environment:** Production/Staging/Development
**URL:** https://your-domain.com
**Browser:** Chrome 118, Firefox 119, etc.
**User Impact:** How many users affected
**Priority:** Critical/High/Medium/Low

**Issue Description:**
Clear description of the problem

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Error Messages:**
Console errors, API responses, etc.

**Screenshots:**
If applicable

**Recent Changes:**
Any recent deployments or changes
```

---

## 🎯 Prevention Best Practices

### Regular Maintenance

1. **Monitor Performance**
   - Check Lighthouse scores weekly
   - Monitor Core Web Vitals
   - Review error logs daily

2. **Security Updates**
   - Update dependencies monthly
   - Review security alerts
   - Monitor authentication logs

3. **Backup Procedures**
   - Backup database weekly
   - Export environment variables
   - Document configuration changes

4. **Testing**
   - Run automated tests before deployment
   - Perform manual testing on staging
   - Test all critical user flows

### Proactive Monitoring

1. **Set Up Alerts**
   - Uptime monitoring
   - Error rate thresholds
   - Performance degradation alerts

2. **Regular Health Checks**
   - API endpoint monitoring
   - Database connection tests
   - Email delivery tests

3. **Capacity Planning**
   - Monitor resource usage trends
   - Plan for traffic growth
   - Scale infrastructure proactively

---

*This troubleshooting guide should help you resolve most common issues with the LV Capital Partners platform. Keep it updated as you discover new issues and solutions.*