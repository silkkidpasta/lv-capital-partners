# LV Capital Partners - Deployment Workflow Scripts

## 📂 Overview

This directory contains all the necessary scripts and documentation for deploying the LV Capital Partners real estate investment platform to production. These files provide a comprehensive, step-by-step workflow to get your application running on Vercel with all external services properly configured.

## 📋 File Structure

```
scripts/
├── README.md                          # This file - deployment overview
├── service-setup-guide.md             # Detailed external service setup
├── env-production-complete.txt        # Complete environment variables template
├── env-production-template.txt        # Basic environment variables template
├── production-db-migration.sql        # Database setup and migration script
├── deployment-testing-checklist.md    # Comprehensive testing procedures
├── troubleshooting-guide.md           # Common issues and solutions
├── deploy-checklist.md               # Quick deployment checklist
└── generate-env-keys.js              # Security key generation utility
```

## 🚀 Quick Start Deployment

### Prerequisites
- [ ] GitHub repository with LV Capital Partners code
- [ ] Business email address for service registrations
- [ ] Access to domain DNS settings (optional)
- [ ] Vercel account

### 30-Minute Deployment Path

1. **Generate Security Keys** (2 minutes)
   ```bash
   cd lv-capital-partners
   node scripts/generate-env-keys.js
   ```
   Save the generated keys securely.

2. **Set Up External Services** (15 minutes)
   Follow the **[Service Setup Guide](./service-setup-guide.md)** to configure:
   - Supabase (database)
   - Clerk (authentication)
   - Resend (email)
   - Google Analytics (optional)

3. **Deploy to Vercel** (5 minutes)
   - Import repository to Vercel
   - Add environment variables from **[env-production-complete.txt](./env-production-complete.txt)**
   - Deploy application

4. **Configure Database** (5 minutes)
   - Run **[production-db-migration.sql](./production-db-migration.sql)** in Supabase
   - Set up webhooks in Clerk

5. **Test Application** (3 minutes)
   Use **[deployment-testing-checklist.md](./deployment-testing-checklist.md)** for verification

## 📚 Detailed Documentation

### Core Deployment Files

#### 1. Service Setup Guide
**File**: `service-setup-guide.md`
**Purpose**: Complete external service configuration
**Contains**:
- Step-by-step Supabase project creation
- Clerk authentication setup with screenshots descriptions
- Resend email service configuration
- Google Analytics setup (optional)
- Security best practices

#### 2. Environment Variables Template
**File**: `env-production-complete.txt`
**Purpose**: All required environment variables
**Contains**:
- Authentication (Clerk) variables
- Database (Supabase) configuration
- Email (Resend) settings
- Security keys and secrets
- Optional integrations (Stripe, analytics)
- Detailed setup instructions

#### 3. Database Migration Script
**File**: `production-db-migration.sql`
**Purpose**: Complete database setup
**Contains**:
- Core schema creation
- Row Level Security (RLS) policies
- Performance indexes
- Sample investment data
- Verification queries

#### 4. Testing Checklist
**File**: `deployment-testing-checklist.md`
**Purpose**: Comprehensive testing procedures
**Contains**:
- Authentication flow testing
- Dashboard functionality verification
- Investment features testing
- Email notification testing
- Mobile responsiveness checks
- Performance benchmarks

#### 5. Troubleshooting Guide
**File**: `troubleshooting-guide.md`
**Purpose**: Common issues and solutions
**Contains**:
- Build and deployment errors
- Authentication problems
- Database connection issues
- Email service problems
- Performance optimization
- Debugging techniques

### Utility Scripts

#### Security Key Generator
**File**: `generate-env-keys.js`
**Purpose**: Generate secure random keys
**Usage**:
```bash
node scripts/generate-env-keys.js
```
**Output**: Secure keys for production environment

## 🎯 Deployment Strategies

### Strategy 1: Full Production Deployment
**Best for**: Live production sites serving real users
**Steps**:
1. Complete service setup with production credentials
2. Use live API keys (pk_live_, sk_live_)
3. Configure custom domain
4. Set up monitoring and analytics
5. Implement backup procedures

### Strategy 2: Staging Environment
**Best for**: Testing before production release
**Steps**:
1. Use test/development API keys
2. Create separate Supabase project for staging
3. Test all functionality thoroughly
4. Migrate successful configuration to production

### Strategy 3: MVP Quick Launch
**Best for**: Getting a functional site live quickly
**Steps**:
1. Use development/test keys initially
2. Configure basic authentication
3. Use Resend.dev for email (no domain setup)
4. Upgrade to production services later

## 🔧 Environment Configuration

### Required Services
- **Vercel**: Application hosting
- **Supabase**: Database and authentication backend
- **Clerk**: User authentication and management
- **Resend**: Email notifications

### Optional Services
- **Google Analytics**: Website analytics
- **Stripe**: Payment processing (future feature)
- **Sentry**: Error tracking and monitoring

### Environment Variables Summary
```bash
# Essential (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
NEXTAUTH_SECRET
ENCRYPTION_KEY

# Application URLs (Update after deployment)
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_API_URL

# Optional but Recommended
NEXT_PUBLIC_GA_TRACKING_ID
CLERK_WEBHOOK_SECRET
```

## 🧪 Testing Phases

### Phase 1: Basic Functionality
- [ ] Homepage loads correctly
- [ ] User authentication works
- [ ] Database connectivity confirmed

### Phase 2: Core Features
- [ ] Dashboard displays investment data
- [ ] Contact forms submit successfully
- [ ] Email notifications send

### Phase 3: Advanced Features
- [ ] Investment interest tracking
- [ ] Document handling
- [ ] Mobile responsiveness

### Phase 4: Performance & Security
- [ ] Page load times < 3 seconds
- [ ] No security vulnerabilities
- [ ] Error handling works correctly

## 🚨 Common Issues & Quick Fixes

### Build Fails
```bash
# Check for TypeScript errors
bun run lint
bun run build

# Verify environment variables are set
# Check Vercel dashboard for missing variables
```

### Authentication Not Working
```bash
# Verify Clerk keys
# Check webhook configuration
# Ensure production keys for live site
```

### Database Connection Issues
```bash
# Verify Supabase credentials
# Check if database tables exist
# Ensure RLS policies are configured
```

### Email Not Sending
```bash
# Verify Resend API key
# Check domain verification status
# Test with resend.dev initially
```

## 📞 Support & Resources

### Documentation Links
- [Main Deployment Guide](../DEPLOYMENT_GUIDE.md)
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Resend Documentation](https://resend.com/docs)

### Getting Help
1. **Check troubleshooting guide** first
2. **Review Vercel deployment logs** for errors
3. **Test locally** before deploying
4. **Create GitHub issue** with detailed error information

### Professional Support
- Consider upgrading to paid plans for priority support
- Professional implementation services available
- Consult documentation before contacting support

## ✅ Deployment Success Criteria

Your deployment is successful when:

### Technical Requirements Met
- [ ] Application accessible at production URL
- [ ] No console errors in browser
- [ ] All API endpoints responding correctly
- [ ] Database queries executing successfully
- [ ] Email notifications functioning

### User Experience Requirements Met
- [ ] Users can register and sign in
- [ ] Dashboard displays investment portfolio
- [ ] Contact forms work correctly
- [ ] Mobile experience is responsive
- [ ] Page load times are acceptable

### Security Requirements Met
- [ ] HTTPS enforced throughout
- [ ] Authentication working properly
- [ ] User data properly protected
- [ ] API endpoints secured
- [ ] Environment variables configured correctly

## 🎉 Go-Live Checklist

Before announcing your platform:

### Final Verification
- [ ] All testing phases completed
- [ ] Performance benchmarks met
- [ ] Security review passed
- [ ] Backup procedures in place
- [ ] Monitoring configured

### Business Readiness
- [ ] Content review completed
- [ ] Legal pages updated (privacy, terms)
- [ ] Contact information accurate
- [ ] Team notifications set up
- [ ] Customer support procedures ready

### Marketing Preparation
- [ ] Analytics tracking configured
- [ ] SEO optimization completed
- [ ] Social media accounts ready
- [ ] Press release prepared (if applicable)

---

## 📄 License & Usage

This deployment workflow is designed specifically for the LV Capital Partners platform. Adapt the instructions as needed for your specific use case while maintaining security best practices.

## 🔄 Maintenance

Keep these deployment scripts updated as:
- New features are added to the platform
- External service APIs change
- Security requirements evolve
- Team processes improve

---

*These deployment scripts are designed to get your LV Capital Partners platform live quickly and securely. Follow the guides step-by-step, and you'll have a professional real estate investment platform running in production.*