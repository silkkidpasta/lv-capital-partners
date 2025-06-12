-- =============================================================================
-- LV CAPITAL PARTNERS - SAMPLE DATA
-- =============================================================================
-- Populate database with realistic sample investment opportunities and user data

-- =============================================================================
-- SAMPLE INVESTMENTS
-- =============================================================================

-- Manhattan Luxury Residential Tower
INSERT INTO investments (
    id,
    title,
    description,
    location,
    type,
    asset_class,
    strategy,
    target_return_min,
    target_return_max,
    minimum_investment,
    total_raise,
    current_funding,
    funded_percent,
    status,
    risk_level,
    hold_period,
    projected_completion,
    key_highlights,
    images,
    investment_structure
) VALUES (
    '550e8400-e29b-41d4-a716-446655440001',
    'Manhattan Luxury Residential Tower',
    'A 42-story luxury residential development in the heart of Upper East Side, featuring 87 premium units with Central Park views. This project represents a unique opportunity to invest in one of Manhattan''s most prestigious neighborhoods.',
    'Upper East Side, New York, NY',
    'equity',
    'Residential',
    'Development',
    18.00,
    22.00,
    250000.00,
    45000000.00,
    38250000.00,
    85.00,
    'active',
    'medium',
    '36 months',
    'Q3 2026',
    ARRAY[
        'Prime Upper East Side location with Central Park proximity',
        'Pre-sold 40% of units with average price of $3.2M',
        'Experienced development team with 15+ luxury projects',
        'Strong neighborhood appreciation and limited supply',
        'Best-in-class amenities and finishes'
    ],
    ARRAY[
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'
    ],
    '{"preferredReturn": "8% annually", "targetIrr": "18-22%", "equityMultiple": "2.0-2.5x", "holdPeriod": "36 months", "distributionFrequency": "Quarterly", "exitStrategy": "Unit sales completion"}'::jsonb
);

-- Austin Tech Campus Portfolio
INSERT INTO investments (
    id,
    title,
    description,
    location,
    type,
    asset_class,
    strategy,
    target_return_min,
    target_return_max,
    minimum_investment,
    total_raise,
    current_funding,
    funded_percent,
    status,
    risk_level,
    hold_period,
    projected_completion,
    key_highlights,
    images,
    investment_structure
) VALUES (
    '550e8400-e29b-41d4-a716-446655440002',
    'Austin Tech Campus Portfolio',
    'A portfolio of three Class A office buildings in Austin''s thriving tech corridor, featuring stable tech tenant base and value-add renovation opportunities.',
    'Austin, Texas',
    'debt',
    'Commercial',
    'Acquisition',
    15.00,
    18.00,
    100000.00,
    28000000.00,
    25760000.00,
    92.00,
    'active',
    'low',
    '24 months',
    'Q1 2025',
    ARRAY[
        'Stable tech tenant base with long-term leases',
        'Below-market acquisition price',
        'Value-add renovation opportunity',
        'Growing Austin market with strong fundamentals'
    ],
    ARRAY[
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop'
    ],
    '{"preferredReturn": "10% annually", "targetIrr": "15-18%", "equityMultiple": "1.8-2.2x", "holdPeriod": "24 months", "distributionFrequency": "Monthly", "exitStrategy": "Portfolio sale or refinance"}'::jsonb
);

-- Miami Mixed-Use Development
INSERT INTO investments (
    id,
    title,
    description,
    location,
    type,
    asset_class,
    strategy,
    target_return_min,
    target_return_max,
    minimum_investment,
    total_raise,
    current_funding,
    funded_percent,
    status,
    risk_level,
    hold_period,
    projected_completion,
    key_highlights,
    images,
    investment_structure
) VALUES (
    '550e8400-e29b-41d4-a716-446655440003',
    'Miami Mixed-Use Development',
    'A luxury mixed-use development on Brickell Avenue featuring 156 residential units and 25,000 sq ft of premium retail space.',
    'Brickell Avenue, Miami, FL',
    'preferred_equity',
    'Mixed-Use',
    'Development',
    14.00,
    17.00,
    500000.00,
    65000000.00,
    0.00,
    0.00,
    'coming_soon',
    'medium_high',
    '42 months',
    'Q2 2027',
    ARRAY[
        'Prime Brickell location with bay views',
        'Mixed residential/retail development',
        'Strong pre-leasing interest from retailers',
        'Experienced Miami developer'
    ],
    ARRAY[
        'https://images.unsplash.com/photo-1587380541739-2ca6c9c5d87a?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1493962853295-0fd8b5f4c9f2?w=800&h=600&fit=crop'
    ],
    '{"preferredReturn": "12% annually", "targetIrr": "14-17%", "equityMultiple": "1.6-2.0x", "holdPeriod": "42 months", "distributionFrequency": "Quarterly", "exitStrategy": "Asset sale upon stabilization"}'::jsonb
);

-- San Francisco Office Renovation
INSERT INTO investments (
    id,
    title,
    description,
    location,
    type,
    asset_class,
    strategy,
    target_return_min,
    target_return_max,
    minimum_investment,
    total_raise,
    current_funding,
    funded_percent,
    status,
    risk_level,
    hold_period,
    projected_completion,
    key_highlights,
    images,
    investment_structure
) VALUES (
    '550e8400-e29b-41d4-a716-446655440004',
    'San Francisco Office Renovation',
    'Value-add renovation of a Class A office building in SOMA district, featuring modern amenities and tech tenant improvements.',
    'SOMA District, San Francisco, CA',
    'equity',
    'Commercial',
    'Value-Add',
    16.00,
    20.00,
    150000.00,
    32000000.00,
    22400000.00,
    70.00,
    'active',
    'medium',
    '30 months',
    'Q4 2025',
    ARRAY[
        'Class A office building in prime location',
        'Acquired 50% below replacement cost',
        'Strong tech tenant demand in area',
        'Transit-oriented location with BART access'
    ],
    ARRAY[
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop'
    ],
    '{"preferredReturn": "9% annually", "targetIrr": "16-20%", "equityMultiple": "1.9-2.3x", "holdPeriod": "30 months", "distributionFrequency": "Quarterly", "exitStrategy": "Sale to tech company or REIT"}'::jsonb
);

-- Denver Industrial Portfolio
INSERT INTO investments (
    id,
    title,
    description,
    location,
    type,
    asset_class,
    strategy,
    target_return_min,
    target_return_max,
    minimum_investment,
    total_raise,
    current_funding,
    funded_percent,
    status,
    risk_level,
    hold_period,
    projected_completion,
    key_highlights,
    images,
    investment_structure
) VALUES (
    '550e8400-e29b-41d4-a716-446655440005',
    'Denver Industrial Portfolio',
    'A portfolio of five modern industrial properties in Denver''s logistics corridor, featuring long-term triple-net leases with credit tenants.',
    'Denver Metro Area, Colorado',
    'equity',
    'Industrial',
    'Core-Plus',
    12.00,
    15.00,
    200000.00,
    42000000.00,
    42000000.00,
    100.00,
    'funded',
    'low',
    '60 months',
    'Stabilized',
    ARRAY[
        'Portfolio of 5 modern industrial buildings',
        'Triple-net leases with credit tenants',
        'Average lease term of 8.5 years',
        'Strategic Denver logistics corridor location'
    ],
    ARRAY[
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ],
    '{"preferredReturn": "7% annually", "targetIrr": "12-15%", "equityMultiple": "1.5-1.8x", "holdPeriod": "60 months", "distributionFrequency": "Quarterly", "exitStrategy": "Sale to institutional buyer"}'::jsonb
);

-- =============================================================================
-- SAMPLE USERS
-- =============================================================================

INSERT INTO users (
    id,
    email,
    first_name,
    last_name,
    company,
    title,
    phone,
    accredited_status,
    investment_amount_range,
    preferred_contact_method
) VALUES
(
    '450e8400-e29b-41d4-a716-446655440001',
    'marcus.wellington@example.com',
    'Marcus',
    'Wellington',
    'Wellington Family Office',
    'Principal',
    '+1-555-0123',
    'verified',
    '$1,000,000 - $2,500,000',
    'email'
),
(
    '450e8400-e29b-41d4-a716-446655440002',
    'sarah.chen@example.com',
    'Sarah',
    'Chen',
    'Chen Investments',
    'Managing Partner',
    '+1-555-0456',
    'verified',
    '$500,000 - $1,000,000',
    'phone'
),
(
    '450e8400-e29b-41d4-a716-446655440003',
    'james.morrison@example.com',
    'James',
    'Morrison',
    'Morrison Capital',
    'Investment Committee Chair',
    '+1-555-0789',
    'verified',
    '$2,500,000 - $5,000,000',
    'email'
);

-- =============================================================================
-- SAMPLE USER INVESTMENTS
-- =============================================================================

INSERT INTO user_investments (
    user_id,
    investment_id,
    amount_invested,
    current_value,
    return_percent,
    status,
    investment_date
) VALUES
-- Marcus Wellington's investments
(
    '450e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001', -- Manhattan Tower
    250000.00,
    335000.00,
    34.0,
    'active',
    '2024-01-15'
),
(
    '450e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002', -- Austin Tech
    150000.00,
    195000.00,
    30.0,
    'active',
    '2024-03-20'
),
(
    '450e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440005', -- Denver Industrial
    200000.00,
    285000.00,
    42.5,
    'active',
    '2023-08-10'
),

-- Sarah Chen's investments
(
    '450e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002', -- Austin Tech
    100000.00,
    128000.00,
    28.0,
    'active',
    '2024-02-12'
),
(
    '450e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440004', -- SF Office
    150000.00,
    185000.00,
    23.3,
    'active',
    '2024-05-08'
),

-- James Morrison's investments
(
    '450e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440001', -- Manhattan Tower
    500000.00,
    670000.00,
    34.0,
    'active',
    '2024-01-10'
),
(
    '450e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440005', -- Denver Industrial
    300000.00,
    427500.00,
    42.5,
    'active',
    '2023-07-25'
);

-- =============================================================================
-- SAMPLE DISTRIBUTIONS
-- =============================================================================

INSERT INTO distributions (
    user_investment_id,
    amount,
    distribution_date,
    type,
    status
) VALUES
-- Q3 2024 distributions
(
    (SELECT id FROM user_investments WHERE user_id = '450e8400-e29b-41d4-a716-446655440001' AND investment_id = '550e8400-e29b-41d4-a716-446655440002'),
    3750.00,
    '2024-09-30',
    'quarterly',
    'processed'
),
(
    (SELECT id FROM user_investments WHERE user_id = '450e8400-e29b-41d4-a716-446655440001' AND investment_id = '550e8400-e29b-41d4-a716-446655440005'),
    3500.00,
    '2024-09-30',
    'quarterly',
    'processed'
),

-- Q4 2024 distributions (pending)
(
    (SELECT id FROM user_investments WHERE user_id = '450e8400-e29b-41d4-a716-446655440001' AND investment_id = '550e8400-e29b-41d4-a716-446655440002'),
    4125.00,
    '2024-12-31',
    'quarterly',
    'pending'
),
(
    (SELECT id FROM user_investments WHERE user_id = '450e8400-e29b-41d4-a716-446655440002' AND investment_id = '550e8400-e29b-41d4-a716-446655440002'),
    2750.00,
    '2024-12-31',
    'quarterly',
    'pending'
);

-- =============================================================================
-- SAMPLE DOCUMENTS
-- =============================================================================

INSERT INTO documents (
    investment_id,
    name,
    type,
    category,
    file_path,
    file_size,
    mime_type,
    is_public
) VALUES
-- Manhattan Tower documents
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Private Placement Memorandum',
    'Legal Document',
    'Legal',
    '/documents/manhattan-tower/ppm.pdf',
    2457600,
    'application/pdf',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Financial Projections',
    'Financial Analysis',
    'Financial',
    '/documents/manhattan-tower/projections.pdf',
    1843200,
    'application/pdf',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Market Analysis Report',
    'Market Research',
    'Market Research',
    '/documents/manhattan-tower/market-analysis.pdf',
    3276800,
    'application/pdf',
    true
),

-- Austin Tech documents
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Investment Summary',
    'Investment Memo',
    'Investment',
    '/documents/austin-tech/summary.pdf',
    1638400,
    'application/pdf',
    true
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'Property Appraisals',
    'Appraisal Report',
    'Due Diligence',
    '/documents/austin-tech/appraisals.pdf',
    4915200,
    'application/pdf',
    true
);

-- =============================================================================
-- SAMPLE CONTACT INQUIRIES
-- =============================================================================

INSERT INTO contact_inquiries (
    first_name,
    last_name,
    email,
    phone,
    company,
    title,
    investment_amount,
    investment_interests,
    accredited_status,
    timeframe,
    message,
    preferred_contact,
    preferred_time,
    status
) VALUES
(
    'Alexandra',
    'Thompson',
    'alexandra.thompson@example.com',
    '+1-555-0234',
    'Thompson Holdings',
    'Investment Director',
    '$500,000 - $1,000,000',
    ARRAY['Residential Development', 'Commercial Office'],
    'yes',
    'immediate',
    'Interested in learning more about your current residential development opportunities in major metropolitan areas.',
    'email',
    'morning',
    'new'
),
(
    'David',
    'Rodriguez',
    'david.rodriguez@example.com',
    '+1-555-0567',
    'Rodriguez Family Office',
    'Principal',
    '$1,000,000 - $2,500,000',
    ARRAY['Mixed-Use Projects', 'Industrial/Logistics'],
    'yes',
    'short',
    'Looking to diversify our real estate portfolio with value-add opportunities.',
    'phone',
    'afternoon',
    'contacted'
),
(
    'Emily',
    'Park',
    'emily.park@example.com',
    '+1-555-0890',
    'Park Capital Management',
    'Portfolio Manager',
    '$250,000 - $500,000',
    ARRAY['Residential Development', 'Industrial/Logistics'],
    'pending',
    'medium',
    'First-time real estate investor seeking guidance on accreditation process and suitable investment options.',
    'email',
    'anytime',
    'qualified'
);

-- Update investment funding based on user investments
UPDATE investments
SET current_funding = (
    SELECT COALESCE(SUM(ui.amount_invested), 0)
    FROM user_investments ui
    WHERE ui.investment_id = investments.id
);

UPDATE investments
SET funded_percent = CASE
    WHEN total_raise > 0
    THEN LEAST(100, (current_funding / total_raise) * 100)
    ELSE 0
END;
