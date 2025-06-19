-- Accredited Investor Verification System Database Schema
-- This schema creates tables for comprehensive verification tracking and compliance

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create verification status enum
CREATE TYPE verification_status AS ENUM (
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected',
  'expired',
  'additional_docs_required'
);

-- Create verification method enum
CREATE TYPE verification_method AS ENUM (
  'income_verification',
  'net_worth_verification',
  'professional_certification',
  'entity_verification',
  'third_party_verification'
);

-- Create document type enum
CREATE TYPE document_type AS ENUM (
  'tax_return',
  'w2_form',
  'pay_stub',
  'bank_statement',
  'investment_account_statement',
  'cpa_letter',
  'attorney_letter',
  'professional_certification',
  'government_id',
  'passport',
  'entity_formation_docs',
  'financial_statements',
  'audit_report',
  'other'
);

-- Create document verification status enum
CREATE TYPE document_verification_status AS ENUM (
  'pending',
  'verified',
  'rejected'
);

-- Main accredited investor verifications table
CREATE TABLE accredited_investor_verifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Clerk user ID
  status verification_status NOT NULL DEFAULT 'draft',
  verification_method verification_method,
  submission_date TIMESTAMPTZ,
  review_date TIMESTAMPTZ,
  approval_date TIMESTAMPTZ,
  expiration_date TIMESTAMPTZ,

  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT,
  date_of_birth DATE,
  ssn_hash TEXT, -- Hashed SSN for security

  -- Address Information
  street_address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'United States',

  -- Financial Information
  annual_income BIGINT, -- Stored in cents for precision
  net_worth BIGINT, -- Stored in cents for precision
  liquid_net_worth BIGINT, -- Stored in cents for precision
  employment_status TEXT,
  occupation TEXT,
  employer TEXT,

  -- Professional Information (optional)
  is_financial_professional BOOLEAN DEFAULT FALSE,
  certifications TEXT[], -- Array of certification names
  firm_name TEXT,
  registration_number TEXT,

  -- Entity Information (optional)
  entity_name TEXT,
  entity_type TEXT,
  tax_id TEXT,
  formation_state TEXT,
  authorized_person TEXT,
  title TEXT,

  -- Compliance & Legal
  acknowledged_risks BOOLEAN DEFAULT FALSE,
  understood_investment_terms BOOLEAN DEFAULT FALSE,
  confirmed_accredited_status BOOLEAN DEFAULT FALSE,
  agreed_to_terms BOOLEAN DEFAULT FALSE,
  signature TEXT,
  signature_date TIMESTAMPTZ,
  ip_address INET,

  -- Review Information
  reviewed_by TEXT, -- Clerk ID of reviewer
  review_notes TEXT,
  rejection_reason TEXT,
  additional_docs_required TEXT[],

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification documents table
CREATE TABLE verification_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  verification_id UUID NOT NULL REFERENCES accredited_investor_verifications(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- Clerk user ID
  document_type document_type NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL, -- Supabase Storage URL
  file_size BIGINT NOT NULL, -- File size in bytes
  mime_type TEXT,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  verification_status document_verification_status DEFAULT 'pending',
  verified_by TEXT, -- Clerk ID of verifier
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification audit logs table for compliance tracking
CREATE TABLE verification_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Clerk user ID
  verification_id UUID REFERENCES accredited_investor_verifications(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- e.g., 'verification_submitted', 'status_changed', 'document_uploaded'
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  performed_by TEXT NOT NULL, -- Clerk ID of person performing action
  details JSONB, -- Additional action details
  ip_address INET,
  user_agent TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance rules table for configurable requirements
CREATE TABLE compliance_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_required BOOLEAN DEFAULT TRUE,
  category TEXT NOT NULL, -- 'federal', 'state', 'internal'
  validation_function TEXT, -- JavaScript function name for validation
  is_active BOOLEAN DEFAULT TRUE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced users table for investor management
CREATE TABLE investor_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL, -- Clerk user ID
  accreditation_status TEXT DEFAULT 'unverified', -- 'unverified', 'pending', 'verified', 'expired'
  accreditation_date TIMESTAMPTZ,
  accreditation_expiry TIMESTAMPTZ,
  investment_limit BIGINT, -- Maximum investment amount in cents
  risk_tolerance TEXT, -- 'conservative', 'moderate', 'aggressive'
  investment_experience TEXT, -- 'beginner', 'intermediate', 'expert'
  preferred_investment_types TEXT[], -- Array of preferred investment types

  -- KYC/AML Information
  kyc_status TEXT DEFAULT 'incomplete', -- 'incomplete', 'pending', 'complete', 'failed'
  aml_status TEXT DEFAULT 'incomplete', -- 'incomplete', 'pending', 'clear', 'flagged'
  source_of_funds TEXT,
  politically_exposed_person BOOLEAN DEFAULT FALSE,

  -- Communication Preferences
  communication_preferences JSONB DEFAULT '{}',
  marketing_consent BOOLEAN DEFAULT FALSE,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,

  -- Investment History
  total_invested BIGINT DEFAULT 0, -- Total amount invested in cents
  total_distributions BIGINT DEFAULT 0, -- Total distributions received in cents
  active_investments_count INTEGER DEFAULT 0,
  first_investment_date TIMESTAMPTZ,
  last_investment_date TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investment tracking table with enhanced analytics
CREATE TABLE investments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Clerk user ID
  deal_id UUID NOT NULL, -- Reference to deals table
  investment_amount BIGINT NOT NULL, -- Amount in cents
  commitment_date TIMESTAMPTZ DEFAULT NOW(),
  funding_date TIMESTAMPTZ,
  status TEXT DEFAULT 'committed', -- 'committed', 'funded', 'active', 'exited', 'cancelled'

  -- Investment Structure
  ownership_percentage DECIMAL(10,6), -- Percentage ownership
  preferred_return_rate DECIMAL(5,4), -- e.g., 0.08 for 8%
  equity_multiple_target DECIMAL(5,2), -- e.g., 2.5 for 2.5x
  hold_period_months INTEGER,

  -- Performance Tracking
  current_value BIGINT DEFAULT 0, -- Current estimated value in cents
  total_distributions BIGINT DEFAULT 0, -- Total distributions received in cents
  unrealized_gain_loss BIGINT DEFAULT 0, -- Unrealized gain/loss in cents
  irr DECIMAL(8,4), -- Internal Rate of Return as decimal
  equity_multiple DECIMAL(8,4), -- Current equity multiple

  -- Cash Flow Tracking
  capital_called BIGINT DEFAULT 0, -- Capital called to date in cents
  capital_remaining BIGINT DEFAULT 0, -- Remaining committed capital in cents
  next_distribution_date TIMESTAMPTZ,
  expected_distribution_amount BIGINT,

  -- Document References
  subscription_document_url TEXT,
  k1_document_url TEXT,
  quarterly_report_urls TEXT[],

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enhanced deals table for investment opportunities
CREATE TABLE deals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  deal_type TEXT NOT NULL, -- 'equity', 'debt', 'hybrid'
  asset_class TEXT NOT NULL, -- 'residential', 'commercial', 'industrial', 'mixed_use'
  strategy TEXT NOT NULL, -- 'development', 'value_add', 'core_plus', 'opportunistic'

  -- Location Information
  property_address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  market_name TEXT,

  -- Financial Structure
  total_raise_amount BIGINT NOT NULL, -- Total raise in cents
  minimum_investment BIGINT NOT NULL, -- Minimum investment in cents
  maximum_investment BIGINT, -- Maximum investment per investor in cents
  target_irr_min DECIMAL(5,4), -- Minimum target IRR
  target_irr_max DECIMAL(5,4), -- Maximum target IRR
  target_equity_multiple DECIMAL(5,2), -- Target equity multiple
  preferred_return_rate DECIMAL(5,4), -- Preferred return rate
  hold_period_months INTEGER,

  -- Deal Status and Timing
  status TEXT DEFAULT 'draft', -- 'draft', 'marketing', 'funding', 'closed', 'cancelled'
  launch_date TIMESTAMPTZ,
  close_date TIMESTAMPTZ,
  funding_deadline TIMESTAMPTZ,
  expected_close_date TIMESTAMPTZ,

  -- Fundraising Progress
  total_committed BIGINT DEFAULT 0, -- Total committed capital in cents
  investor_count INTEGER DEFAULT 0,
  funding_percentage DECIMAL(5,2) DEFAULT 0.00,

  -- Risk Assessment
  risk_level TEXT, -- 'low', 'medium', 'medium_high', 'high'
  risk_factors TEXT[],

  -- Documents and Media
  pitch_deck_url TEXT,
  financial_projections_url TEXT,
  legal_documents_urls TEXT[],
  property_images_urls TEXT[],
  market_analysis_url TEXT,

  -- Marketing Information
  is_featured BOOLEAN DEFAULT FALSE,
  marketing_headline TEXT,
  key_highlights TEXT[],

  -- Compliance
  regulation_d_exemption TEXT, -- '506b', '506c'
  blue_sky_states TEXT[], -- Array of states where offering is registered
  accredited_only BOOLEAN DEFAULT TRUE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Distribution tracking table
CREATE TABLE distributions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  investment_id UUID NOT NULL REFERENCES investments(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- Clerk user ID
  deal_id UUID NOT NULL REFERENCES deals(id),

  -- Distribution Details
  distribution_type TEXT NOT NULL, -- 'preferred_return', 'capital_return', 'profit_distribution', 'final_distribution'
  amount BIGINT NOT NULL, -- Distribution amount in cents
  distribution_date TIMESTAMPTZ DEFAULT NOW(),
  payment_method TEXT, -- 'ach', 'wire', 'check'

  -- Tax Information
  taxable_amount BIGINT, -- Taxable portion in cents
  tax_year INTEGER,
  k1_issued BOOLEAN DEFAULT FALSE,
  k1_document_url TEXT,

  -- Processing Status
  status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'sent', 'failed'
  processed_date TIMESTAMPTZ,
  transaction_id TEXT, -- Bank transaction ID

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics tracking table for business intelligence
CREATE TABLE user_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL, -- Clerk user ID
  session_id TEXT,

  -- Event Information
  event_type TEXT NOT NULL, -- 'page_view', 'button_click', 'form_submit', 'investment_action'
  event_category TEXT, -- 'navigation', 'engagement', 'conversion'
  page_url TEXT,
  referrer_url TEXT,

  -- User Agent and Device Info
  user_agent TEXT,
  ip_address INET,
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  browser TEXT,
  operating_system TEXT,

  -- Event Data
  event_data JSONB, -- Flexible event properties

  -- Metadata
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_verifications_user_id ON accredited_investor_verifications(user_id);
CREATE INDEX idx_verifications_status ON accredited_investor_verifications(status);
CREATE INDEX idx_verifications_submission_date ON accredited_investor_verifications(submission_date);

CREATE INDEX idx_documents_verification_id ON verification_documents(verification_id);
CREATE INDEX idx_documents_user_id ON verification_documents(user_id);
CREATE INDEX idx_documents_type ON verification_documents(document_type);

CREATE INDEX idx_audit_logs_user_id ON verification_audit_logs(user_id);
CREATE INDEX idx_audit_logs_verification_id ON verification_audit_logs(verification_id);
CREATE INDEX idx_audit_logs_timestamp ON verification_audit_logs(timestamp);

CREATE INDEX idx_investor_profiles_user_id ON investor_profiles(user_id);
CREATE INDEX idx_investor_profiles_accreditation_status ON investor_profiles(accreditation_status);

CREATE INDEX idx_investments_user_id ON investments(user_id);
CREATE INDEX idx_investments_deal_id ON investments(deal_id);
CREATE INDEX idx_investments_status ON investments(status);

CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_asset_class ON deals(asset_class);
CREATE INDEX idx_deals_is_featured ON deals(is_featured);

CREATE INDEX idx_distributions_investment_id ON distributions(investment_id);
CREATE INDEX idx_distributions_user_id ON distributions(user_id);
CREATE INDEX idx_distributions_date ON distributions(distribution_date);

CREATE INDEX idx_analytics_user_id ON user_analytics(user_id);
CREATE INDEX idx_analytics_event_type ON user_analytics(event_type);
CREATE INDEX idx_analytics_timestamp ON user_analytics(timestamp);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_verifications_updated_at BEFORE UPDATE ON accredited_investor_verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON verification_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_rules_updated_at BEFORE UPDATE ON compliance_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investor_profiles_updated_at BEFORE UPDATE ON investor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_distributions_updated_at BEFORE UPDATE ON distributions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE accredited_investor_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user data access
CREATE POLICY "Users can view their own verifications" ON accredited_investor_verifications
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own verifications" ON accredited_investor_verifications
  FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view their own documents" ON verification_documents
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own documents" ON verification_documents
  FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view their own profile" ON investor_profiles
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update their own profile" ON investor_profiles
  FOR UPDATE USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view their own investments" ON investments
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can view their own distributions" ON distributions
  FOR SELECT USING (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert their own analytics" ON user_analytics
  FOR INSERT WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Insert default compliance rules
INSERT INTO compliance_rules (name, description, category, is_required) VALUES
('Accredited Investor Verification', 'Verify accredited investor status per SEC regulations', 'federal', true),
('Identity Verification', 'Verify identity through government-issued ID', 'federal', true),
('Anti-Money Laundering Check', 'AML screening and source of funds verification', 'federal', true),
('OFAC Sanctions Check', 'Screen against OFAC sanctions list', 'federal', true),
('Risk Acknowledgment', 'Acknowledge investment risks and illiquidity', 'internal', true),
('Investment Experience Assessment', 'Assess investor experience and sophistication', 'internal', false),
('Suitability Assessment', 'Assess investment suitability for investor', 'internal', true);

-- Create a function to calculate investment performance
CREATE OR REPLACE FUNCTION calculate_investment_performance(investment_id UUID)
RETURNS TABLE (
  current_irr DECIMAL,
  current_multiple DECIMAL,
  total_return DECIMAL,
  unrealized_gain DECIMAL
) AS $$
DECLARE
  inv_record RECORD;
  total_cash_flow DECIMAL;
  current_val DECIMAL;
BEGIN
  SELECT * INTO inv_record FROM investments WHERE id = investment_id;

  current_val := inv_record.current_value / 100.0; -- Convert from cents
  total_cash_flow := (inv_record.investment_amount + inv_record.total_distributions) / 100.0;

  RETURN QUERY SELECT
    inv_record.irr,
    inv_record.equity_multiple,
    (current_val + (inv_record.total_distributions / 100.0) - (inv_record.investment_amount / 100.0)),
    (current_val - (inv_record.investment_amount / 100.0));
END;
$$ LANGUAGE plpgsql;
