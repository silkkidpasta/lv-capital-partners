-- ============================================================================
-- LV Capital Partners - Production Database Migration Script
-- ============================================================================
-- Run this script in your Supabase SQL Editor after deployment
-- Execute sections in order and verify each step before proceeding
-- ============================================================================

-- Step 1: Create Core Database Schema
-- ============================================================================
-- This creates all the necessary tables and relationships

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for storing additional user data beyond Clerk
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    profile_image_url TEXT,
    is_accredited BOOLEAN DEFAULT FALSE,
    accreditation_verified BOOLEAN DEFAULT FALSE,
    accreditation_date TIMESTAMPTZ,
    net_worth DECIMAL(15,2),
    annual_income DECIMAL(15,2),
    investment_experience TEXT,
    risk_tolerance TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investment opportunities table
CREATE TABLE IF NOT EXISTS investment_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    property_type TEXT NOT NULL,
    location TEXT NOT NULL,
    total_raise DECIMAL(15,2) NOT NULL,
    minimum_investment DECIMAL(15,2) NOT NULL,
    target_return TEXT,
    investment_period TEXT,
    images TEXT[],
    documents TEXT[],
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'funded', 'closed')),
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User investments table
CREATE TABLE IF NOT EXISTS user_investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES investment_opportunities(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    investment_date TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investment returns table for tracking performance
CREATE TABLE IF NOT EXISTS investment_returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_investment_id UUID REFERENCES user_investments(id) ON DELETE CASCADE,
    return_date TIMESTAMPTZ NOT NULL,
    return_amount DECIMAL(15,2) NOT NULL,
    return_type TEXT NOT NULL CHECK (return_type IN ('dividend', 'capital_gain', 'interest')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    inquiry_type TEXT DEFAULT 'general',
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investment interest table for tracking user interest in opportunities
CREATE TABLE IF NOT EXISTS investment_interest (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES investment_opportunities(id) ON DELETE CASCADE,
    interested_amount DECIMAL(15,2),
    notes TEXT,
    status TEXT DEFAULT 'interested' CHECK (status IN ('interested', 'committed', 'withdrawn')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, opportunity_id)
);

-- Documents table for storing user documents
CREATE TABLE IF NOT EXISTS user_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    document_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

-- ============================================================================
-- Step 2: Enable Row Level Security (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_interest ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Step 3: Create RLS Policies
-- ============================================================================

-- Users table policies
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Users can insert own profile"
    ON users FOR INSERT
    WITH CHECK (clerk_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Investment opportunities policies (public read)
CREATE POLICY "Anyone can view active opportunities"
    ON investment_opportunities FOR SELECT
    USING (status = 'active');

-- User investments policies
CREATE POLICY "Users can view own investments"
    ON user_investments FOR SELECT
    USING (user_id IN (
        SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
    ));

CREATE POLICY "Users can create own investments"
    ON user_investments FOR INSERT
    WITH CHECK (user_id IN (
        SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
    ));

-- Investment returns policies
CREATE POLICY "Users can view own returns"
    ON investment_returns FOR SELECT
    USING (user_investment_id IN (
        SELECT ui.id FROM user_investments ui
        JOIN users u ON ui.user_id = u.id
        WHERE u.clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
    ));

-- Contact inquiries policies
CREATE POLICY "Users can view own inquiries"
    ON contact_inquiries FOR SELECT
    USING (user_id IN (
        SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
    ) OR user_id IS NULL);

CREATE POLICY "Anyone can create inquiries"
    ON contact_inquiries FOR INSERT
    WITH CHECK (true);

-- Investment interest policies
CREATE POLICY "Users can view own interest"
    ON investment_interest FOR SELECT
    USING (user_id IN (
        SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
    ));

CREATE POLICY "Users can manage own interest"
    ON investment_interest FOR ALL
    USING (user_id IN (
        SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
    ));

-- User documents policies
CREATE POLICY "Users can view own documents"
    ON user_documents FOR SELECT
    USING (user_id IN (
        SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
    ));

CREATE POLICY "Users can upload own documents"
    ON user_documents FOR INSERT
    WITH CHECK (user_id IN (
        SELECT id FROM users WHERE clerk_id = current_setting('request.jwt.claims', true)::json->>'sub'
    ));

-- ============================================================================
-- Step 4: Insert Sample Investment Opportunities
-- ============================================================================

INSERT INTO investment_opportunities (
    title,
    description,
    property_type,
    location,
    total_raise,
    minimum_investment,
    target_return,
    investment_period,
    status,
    featured
) VALUES 
(
    'Luxury Apartment Complex - Downtown Austin',
    'Premium 120-unit luxury apartment complex in the heart of downtown Austin. Features modern amenities, rooftop pool, and prime location near tech corridor.',
    'Multifamily',
    'Austin, TX',
    15000000.00,
    50000.00,
    '12-15% IRR',
    '5 years',
    'active',
    true
),
(
    'Industrial Warehouse Portfolio - Dallas',
    'Portfolio of 5 modern industrial warehouses strategically located near major transportation hubs in Dallas-Fort Worth metroplex.',
    'Industrial',
    'Dallas, TX',
    25000000.00,
    100000.00,
    '10-12% IRR',
    '7 years',
    'active',
    true
),
(
    'Class A Office Building - Miami',
    'Newly constructed 25-story Class A office building in Brickell financial district. 95% pre-leased to Fortune 500 companies.',
    'Office',
    'Miami, FL',
    45000000.00,
    75000.00,
    '8-10% IRR',
    '10 years',
    'active',
    false
),
(
    'Retail Shopping Center - Phoenix',
    'Prime retail shopping center anchored by major grocery chain. Strong demographic area with high population growth.',
    'Retail',
    'Phoenix, AZ',
    12000000.00,
    25000.00,
    '9-11% IRR',
    '5 years',
    'active',
    false
),
(
    'Student Housing Complex - College Station',
    'Purpose-built student housing near Texas A&M University. 400 beds across 100 units with guaranteed occupancy.',
    'Student Housing',
    'College Station, TX',
    8000000.00,
    25000.00,
    '13-16% IRR',
    '5 years',
    'active',
    true
);

-- ============================================================================
-- Step 5: Create Indexes for Performance
-- ============================================================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_accredited ON users(is_accredited);

-- Investment opportunities indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON investment_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_featured ON investment_opportunities(featured);
CREATE INDEX IF NOT EXISTS idx_opportunities_property_type ON investment_opportunities(property_type);

-- User investments indexes
CREATE INDEX IF NOT EXISTS idx_user_investments_user_id ON user_investments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_investments_opportunity_id ON user_investments(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_user_investments_status ON user_investments(status);

-- Investment returns indexes
CREATE INDEX IF NOT EXISTS idx_investment_returns_user_investment_id ON investment_returns(user_investment_id);
CREATE INDEX IF NOT EXISTS idx_investment_returns_date ON investment_returns(return_date);

-- Contact inquiries indexes
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_user_id ON contact_inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_created_at ON contact_inquiries(created_at);

-- Investment interest indexes
CREATE INDEX IF NOT EXISTS idx_investment_interest_user_id ON investment_interest(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_interest_opportunity_id ON investment_interest(opportunity_id);

-- User documents indexes
CREATE INDEX IF NOT EXISTS idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_documents_type ON user_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_user_documents_verification ON user_documents(verification_status);

-- ============================================================================
-- Step 6: Create Functions and Triggers
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_opportunities_updated_at 
    BEFORE UPDATE ON investment_opportunities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_investments_updated_at 
    BEFORE UPDATE ON user_investments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_inquiries_updated_at 
    BEFORE UPDATE ON contact_inquiries 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investment_interest_updated_at 
    BEFORE UPDATE ON investment_interest 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Step 7: Create Views for Analytics
-- ============================================================================

-- Portfolio summary view
CREATE OR REPLACE VIEW user_portfolio_summary AS
SELECT 
    u.id as user_id,
    u.clerk_id,
    u.email,
    u.first_name,
    u.last_name,
    COUNT(ui.id) as total_investments,
    COALESCE(SUM(ui.amount), 0) as total_invested,
    COALESCE(SUM(ir.return_amount), 0) as total_returns,
    CASE 
        WHEN SUM(ui.amount) > 0 THEN 
            (COALESCE(SUM(ir.return_amount), 0) / SUM(ui.amount)) * 100
        ELSE 0 
    END as return_percentage
FROM users u
LEFT JOIN user_investments ui ON u.id = ui.user_id AND ui.status = 'confirmed'
LEFT JOIN investment_returns ir ON ui.id = ir.user_investment_id
GROUP BY u.id, u.clerk_id, u.email, u.first_name, u.last_name;

-- Investment opportunity summary view
CREATE OR REPLACE VIEW opportunity_summary AS
SELECT 
    io.id,
    io.title,
    io.property_type,
    io.location,
    io.total_raise,
    io.minimum_investment,
    io.target_return,
    COUNT(ui.id) as investor_count,
    COALESCE(SUM(ui.amount), 0) as amount_raised,
    CASE 
        WHEN io.total_raise > 0 THEN 
            (COALESCE(SUM(ui.amount), 0) / io.total_raise) * 100
        ELSE 0 
    END as funding_percentage,
    io.status,
    io.featured,
    io.created_at
FROM investment_opportunities io
LEFT JOIN user_investments ui ON io.id = ui.opportunity_id AND ui.status = 'confirmed'
GROUP BY io.id, io.title, io.property_type, io.location, io.total_raise, 
         io.minimum_investment, io.target_return, io.status, io.featured, io.created_at;

-- ============================================================================
-- Verification Queries
-- ============================================================================
-- Run these queries to verify the migration was successful

-- Check if all tables were created
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'investment_opportunities', 'user_investments', 
                  'investment_returns', 'contact_inquiries', 'investment_interest', 'user_documents')
ORDER BY tablename;

-- Check if sample data was inserted
SELECT 'investment_opportunities' as table_name, COUNT(*) as record_count 
FROM investment_opportunities
UNION ALL
SELECT 'users' as table_name, COUNT(*) as record_count 
FROM users;

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'investment_opportunities', 'user_investments')
ORDER BY tablename;

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'investment_opportunities', 'user_investments')
ORDER BY tablename, indexname;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Your database is now ready for production!
-- 
-- Next steps:
-- 1. Test database connectivity from your application
-- 2. Verify RLS policies work correctly
-- 3. Test user registration and data creation
-- 4. Monitor performance and optimize as needed
-- ============================================================================