-- =============================================================================
-- LV CAPITAL PARTNERS - PRODUCTION SAMPLE DATA
-- =============================================================================
-- This migration adds realistic sample data for testing the production platform
-- Includes investment deals, user portfolios, distributions, and activity

-- Insert sample investment deals
INSERT INTO investment_deals (
  id,
  title,
  description,
  property_type,
  asset_class,
  location,
  total_investment_amount,
  target_return,
  investment_term,
  minimum_investment,
  current_funding,
  funding_goal,
  expected_completion,
  risk_level,
  status,
  created_at,
  updated_at,
  deal_metrics,
  property_details,
  financial_projections
) VALUES
-- Deal 1: Manhattan Luxury Tower
(
  gen_random_uuid(),
  'Manhattan Luxury Tower',
  'Premium residential development in prime Manhattan location featuring 85 luxury condominiums with unparalleled city views and world-class amenities.',
  'Residential',
  'Residential',
  'New York, NY',
  75000000,
  18.5,
  36,
  250000,
  68000000,
  75000000,
  '2026-12-31',
  'Medium',
  'active',
  NOW() - INTERVAL '8 months',
  NOW(),
  '{
    "irr": 18.5,
    "equity_multiple": 1.65,
    "cash_on_cash": 12.8,
    "cap_rate": 5.2,
    "ltv": 65,
    "debt_service_coverage": 1.35
  }'::jsonb,
  '{
    "square_footage": 125000,
    "units": 85,
    "avg_unit_size": 1470,
    "parking_spaces": 95,
    "amenities": ["Rooftop terrace", "Fitness center", "Concierge", "Private dining"],
    "year_built": 2024,
    "renovation_year": null
  }'::jsonb,
  '{
    "year_1": {"revenue": 8500000, "expenses": 2800000, "noi": 5700000},
    "year_2": {"revenue": 9200000, "expenses": 2950000, "noi": 6250000},
    "year_3": {"revenue": 9950000, "expenses": 3100000, "noi": 6850000}
  }'::jsonb
),

-- Deal 2: Austin Tech Campus
(
  gen_random_uuid(),
  'Austin Tech Campus',
  'State-of-the-art technology campus featuring flexible office spaces designed for growing tech companies in Austin''s thriving innovation district.',
  'Office',
  'Commercial',
  'Austin, TX',
  45000000,
  22.0,
  48,
  150000,
  42000000,
  45000000,
  '2027-06-30',
  'Medium-High',
  'active',
  NOW() - INTERVAL '6 months',
  NOW(),
  '{
    "irr": 22.0,
    "equity_multiple": 1.85,
    "cash_on_cash": 15.2,
    "cap_rate": 6.8,
    "ltv": 70,
    "debt_service_coverage": 1.42
  }'::jsonb,
  '{
    "square_footage": 285000,
    "units": null,
    "avg_unit_size": null,
    "parking_spaces": 450,
    "amenities": ["Conference centers", "Cafeteria", "Fitness facility", "Outdoor spaces"],
    "year_built": 2023,
    "renovation_year": 2023
  }'::jsonb,
  '{
    "year_1": {"revenue": 12500000, "expenses": 4200000, "noi": 8300000},
    "year_2": {"revenue": 13800000, "expenses": 4400000, "noi": 9400000},
    "year_3": {"revenue": 15200000, "expenses": 4600000, "noi": 10600000}
  }'::jsonb
),

-- Deal 3: Miami Mixed-Use Development
(
  gen_random_uuid(),
  'Miami Mixed-Use Development',
  'Innovative mixed-use development combining luxury residential units with high-end retail and dining spaces in Miami''s vibrant Brickell district.',
  'Mixed-Use',
  'Mixed-Use',
  'Miami, FL',
  62000000,
  16.8,
  42,
  100000,
  35000000,
  62000000,
  '2027-03-31',
  'Medium',
  'funding',
  NOW() - INTERVAL '3 months',
  NOW(),
  '{
    "irr": 16.8,
    "equity_multiple": 1.58,
    "cash_on_cash": 11.5,
    "cap_rate": 5.8,
    "ltv": 68,
    "debt_service_coverage": 1.28
  }'::jsonb,
  '{
    "square_footage": 180000,
    "units": 120,
    "avg_unit_size": 1200,
    "parking_spaces": 180,
    "amenities": ["Pool deck", "Retail spaces", "Restaurant", "Valet parking"],
    "year_built": 2025,
    "renovation_year": null
  }'::jsonb,
  '{
    "year_1": {"revenue": 9800000, "expenses": 3500000, "noi": 6300000},
    "year_2": {"revenue": 10800000, "expenses": 3700000, "noi": 7100000},
    "year_3": {"revenue": 11900000, "expenses": 3900000, "noi": 8000000}
  }'::jsonb
),

-- Deal 4: Denver Industrial Portfolio
(
  gen_random_uuid(),
  'Denver Industrial Portfolio',
  'Strategic acquisition of four premium industrial properties in Denver''s growing logistics corridor, fully leased to investment-grade tenants.',
  'Industrial',
  'Industrial',
  'Denver, CO',
  38000000,
  19.2,
  60,
  200000,
  38000000,
  38000000,
  '2029-12-31',
  'Low-Medium',
  'active',
  NOW() - INTERVAL '12 months',
  NOW(),
  '{
    "irr": 19.2,
    "equity_multiple": 1.72,
    "cash_on_cash": 13.8,
    "cap_rate": 7.2,
    "ltv": 62,
    "debt_service_coverage": 1.55
  }'::jsonb,
  '{
    "square_footage": 420000,
    "units": 4,
    "avg_unit_size": 105000,
    "parking_spaces": 85,
    "amenities": ["Loading docks", "High ceilings", "Rail access", "Modern HVAC"],
    "year_built": 2018,
    "renovation_year": 2022
  }'::jsonb,
  '{
    "year_1": {"revenue": 5200000, "expenses": 1800000, "noi": 3400000},
    "year_2": {"revenue": 5650000, "expenses": 1900000, "noi": 3750000},
    "year_3": {"revenue": 6100000, "expenses": 2000000, "noi": 4100000}
  }'::jsonb
),

-- Deal 5: Phoenix Retail Center
(
  gen_random_uuid(),
  'Phoenix Retail Center',
  'Newly renovated retail center anchored by premium grocery and featuring diverse tenant mix in high-traffic Phoenix suburban location.',
  'Retail',
  'Retail',
  'Phoenix, AZ',
  28000000,
  14.5,
  36,
  75000,
  22000000,
  28000000,
  '2026-09-30',
  'Medium',
  'funding',
  NOW() - INTERVAL '2 months',
  NOW(),
  '{
    "irr": 14.5,
    "equity_multiple": 1.48,
    "cash_on_cash": 9.8,
    "cap_rate": 6.5,
    "ltv": 72,
    "debt_service_coverage": 1.22
  }'::jsonb,
  '{
    "square_footage": 95000,
    "units": 12,
    "avg_unit_size": 7900,
    "parking_spaces": 320,
    "amenities": ["Anchor tenant", "Food court", "Outdoor seating", "Ample parking"],
    "year_built": 2008,
    "renovation_year": 2023
  }'::jsonb,
  '{
    "year_1": {"revenue": 4200000, "expenses": 1500000, "noi": 2700000},
    "year_2": {"revenue": 4550000, "expenses": 1580000, "noi": 2970000},
    "year_3": {"revenue": 4900000, "expenses": 1660000, "noi": 3240000}
  }'::jsonb
);

-- Create a sample user profile for testing (using a test Clerk ID)
INSERT INTO user_profiles (
  id,
  clerk_user_id,
  email,
  first_name,
  last_name,
  phone,
  address,
  user_type,
  verification_status,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'user_test_sample_123',
  'investor@example.com',
  'John',
  'Smith',
  '(555) 123-4567',
  '{
    "street": "123 Investment Ave",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "United States"
  }'::jsonb,
  'investor',
  'approved',
  NOW() - INTERVAL '6 months',
  NOW()
) ON CONFLICT (clerk_user_id) DO NOTHING;

-- Get the sample user ID for creating investments
DO $$
DECLARE
  sample_user_id UUID;
  deal_1_id UUID;
  deal_2_id UUID;
  deal_3_id UUID;
  deal_4_id UUID;
  investment_1_id UUID;
  investment_2_id UUID;
  investment_3_id UUID;
  investment_4_id UUID;
BEGIN
  -- Get the sample user ID
  SELECT id INTO sample_user_id FROM user_profiles WHERE clerk_user_id = 'user_test_sample_123';

  -- Get deal IDs
  SELECT id INTO deal_1_id FROM investment_deals WHERE title = 'Manhattan Luxury Tower';
  SELECT id INTO deal_2_id FROM investment_deals WHERE title = 'Austin Tech Campus';
  SELECT id INTO deal_3_id FROM investment_deals WHERE title = 'Miami Mixed-Use Development';
  SELECT id INTO deal_4_id FROM investment_deals WHERE title = 'Denver Industrial Portfolio';

  -- Skip if sample user doesn't exist
  IF sample_user_id IS NULL THEN
    RETURN;
  END IF;

  -- Create sample user investments
  INSERT INTO user_investments (
    id,
    user_id,
    deal_id,
    amount_invested,
    current_value,
    equity_percentage,
    investment_date,
    status,
    created_at,
    updated_at
  ) VALUES
  (
    gen_random_uuid(),
    sample_user_id,
    deal_1_id,
    250000,
    334000,
    0.33,
    NOW() - INTERVAL '8 months',
    'active',
    NOW() - INTERVAL '8 months',
    NOW()
  ),
  (
    gen_random_uuid(),
    sample_user_id,
    deal_2_id,
    150000,
    195000,
    0.33,
    NOW() - INTERVAL '6 months',
    'active',
    NOW() - INTERVAL '6 months',
    NOW()
  ),
  (
    gen_random_uuid(),
    sample_user_id,
    deal_3_id,
    100000,
    118000,
    0.16,
    NOW() - INTERVAL '3 months',
    'active',
    NOW() - INTERVAL '3 months',
    NOW()
  ),
  (
    gen_random_uuid(),
    sample_user_id,
    deal_4_id,
    200000,
    285000,
    0.53,
    NOW() - INTERVAL '12 months',
    'active',
    NOW() - INTERVAL '12 months',
    NOW()
  )
  RETURNING id INTO investment_1_id;

  -- Get investment IDs for distributions
  SELECT id INTO investment_1_id FROM user_investments WHERE user_id = sample_user_id AND deal_id = deal_1_id;
  SELECT id INTO investment_2_id FROM user_investments WHERE user_id = sample_user_id AND deal_id = deal_2_id;
  SELECT id INTO investment_3_id FROM user_investments WHERE user_id = sample_user_id AND deal_id = deal_3_id;
  SELECT id INTO investment_4_id FROM user_investments WHERE user_id = sample_user_id AND deal_id = deal_4_id;

  -- Create sample distributions
  INSERT INTO distributions (
    id,
    user_investment_id,
    amount,
    distribution_date,
    type,
    description,
    created_at
  ) VALUES
  -- Q4 2024 distributions
  (
    gen_random_uuid(),
    investment_1_id,
    12500,
    NOW() - INTERVAL '2 weeks',
    'quarterly',
    'Q4 2024 Distribution - Manhattan Luxury Tower',
    NOW() - INTERVAL '2 weeks'
  ),
  (
    gen_random_uuid(),
    investment_2_id,
    8750,
    NOW() - INTERVAL '2 weeks',
    'quarterly',
    'Q4 2024 Distribution - Austin Tech Campus',
    NOW() - INTERVAL '2 weeks'
  ),
  (
    gen_random_uuid(),
    investment_4_id,
    15200,
    NOW() - INTERVAL '2 weeks',
    'quarterly',
    'Q4 2024 Distribution - Denver Industrial Portfolio',
    NOW() - INTERVAL '2 weeks'
  ),

  -- Q3 2024 distributions
  (
    gen_random_uuid(),
    investment_1_id,
    11800,
    NOW() - INTERVAL '3 months',
    'quarterly',
    'Q3 2024 Distribution - Manhattan Luxury Tower',
    NOW() - INTERVAL '3 months'
  ),
  (
    gen_random_uuid(),
    investment_2_id,
    8200,
    NOW() - INTERVAL '3 months',
    'quarterly',
    'Q3 2024 Distribution - Austin Tech Campus',
    NOW() - INTERVAL '3 months'
  ),
  (
    gen_random_uuid(),
    investment_4_id,
    14500,
    NOW() - INTERVAL '3 months',
    'quarterly',
    'Q3 2024 Distribution - Denver Industrial Portfolio',
    NOW() - INTERVAL '3 months'
  ),

  -- Q2 2024 distributions
  (
    gen_random_uuid(),
    investment_1_id,
    11200,
    NOW() - INTERVAL '6 months',
    'quarterly',
    'Q2 2024 Distribution - Manhattan Luxury Tower',
    NOW() - INTERVAL '6 months'
  ),
  (
    gen_random_uuid(),
    investment_2_id,
    7850,
    NOW() - INTERVAL '6 months',
    'quarterly',
    'Q2 2024 Distribution - Austin Tech Campus',
    NOW() - INTERVAL '6 months'
  ),
  (
    gen_random_uuid(),
    investment_4_id,
    13800,
    NOW() - INTERVAL '6 months',
    'quarterly',
    'Q2 2024 Distribution - Denver Industrial Portfolio',
    NOW() - INTERVAL '6 months'
  );

  -- Create sample documents
  INSERT INTO documents (
    id,
    user_id,
    verification_id,
    document_type,
    file_name,
    file_path,
    file_size,
    content_type,
    upload_date,
    created_at
  ) VALUES
  (
    gen_random_uuid(),
    sample_user_id,
    NULL,
    'quarterly_report',
    'Q4_2024_Portfolio_Report.pdf',
    'sample_documents/Q4_2024_Portfolio_Report.pdf',
    2457600,
    'application/pdf',
    NOW() - INTERVAL '2 weeks',
    NOW() - INTERVAL '2 weeks'
  ),
  (
    gen_random_uuid(),
    sample_user_id,
    NULL,
    'tax_document',
    'K1_2024_Tax_Forms.pdf',
    'sample_documents/K1_2024_Tax_Forms.pdf',
    912384,
    'application/pdf',
    NOW() - INTERVAL '1 month',
    NOW() - INTERVAL '1 month'
  ),
  (
    gen_random_uuid(),
    sample_user_id,
    NULL,
    'investment_summary',
    'Annual_Investment_Summary_2024.pdf',
    'sample_documents/Annual_Investment_Summary_2024.pdf',
    1843200,
    'application/pdf',
    NOW() - INTERVAL '2 months',
    NOW() - INTERVAL '2 months'
  );

END $$;

-- Create additional sample users for testing
INSERT INTO user_profiles (
  id,
  clerk_user_id,
  email,
  first_name,
  last_name,
  user_type,
  verification_status,
  created_at,
  updated_at
) VALUES
(
  gen_random_uuid(),
  'user_test_jane_456',
  'jane.investor@example.com',
  'Jane',
  'Williams',
  'investor',
  'pending',
  NOW() - INTERVAL '2 weeks',
  NOW()
),
(
  gen_random_uuid(),
  'user_test_admin_789',
  'admin@lvcapitalpartners.com',
  'Michael',
  'Admin',
  'admin',
  'approved',
  NOW() - INTERVAL '1 year',
  NOW()
) ON CONFLICT (clerk_user_id) DO NOTHING;

-- Update statistics
ANALYZE investment_deals;
ANALYZE user_profiles;
ANALYZE user_investments;
ANALYZE distributions;
ANALYZE documents;
