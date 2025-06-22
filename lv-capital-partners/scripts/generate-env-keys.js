#!/usr/bin/env node

/**
 * Generate secure random keys for LV Capital Partners environment variables
 * Run with: node scripts/generate-env-keys.js
 */

const crypto = require('crypto');

function generateRandomKey(length) {
  return crypto.randomBytes(length).toString('hex');
}

function generateBase64Key(length) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

console.log('🔐 LV Capital Partners - Environment Keys Generator');
console.log('================================================\n');

console.log('Copy these secure keys to your Vercel environment variables:\n');

console.log('# Security Keys (Required)');
console.log(`NEXTAUTH_SECRET=${generateRandomKey(32)}`);
console.log(`ENCRYPTION_KEY=${generateRandomKey(32)}`);
console.log(`JWT_SECRET=${generateRandomKey(32)}`);
console.log(`HASH_SALT=${generateRandomKey(16)}`);
console.log('');

console.log('# Alternative Base64 Keys (if needed)');
console.log(`NEXTAUTH_SECRET_B64=${generateBase64Key(32)}`);
console.log(`ENCRYPTION_KEY_B64=${generateBase64Key(32)}`);
console.log(`JWT_SECRET_B64=${generateBase64Key(32)}`);
console.log(`HASH_SALT_B64=${generateBase64Key(16)}`);
console.log('');

console.log('🔗 Service URLs Template:');
console.log('# Update these with your actual service URLs and keys');
console.log('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_key_here');
console.log('CLERK_SECRET_KEY=sk_live_your_clerk_secret_here');
console.log('CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here');
console.log('');
console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here');
console.log('SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here');
console.log('');
console.log('RESEND_API_KEY=re_your_resend_api_key_here');
console.log('RESEND_FROM_EMAIL=noreply@yourdomain.com');
console.log('');
console.log('NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX');
console.log('');
console.log('# Will be set automatically by Vercel');
console.log('NEXT_PUBLIC_APP_URL=https://your-project.vercel.app');
console.log('NEXT_PUBLIC_API_URL=https://your-project.vercel.app/api');
console.log('');

console.log('⚠️  Security Notes:');
console.log('- Keep these keys secure and never commit them to Git');
console.log('- Use different keys for development and production');
console.log('- Store them securely in your password manager');
console.log('- Update them regularly for better security');
console.log('');

console.log('🚀 Next Steps:');
console.log('1. Copy the security keys above');
console.log('2. Set up your external services (Clerk, Supabase, Resend)');
console.log('3. Add all environment variables to Vercel dashboard');
console.log('4. Deploy your application');
console.log('');

console.log('📖 For detailed instructions, see:');
console.log('- VERCEL_DEPLOYMENT.md - Complete deployment guide');
console.log('- scripts/deploy-checklist.md - Step-by-step checklist');
