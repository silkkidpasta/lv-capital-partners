-- =============================================================================
-- LV CAPITAL PARTNERS - PRODUCTION RLS POLICIES
-- =============================================================================
-- This migration sets up Row Level Security policies for production use
-- Ensures data isolation and security for investor platform

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE accredited_investor_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE net_worth_verification ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- USER PROFILES POLICIES
-- =============================================================================

-- Users can only see and update their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = clerk_user_id::uuid);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = clerk_user_id::uuid);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = clerk_user_id::uuid);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE clerk_user_id = auth.uid()::text
            AND user_type = 'admin'
        )
    );

-- =============================================================================
-- INVESTMENT DEALS POLICIES
-- =============================================================================

-- All authenticated users can view active investment deals
CREATE POLICY "Authenticated users can view active deals" ON investment_deals
    FOR SELECT USING (
        auth.role() = 'authenticated'
        AND status IN ('active', 'funding')
    );

-- Only admins can modify investment deals
CREATE POLICY "Admins can manage investment deals" ON investment_deals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE clerk_user_id = auth.uid()::text
            AND user_type = 'admin'
        )
    );

-- =============================================================================
-- USER INVESTMENTS POLICIES
-- =============================================================================

-- Users can only see their own investments
CREATE POLICY "Users can view own investments" ON user_investments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = user_investments.user_id
            AND user_profiles.clerk_user_id = auth.uid()::text
        )
    );

-- Users can create investments for themselves (with verification)
CREATE POLICY "Verified users can create investments" ON user_investments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = user_investments.user_id
            AND user_profiles.clerk_user_id = auth.uid()::text
            AND user_profiles.verification_status = 'approved'
        )
    );

-- Admins can view and manage all investments
CREATE POLICY "Admins can manage all investments" ON user_investments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE clerk_user_id = auth.uid()::text
            AND user_type = 'admin'
        )
    );

-- =============================================================================
-- DISTRIBUTIONS POLICIES
-- =============================================================================

-- Users can only see distributions for their investments
CREATE POLICY "Users can view own distributions" ON distributions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_investments
            JOIN user_profiles ON user_profiles.id = user_investments.user_id
            WHERE user_investments.id = distributions.user_investment_id
            AND user_profiles.clerk_user_id = auth.uid()::text
        )
    );

-- Only admins can create/modify distributions
CREATE POLICY "Admins can manage distributions" ON distributions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE clerk_user_id = auth.uid()::text
            AND user_type = 'admin'
        )
    );

-- =============================================================================
-- DOCUMENTS POLICIES
-- =============================================================================

-- Users can only see their own documents
CREATE POLICY "Users can view own documents" ON documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = documents.user_id
            AND user_profiles.clerk_user_id = auth.uid()::text
        )
    );

-- Users can upload their own documents
CREATE POLICY "Users can upload own documents" ON documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = documents.user_id
            AND user_profiles.clerk_user_id = auth.uid()::text
        )
    );

-- Admins can view all documents
CREATE POLICY "Admins can view all documents" ON documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE clerk_user_id = auth.uid()::text
            AND user_type = 'admin'
        )
    );

-- =============================================================================
-- VERIFICATION POLICIES
-- =============================================================================

-- Users can only see their own verification records
CREATE POLICY "Users can view own verification" ON accredited_investor_verification
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = accredited_investor_verification.user_id
            AND user_profiles.clerk_user_id = auth.uid()::text
        )
    );

-- Users can create/update their own verification
CREATE POLICY "Users can manage own verification" ON accredited_investor_verification
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_profiles.id = accredited_investor_verification.user_id
            AND user_profiles.clerk_user_id = auth.uid()::text
        )
    );

-- Admins can view all verifications
CREATE POLICY "Admins can view all verifications" ON accredited_investor_verification
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE clerk_user_id = auth.uid()::text
            AND user_type = 'admin'
        )
    );

-- Similar policies for other verification tables
CREATE POLICY "Users can view own identity verification" ON identity_verification
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM accredited_investor_verification aiv
            JOIN user_profiles up ON up.id = aiv.user_id
            WHERE aiv.id = identity_verification.verification_id
            AND up.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can manage own identity verification" ON identity_verification
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM accredited_investor_verification aiv
            JOIN user_profiles up ON up.id = aiv.user_id
            WHERE aiv.id = identity_verification.verification_id
            AND up.clerk_user_id = auth.uid()::text
        )
    );

-- Income verification policies
CREATE POLICY "Users can view own income verification" ON income_verification
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM accredited_investor_verification aiv
            JOIN user_profiles up ON up.id = aiv.user_id
            WHERE aiv.id = income_verification.verification_id
            AND up.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can manage own income verification" ON income_verification
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM accredited_investor_verification aiv
            JOIN user_profiles up ON up.id = aiv.user_id
            WHERE aiv.id = income_verification.verification_id
            AND up.clerk_user_id = auth.uid()::text
        )
    );

-- Net worth verification policies
CREATE POLICY "Users can view own net worth verification" ON net_worth_verification
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM accredited_investor_verification aiv
            JOIN user_profiles up ON up.id = aiv.user_id
            WHERE aiv.id = net_worth_verification.verification_id
            AND up.clerk_user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can manage own net worth verification" ON net_worth_verification
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM accredited_investor_verification aiv
            JOIN user_profiles up ON up.id = aiv.user_id
            WHERE aiv.id = net_worth_verification.verification_id
            AND up.clerk_user_id = auth.uid()::text
        )
    );

-- =============================================================================
-- STORAGE POLICIES
-- =============================================================================

-- Create storage bucket for documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'investor-documents',
    'investor-documents',
    false,
    10485760, -- 10MB limit
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for investor documents
CREATE POLICY "Users can upload own documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'investor-documents' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can view own documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'investor-documents' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can update own documents" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'investor-documents' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Users can delete own documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'investor-documents' AND
        auth.role() = 'authenticated' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Admins can access all documents
CREATE POLICY "Admins can access all documents" ON storage.objects
    FOR ALL USING (
        bucket_id = 'investor-documents' AND
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE clerk_user_id = auth.uid()::text
            AND user_type = 'admin'
        )
    );

-- =============================================================================
-- FUNCTIONS FOR USER MANAGEMENT
-- =============================================================================

-- Function to create user profile from Clerk webhook
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (
        clerk_user_id,
        email,
        first_name,
        last_name,
        user_type,
        created_at,
        updated_at
    ) VALUES (
        NEW.id::text,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        'investor', -- Default to investor
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update user profile
CREATE OR REPLACE FUNCTION update_user_profile(
    p_user_id UUID,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_address JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE user_profiles
    SET
        first_name = COALESCE(p_first_name, first_name),
        last_name = COALESCE(p_last_name, last_name),
        phone = COALESCE(p_phone, phone),
        address = COALESCE(p_address, address),
        updated_at = NOW()
    WHERE clerk_user_id = p_user_id::text;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user portfolio summary
CREATE OR REPLACE FUNCTION get_user_portfolio_summary(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_invested', COALESCE(SUM(ui.amount_invested), 0),
        'current_value', COALESCE(SUM(ui.current_value), 0),
        'total_distributions', COALESCE(SUM(d.amount), 0),
        'active_investments', COUNT(DISTINCT ui.id),
        'performance', CASE
            WHEN SUM(ui.amount_invested) > 0 THEN
                ROUND(((SUM(ui.current_value) - SUM(ui.amount_invested)) / SUM(ui.amount_invested) * 100)::numeric, 2)
            ELSE 0
        END
    ) INTO result
    FROM user_profiles up
    LEFT JOIN user_investments ui ON up.id = ui.user_id AND ui.status = 'active'
    LEFT JOIN distributions d ON ui.id = d.user_investment_id
    WHERE up.clerk_user_id = p_user_id::text
    GROUP BY up.id;

    RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
