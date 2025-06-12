-- ============================================================================
-- LV Capital Partners - Realistic Investment Data Migration
-- ============================================================================
-- This migration adds comprehensive realistic investment data for demonstration

-- Insert realistic investment deals
INSERT INTO investment_deals (
  id, title, description, property_type, location, asset_class,
  target_irr, projected_hold_period, minimum_investment, maximum_investment,
  total_project_cost, target_raise, current_commitments, funding_deadline,
  expected_closing_date, status, risk_profile, key_highlights, financial_summary,
  documents, images, created_at, updated_at
) VALUES
-- Deal 1: Manhattan Luxury Tower
(
  'deal_manhattan_tower',
  'Manhattan Luxury Residential Tower',
  'Premium 45-story residential tower in Midtown Manhattan featuring 180 luxury condominiums with world-class amenities. Located three blocks from Central Park with unobstructed city views. The building features a 24-hour concierge, fitness center, rooftop terrace, and resident lounge.',
  'Multifamily',
  'New York, NY',
  'Core Plus',
  15.5,
  5,
  100000,
  2000000,
  285000000,
  75000000,
  52000000,
  '2024-12-31',
  '2025-03-15',
  'active',
  'Medium',
  ARRAY[
    'Prime Midtown Manhattan location',
    'Three blocks from Central Park',
    'Experienced developer with 20+ year track record',
    'Pre-construction pricing advantage',
    'Strong rental market fundamentals',
    'Limited new construction in the area'
  ],
  JSONB_BUILD_OBJECT(
    'acquisition_cost', 185000000,
    'construction_cost', 75000000,
    'total_project_cost', 285000000,
    'loan_amount', 200000000,
    'equity_multiple', 1.85,
    'cash_on_cash', 12.5,
    'cap_rate', 4.2,
    'debt_service_coverage', 1.35
  ),
  ARRAY['offering_memorandum.pdf', 'financial_projections.xlsx', 'architectural_plans.pdf'],
  ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800'],
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '5 days'
),

-- Deal 2: Austin Tech Campus
(
  'deal_austin_tech',
  'Austin Innovation Tech Campus',
  'State-of-the-art 15-building tech campus spanning 45 acres in Austin''s thriving tech corridor. Fully leased to major technology companies with weighted average lease term of 8.5 years. Campus features modern amenities, fitness centers, and collaborative spaces.',
  'Office',
  'Austin, TX',
  'Core',
  12.8,
  7,
  250000,
  5000000,
  420000000,
  125000000,
  98000000,
  '2025-01-31',
  '2025-04-01',
  'active',
  'Low',
  ARRAY[
    'Fully leased to investment-grade tenants',
    'Austin''s fastest-growing tech market',
    'LEED Platinum certified buildings',
    'Long-term lease agreements in place',
    'On-site amenities and parking',
    'Opportunity for rental growth'
  ],
  JSONB_BUILD_OBJECT(
    'acquisition_cost', 320000000,
    'improvement_costs', 35000000,
    'total_project_cost', 420000000,
    'loan_amount', 295000000,
    'equity_multiple', 1.65,
    'cash_on_cash', 11.2,
    'cap_rate', 5.8,
    'debt_service_coverage', 1.42
  ),
  ARRAY['investment_summary.pdf', 'tenant_roll.xlsx', 'market_analysis.pdf'],
  ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'],
  NOW() - INTERVAL '45 days',
  NOW() - INTERVAL '10 days'
),

-- Deal 3: Miami Mixed-Use Development
(
  'deal_miami_mixed',
  'Miami Beach Mixed-Use Development',
  'Luxury mixed-use development in South Beach featuring 200 residential units, 50,000 sq ft of premium retail space, and a boutique hotel. Located two blocks from the beach with panoramic ocean views. Project includes world-class amenities and rooftop dining.',
  'Mixed Use',
  'Miami Beach, FL',
  'Value Add',
  18.2,
  4,
  150000,
  3000000,
  195000000,
  58000000,
  31000000,
  '2024-11-30',
  '2025-02-15',
  'active',
  'Medium-High',
  ARRAY[
    'Prime South Beach location',
    'Two blocks from beach access',
    'Mixed-use income diversification',
    'Strong tourism and rental market',
    'Luxury amenities and finishes',
    'Experienced Miami developer'
  ],
  JSONB_BUILD_OBJECT(
    'acquisition_cost', 125000000,
    'construction_cost', 45000000,
    'total_project_cost', 195000000,
    'loan_amount', 137000000,
    'equity_multiple', 2.15,
    'cash_on_cash', 14.8,
    'cap_rate', 6.1,
    'debt_service_coverage', 1.28
  ),
  ARRAY['feasibility_study.pdf', 'development_timeline.pdf', 'market_comps.xlsx'],
  ARRAY['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'],
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '3 days'
),

-- Deal 4: Denver Industrial Portfolio
(
  'deal_denver_industrial',
  'Denver Metro Industrial Portfolio',
  'Portfolio of 12 modern industrial properties totaling 2.1M square feet across Denver metro area. Properties feature high ceilings, dock-high loading, and proximity to major transportation corridors. Strong e-commerce and logistics tenant base.',
  'Industrial',
  'Denver, CO',
  'Core Plus',
  14.3,
  6,
  200000,
  4000000,
  312000000,
  95000000,
  67000000,
  '2025-02-28',
  '2025-05-01',
  'active',
  'Medium',
  ARRAY[
    'Portfolio of 12 stabilized properties',
    'Strategic Denver metro locations',
    'Strong e-commerce tenant demand',
    'Below-market rental rates',
    'Value-add opportunities',
    'Diversified tenant base'
  ],
  JSONB_BUILD_OBJECT(
    'acquisition_cost', 240000000,
    'improvement_costs', 25000000,
    'total_project_cost', 312000000,
    'loan_amount', 217000000,
    'equity_multiple', 1.78,
    'cash_on_cash', 13.1,
    'cap_rate', 5.4,
    'debt_service_coverage', 1.38
  ),
  ARRAY['portfolio_summary.pdf', 'property_details.xlsx', 'rent_rolls.pdf'],
  ARRAY['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800', 'https://images.unsplash.com/photo-1565183997408-2ba19e11490e?w=800'],
  NOW() - INTERVAL '35 days',
  NOW() - INTERVAL '7 days'
),

-- Deal 5: Phoenix Luxury Apartments
(
  'deal_phoenix_luxury',
  'Phoenix Luxury Apartment Community',
  'Class A luxury apartment community featuring 285 units across 18 acres in North Scottsdale. Resort-style amenities including multiple pools, fitness center, spa, and golf simulator. Located in highly rated school district with mountain views.',
  'Multifamily',
  'Scottsdale, AZ',
  'Core',
  13.7,
  6,
  175000,
  2500000,
  168000000,
  52000000,
  38000000,
  '2025-01-15',
  '2025-03-01',
  'active',
  'Low-Medium',
  ARRAY[
    'Class A luxury amenities',
    'North Scottsdale location',
    'Strong rental growth market',
    'Resort-style community',
    'Mountain and desert views',
    'Top-rated school district'
  ],
  JSONB_BUILD_OBJECT(
    'acquisition_cost', 135000000,
    'improvement_costs', 15000000,
    'total_project_cost', 168000000,
    'loan_amount', 116000000,
    'equity_multiple', 1.72,
    'cash_on_cash', 12.3,
    'cap_rate', 4.8,
    'debt_service_coverage', 1.41
  ),
  ARRAY['investment_overview.pdf', 'operating_projections.xlsx', 'comparable_sales.pdf'],
  ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
  NOW() - INTERVAL '25 days',
  NOW() - INTERVAL '2 days'
),

-- Deal 6: Seattle Office Tower
(
  'deal_seattle_office',
  'Seattle Downtown Class A Office Tower',
  'Premium 32-story office tower in Seattle''s central business district. Recently renovated with modern amenities and energy-efficient systems. Strong tenant roster including major tech companies. Walking distance to transit and amenities.',
  'Office',
  'Seattle, WA',
  'Core Plus',
  16.1,
  5,
  300000,
  6000000,
  245000000,
  73000000,
  45000000,
  '2024-12-15',
  '2025-02-28',
  'active',
  'Medium',
  ARRAY[
    'Prime downtown Seattle location',
    'Recently renovated building',
    'Strong tech tenant base',
    'Transit-oriented location',
    'Energy-efficient systems',
    'Below-market acquisition price'
  ],
  JSONB_BUILD_OBJECT(
    'acquisition_cost', 195000000,
    'renovation_costs', 25000000,
    'total_project_cost', 245000000,
    'loan_amount', 172000000,
    'equity_multiple', 1.89,
    'cash_on_cash', 13.8,
    'cap_rate', 5.2,
    'debt_service_coverage', 1.33
  ),
  ARRAY['due_diligence_report.pdf', 'lease_abstracts.xlsx', 'capital_plan.pdf'],
  ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800'],
  NOW() - INTERVAL '40 days',
  NOW() - INTERVAL '8 days'
);

-- Insert sample user investments for realistic portfolio data
-- Note: These user_id values should match actual Clerk user IDs in production
INSERT INTO user_investments (
  id, user_id, deal_id, amount_invested, investment_date,
  current_value, status, commitment_date, created_at, updated_at
) VALUES
-- Sample investor 1 - Diversified portfolio
('inv_user1_manhattan', 'user_sample_1', 'deal_manhattan_tower', 250000, '2024-01-15', 334000, 'active', '2023-12-01', NOW() - INTERVAL '300 days', NOW() - INTERVAL '10 days'),
('inv_user1_austin', 'user_sample_1', 'deal_austin_tech', 150000, '2024-02-20', 195000, 'active', '2024-01-15', NOW() - INTERVAL '250 days', NOW() - INTERVAL '5 days'),
('inv_user1_miami', 'user_sample_1', 'deal_miami_mixed', 100000, '2024-03-10', 118000, 'active', '2024-02-15', NOW() - INTERVAL '200 days', NOW() - INTERVAL '3 days'),
('inv_user1_denver', 'user_sample_1', 'deal_denver_industrial', 200000, '2024-04-05', 285000, 'active', '2024-03-20', NOW() - INTERVAL '150 days', NOW() - INTERVAL '7 days'),

-- Sample investor 2 - High net worth concentrated positions
('inv_user2_austin', 'user_sample_2', 'deal_austin_tech', 500000, '2024-01-10', 650000, 'active', '2023-12-15', NOW() - INTERVAL '320 days', NOW() - INTERVAL '12 days'),
('inv_user2_seattle', 'user_sample_2', 'deal_seattle_office', 750000, '2024-02-28', 885000, 'active', '2024-01-30', NOW() - INTERVAL '280 days', NOW() - INTERVAL '8 days'),
('inv_user2_phoenix', 'user_sample_2', 'deal_phoenix_luxury', 300000, '2024-03-15', 342000, 'active', '2024-02-25', NOW() - INTERVAL '220 days', NOW() - INTERVAL '4 days'),

-- Sample investor 3 - Conservative growth investor
('inv_user3_phoenix', 'user_sample_3', 'deal_phoenix_luxury', 175000, '2024-02-01', 201000, 'active', '2024-01-10', NOW() - INTERVAL '290 days', NOW() - INTERVAL '6 days'),
('inv_user3_denver', 'user_sample_3', 'deal_denver_industrial', 225000, '2024-03-20', 270000, 'active', '2024-02-28', NOW() - INTERVAL '210 days', NOW() - INTERVAL '9 days');

-- Insert realistic distribution data
INSERT INTO distributions (
  id, user_investment_id, amount, distribution_date, type,
  status, description, tax_year, created_at, updated_at
) VALUES
-- Q1 2024 Distributions
('dist_q1_2024_manhattan_1', 'inv_user1_manhattan', 6250, '2024-03-31', 'quarterly', 'processed', 'Q1 2024 cash flow distribution', 2024, NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days'),
('dist_q1_2024_austin_1', 'inv_user1_austin', 4200, '2024-03-31', 'quarterly', 'processed', 'Q1 2024 cash flow distribution', 2024, NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days'),
('dist_q1_2024_austin_2', 'inv_user2_austin', 14000, '2024-03-31', 'quarterly', 'processed', 'Q1 2024 cash flow distribution', 2024, NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days'),

-- Q2 2024 Distributions
('dist_q2_2024_manhattan_1', 'inv_user1_manhattan', 7100, '2024-06-30', 'quarterly', 'processed', 'Q2 2024 cash flow distribution', 2024, NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
('dist_q2_2024_austin_1', 'inv_user1_austin', 4750, '2024-06-30', 'quarterly', 'processed', 'Q2 2024 cash flow distribution', 2024, NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
('dist_q2_2024_austin_2', 'inv_user2_austin', 15800, '2024-06-30', 'quarterly', 'processed', 'Q2 2024 cash flow distribution', 2024, NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),
('dist_q2_2024_seattle_2', 'inv_user2_seattle', 18500, '2024-06-30', 'quarterly', 'processed', 'Q2 2024 cash flow distribution', 2024, NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days'),

-- Q3 2024 Distributions
('dist_q3_2024_manhattan_1', 'inv_user1_manhattan', 7850, '2024-09-30', 'quarterly', 'processed', 'Q3 2024 cash flow distribution', 2024, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('dist_q3_2024_austin_1', 'inv_user1_austin', 5200, '2024-09-30', 'quarterly', 'processed', 'Q3 2024 cash flow distribution', 2024, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('dist_q3_2024_miami_1', 'inv_user1_miami', 3400, '2024-09-30', 'quarterly', 'processed', 'Q3 2024 cash flow distribution', 2024, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('dist_q3_2024_denver_1', 'inv_user1_denver', 6800, '2024-09-30', 'quarterly', 'processed', 'Q3 2024 cash flow distribution', 2024, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('dist_q3_2024_austin_2', 'inv_user2_austin', 17200, '2024-09-30', 'quarterly', 'processed', 'Q3 2024 cash flow distribution', 2024, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('dist_q3_2024_seattle_2', 'inv_user2_seattle', 20100, '2024-09-30', 'quarterly', 'processed', 'Q3 2024 cash flow distribution', 2024, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('dist_q3_2024_phoenix_2', 'inv_user2_phoenix', 8900, '2024-09-30', 'quarterly', 'processed', 'Q3 2024 cash flow distribution', 2024, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('dist_q3_2024_phoenix_3', 'inv_user3_phoenix', 5200, '2024-09-30', 'quarterly', 'processed', 'Q3 2024 cash flow distribution', 2024, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('dist_q3_2024_denver_3', 'inv_user3_denver', 7650, '2024-09-30', 'quarterly', 'processed', 'Q3 2024 cash flow distribution', 2024, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),

-- Special distributions (partial exits, refinancing, etc.)
('dist_special_2024_denver_1', 'inv_user1_denver', 25000, '2024-08-15', 'refinancing', 'processed', 'Refinancing cash-out distribution', 2024, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days'),
('dist_special_2024_denver_3', 'inv_user3_denver', 28000, '2024-08-15', 'refinancing', 'processed', 'Refinancing cash-out distribution', 2024, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days');

-- Insert user profiles for the sample investors
INSERT INTO user_profiles (
  id, user_id, email, first_name, last_name,
  accredited_status, verification_date, phone, address,
  investment_experience, risk_tolerance, investment_goals,
  created_at, updated_at
) VALUES
('profile_user_1', 'user_sample_1', 'investor1@example.com', 'Sarah', 'Johnson',
 'verified', '2023-11-15', '+1-555-0123',
 JSONB_BUILD_OBJECT('street', '123 Park Avenue', 'city', 'New York', 'state', 'NY', 'zip', '10016'),
 'Experienced', 'Moderate', 'Long-term wealth preservation and growth',
 NOW() - INTERVAL '365 days', NOW() - INTERVAL '10 days'),

('profile_user_2', 'user_sample_2', 'investor2@example.com', 'Michael', 'Chen',
 'verified', '2023-12-01', '+1-555-0456',
 JSONB_BUILD_OBJECT('street', '456 California Street', 'city', 'San Francisco', 'state', 'CA', 'zip', '94104'),
 'Expert', 'Aggressive', 'High-growth real estate investments',
 NOW() - INTERVAL '350 days', NOW() - INTERVAL '5 days'),

('profile_user_3', 'user_sample_3', 'investor3@example.com', 'Emily', 'Rodriguez',
 'verified', '2024-01-10', '+1-555-0789',
 JSONB_BUILD_OBJECT('street', '789 Ocean Drive', 'city', 'Miami', 'state', 'FL', 'zip', '33139'),
 'Intermediate', 'Conservative', 'Stable income with capital preservation',
 NOW() - INTERVAL '300 days', NOW() - INTERVAL '3 days');

-- Update deal current commitments based on user investments
UPDATE investment_deals
SET current_commitments = (
  SELECT COALESCE(SUM(amount_invested), 0)
  FROM user_investments
  WHERE deal_id = investment_deals.id
)
WHERE id IN (
  'deal_manhattan_tower', 'deal_austin_tech', 'deal_miami_mixed',
  'deal_denver_industrial', 'deal_phoenix_luxury', 'deal_seattle_office'
);

-- Insert document records for the deals
INSERT INTO documents (
  id, deal_id, user_id, filename, file_type, file_size,
  description, category, is_public, created_at, updated_at
) VALUES
-- Manhattan Tower documents
('doc_manhattan_offering', 'deal_manhattan_tower', NULL, 'manhattan_tower_offering_memorandum.pdf', 'application/pdf', 2456789, 'Complete offering memorandum', 'offering', true, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('doc_manhattan_financial', 'deal_manhattan_tower', NULL, 'manhattan_financial_projections.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 856432, 'Financial projections and analysis', 'financial', true, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
('doc_manhattan_plans', 'deal_manhattan_tower', NULL, 'manhattan_architectural_plans.pdf', 'application/pdf', 15678954, 'Architectural plans and renderings', 'technical', true, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),

-- Austin Tech documents
('doc_austin_summary', 'deal_austin_tech', NULL, 'austin_tech_investment_summary.pdf', 'application/pdf', 1789456, 'Investment summary and overview', 'offering', true, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days'),
('doc_austin_tenants', 'deal_austin_tech', NULL, 'austin_tech_tenant_roll.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 567891, 'Current tenant roll and lease details', 'financial', true, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days'),

-- Miami Mixed-Use documents
('doc_miami_feasibility', 'deal_miami_mixed', NULL, 'miami_feasibility_study.pdf', 'application/pdf', 3245789, 'Market feasibility and development study', 'technical', true, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('doc_miami_timeline', 'deal_miami_mixed', NULL, 'miami_development_timeline.pdf', 'application/pdf', 1234567, 'Development timeline and milestones', 'technical', true, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_investments_user_id ON user_investments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_investments_deal_id ON user_investments(deal_id);
CREATE INDEX IF NOT EXISTS idx_distributions_user_investment_id ON distributions(user_investment_id);
CREATE INDEX IF NOT EXISTS idx_distributions_date ON distributions(distribution_date);
CREATE INDEX IF NOT EXISTS idx_investment_deals_status ON investment_deals(status);
CREATE INDEX IF NOT EXISTS idx_investment_deals_asset_class ON investment_deals(asset_class);
CREATE INDEX IF NOT EXISTS idx_documents_deal_id ON documents(deal_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Create a view for portfolio summary calculations
CREATE OR REPLACE VIEW portfolio_summary AS
SELECT
  ui.user_id,
  COUNT(ui.id) as total_investments,
  SUM(ui.amount_invested) as total_invested,
  SUM(ui.current_value) as total_current_value,
  SUM(ui.current_value - ui.amount_invested) as total_unrealized_gains,
  ROUND(
    CASE
      WHEN SUM(ui.amount_invested) > 0
      THEN ((SUM(ui.current_value) - SUM(ui.amount_invested)) / SUM(ui.amount_invested) * 100)
      ELSE 0
    END, 2
  ) as overall_return_percentage,
  COALESCE(SUM(d.total_distributions), 0) as total_distributions,
  ROUND(
    CASE
      WHEN SUM(ui.amount_invested) > 0
      THEN (COALESCE(SUM(d.total_distributions), 0) / SUM(ui.amount_invested) * 100)
      ELSE 0
    END, 2
  ) as distribution_yield
FROM user_investments ui
LEFT JOIN (
  SELECT
    user_investment_id,
    SUM(amount) as total_distributions
  FROM distributions
  WHERE status = 'processed'
  GROUP BY user_investment_id
) d ON d.user_investment_id = ui.id
WHERE ui.status = 'active'
GROUP BY ui.user_id;

-- Create function to calculate IRR (simplified version)
CREATE OR REPLACE FUNCTION calculate_portfolio_irr(p_user_id TEXT, p_as_of_date DATE DEFAULT CURRENT_DATE)
RETURNS DECIMAL(5,2) AS $$
DECLARE
  total_invested DECIMAL;
  total_current_value DECIMAL;
  total_distributions DECIMAL;
  avg_hold_period_years DECIMAL;
  simple_irr DECIMAL;
BEGIN
  -- Get portfolio totals
  SELECT
    COALESCE(SUM(ui.amount_invested), 0),
    COALESCE(SUM(ui.current_value), 0),
    COALESCE(SUM(d.dist_amount), 0),
    COALESCE(AVG(EXTRACT(YEAR FROM AGE(p_as_of_date, ui.investment_date)) +
                 EXTRACT(MONTH FROM AGE(p_as_of_date, ui.investment_date))/12.0), 1)
  INTO
    total_invested,
    total_current_value,
    total_distributions,
    avg_hold_period_years
  FROM user_investments ui
  LEFT JOIN (
    SELECT user_investment_id, SUM(amount) as dist_amount
    FROM distributions
    WHERE status = 'processed'
    GROUP BY user_investment_id
  ) d ON d.user_investment_id = ui.id
  WHERE ui.user_id = p_user_id AND ui.status = 'active';

  -- Simple IRR calculation (not true IRR but reasonable approximation)
  IF total_invested > 0 AND avg_hold_period_years > 0 THEN
    simple_irr := (POWER((total_current_value + total_distributions) / total_invested, 1.0/avg_hold_period_years) - 1) * 100;
    RETURN ROUND(simple_irr, 2);
  ELSE
    RETURN 0.00;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT SELECT ON portfolio_summary TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_portfolio_irr(TEXT, DATE) TO authenticated;

-- Refresh the materialized views if they exist
-- This is for future use when we add materialized views for performance
-- REFRESH MATERIALIZED VIEW CONCURRENTLY mv_portfolio_analytics;

COMMIT;
