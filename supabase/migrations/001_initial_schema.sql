-- =============================================================================
-- LV CAPITAL PARTNERS - DATABASE SCHEMA
-- =============================================================================
-- Initial migration to create all core tables for the investment platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- USERS TABLE
-- =============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(255),
    title VARCHAR(255),
    phone VARCHAR(50),
    accredited_status VARCHAR(20) CHECK (accredited_status IN ('yes', 'no', 'pending', 'verified')) DEFAULT 'pending',
    investment_amount_range VARCHAR(100),
    preferred_contact_method VARCHAR(20) CHECK (preferred_contact_method IN ('email', 'phone')) DEFAULT 'email',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INVESTMENTS TABLE
-- =============================================================================
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('equity', 'debt', 'preferred_equity', 'hybrid')) NOT NULL,
    asset_class VARCHAR(100) NOT NULL,
    strategy VARCHAR(100) NOT NULL,
    target_return_min DECIMAL(5,2) NOT NULL,
    target_return_max DECIMAL(5,2) NOT NULL,
    minimum_investment DECIMAL(15,2) NOT NULL,
    total_raise DECIMAL(15,2) NOT NULL,
    current_funding DECIMAL(15,2) DEFAULT 0,
    funded_percent DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('active', 'coming_soon', 'funded', 'closed')) DEFAULT 'coming_soon',
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'medium_high', 'high')) DEFAULT 'medium',
    hold_period VARCHAR(50),
    projected_completion VARCHAR(50),
    key_highlights TEXT[], -- Array of highlight strings
    images TEXT[], -- Array of image URLs
    investment_structure JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- USER INVESTMENTS TABLE
-- =============================================================================
CREATE TABLE user_investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    investment_id UUID REFERENCES investments(id) ON DELETE CASCADE,
    amount_invested DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2) NOT NULL,
    return_percent DECIMAL(8,2) DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('active', 'pending', 'exited')) DEFAULT 'active',
    investment_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, investment_id)
);

-- =============================================================================
-- DOCUMENTS TABLE
-- =============================================================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    investment_id UUID REFERENCES investments(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- DISTRIBUTIONS TABLE
-- =============================================================================
CREATE TABLE distributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_investment_id UUID REFERENCES user_investments(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    distribution_date DATE NOT NULL,
    type VARCHAR(20) CHECK (type IN ('quarterly', 'annual', 'exit')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'processed', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- EMAIL NOTIFICATIONS TABLE
-- =============================================================================
CREATE TABLE email_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_type VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'sent', 'failed', 'bounced')) DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- CONTACT INQUIRIES TABLE
-- =============================================================================
CREATE TABLE contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    company VARCHAR(255),
    title VARCHAR(255),
    investment_amount VARCHAR(100),
    investment_interests TEXT[],
    accredited_status VARCHAR(20),
    timeframe VARCHAR(50),
    message TEXT,
    preferred_contact VARCHAR(20),
    preferred_time VARCHAR(50),
    status VARCHAR(20) CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed')) DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- INDEXES
-- =============================================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_accredited_status ON users(accredited_status);
CREATE INDEX idx_investments_status ON investments(status);
CREATE INDEX idx_investments_asset_class ON investments(asset_class);
CREATE INDEX idx_investments_created_at ON investments(created_at);
CREATE INDEX idx_user_investments_user_id ON user_investments(user_id);
CREATE INDEX idx_user_investments_investment_id ON user_investments(investment_id);
CREATE INDEX idx_user_investments_status ON user_investments(status);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_investment_id ON documents(investment_id);
CREATE INDEX idx_documents_is_public ON documents(is_public);
CREATE INDEX idx_distributions_user_investment_id ON distributions(user_investment_id);
CREATE INDEX idx_distributions_date ON distributions(distribution_date);
CREATE INDEX idx_email_notifications_user_id ON email_notifications(user_id);
CREATE INDEX idx_email_notifications_status ON email_notifications(status);
CREATE INDEX idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX idx_contact_inquiries_created_at ON contact_inquiries(created_at);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Public read access to investments (for browsing opportunities)
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to active investments" ON investments
    FOR SELECT USING (status IN ('active', 'coming_soon'));

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Users can only see their own investments
CREATE POLICY "Users can view own investments" ON user_investments
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can only see their own documents and public documents
CREATE POLICY "Users can view own documents" ON documents
    FOR SELECT USING (auth.uid()::text = user_id::text OR is_public = true);

-- Users can only see their own distributions
CREATE POLICY "Users can view own distributions" ON distributions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_investments
            WHERE user_investments.id = distributions.user_investment_id
            AND user_investments.user_id::text = auth.uid()::text
        )
    );

-- =============================================================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investments_updated_at BEFORE UPDATE ON investments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_investments_updated_at BEFORE UPDATE ON user_investments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_inquiries_updated_at BEFORE UPDATE ON contact_inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to calculate portfolio performance
CREATE OR REPLACE FUNCTION get_portfolio_performance(user_uuid UUID)
RETURNS TABLE (
    total_invested DECIMAL,
    current_value DECIMAL,
    total_return DECIMAL,
    return_percent DECIMAL,
    active_investments INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(SUM(ui.amount_invested), 0) as total_invested,
        COALESCE(SUM(ui.current_value), 0) as current_value,
        COALESCE(SUM(ui.current_value - ui.amount_invested), 0) as total_return,
        CASE
            WHEN SUM(ui.amount_invested) > 0
            THEN ((SUM(ui.current_value) - SUM(ui.amount_invested)) / SUM(ui.amount_invested)) * 100
            ELSE 0
        END as return_percent,
        COUNT(*)::INTEGER as active_investments
    FROM user_investments ui
    WHERE ui.user_id = user_uuid AND ui.status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Function to update investment funding percentage
CREATE OR REPLACE FUNCTION update_investment_funding()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE investments
    SET
        funded_percent = CASE
            WHEN total_raise > 0
            THEN LEAST(100, (current_funding / total_raise) * 100)
            ELSE 0
        END,
        status = CASE
            WHEN current_funding >= total_raise THEN 'funded'
            WHEN current_funding > 0 THEN 'active'
            ELSE status
        END
    WHERE id = NEW.investment_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_investment_funding
    AFTER INSERT OR UPDATE ON user_investments
    FOR EACH ROW
    EXECUTE FUNCTION update_investment_funding();

COMMENT ON DATABASE postgres IS 'LV Capital Partners - Real Estate Investment Platform Database';
