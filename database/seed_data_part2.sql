-- TechCorp Inc. - Seed Data Part 2
-- Projects, Finances, Leave Requests, Payroll, Expenses

-- Insert Projects
INSERT INTO projects (project_code, name, description, status, budget, spent, start_date, end_date, department_id) VALUES
('PROJ-2024-001', 'Mobile App Redesign', 'Complete overhaul of iOS and Android mobile applications with new UI/UX', 'active', 800000.00, 450000.00, '2024-01-15', '2024-06-30', 1),
('PROJ-2024-002', 'AI-Powered Analytics Dashboard', 'Build ML-powered analytics platform for enterprise customers', 'active', 1200000.00, 320000.00, '2024-02-01', '2024-08-31', 1),
('PROJ-2024-003', 'API v3 Migration', 'Migrate all customers to new REST API v3 with GraphQL support', 'active', 600000.00, 180000.00, '2024-03-01', '2024-07-15', 1),
('PROJ-2023-015', 'Enterprise Security Audit', 'SOC 2 Type II compliance and security improvements', 'completed', 400000.00, 385000.00, '2023-06-01', '2023-12-31', 1),
('PROJ-2024-004', 'Customer Portal Rebuild', 'New self-service customer portal with billing integration', 'planning', 500000.00, 0.00, '2024-05-01', '2024-10-31', 1),
('PROJ-2024-005', 'Global Expansion - EMEA', 'Expand sales and marketing operations to Europe', 'active', 2000000.00, 650000.00, '2024-01-01', '2024-12-31', 4),
('PROJ-2024-006', 'Brand Refresh Campaign', 'Complete rebrand with new website and marketing materials', 'active', 350000.00, 120000.00, '2024-02-15', '2024-05-31', 5),
('PROJ-2024-007', 'HR System Upgrade', 'Implement new HRIS and applicant tracking system', 'planning', 250000.00, 0.00, '2024-04-01', '2024-09-30', 6);

-- Insert Project Assignments
INSERT INTO project_assignments (project_id, employee_id, role, allocation_percentage, start_date, end_date) VALUES
-- Mobile App Redesign
(1, 8, 'Engineering Lead', 80, '2024-01-15', '2024-06-30'),
(1, 14, 'Senior Engineer', 100, '2024-01-15', '2024-06-30'),
(1, 15, 'Senior Engineer', 100, '2024-01-15', '2024-06-30'),
(1, 18, 'Engineer', 100, '2024-01-15', '2024-06-30'),
(1, 19, 'Engineer', 100, '2024-01-15', '2024-06-30'),
(1, 33, 'UX Lead', 60, '2024-01-15', '2024-06-30'),
(1, 34, 'UI Designer', 80, '2024-01-15', '2024-06-30'),
(1, 27, 'Product Manager', 50, '2024-01-15', '2024-06-30'),

-- AI Analytics Dashboard
(2, 7, 'Engineering Lead', 60, '2024-02-01', '2024-08-31'),
(2, 10, 'Staff Engineer - ML', 100, '2024-02-01', '2024-08-31'),
(2, 11, 'Staff Engineer - Backend', 100, '2024-02-01', '2024-08-31'),
(2, 12, 'Senior Engineer', 100, '2024-02-01', '2024-08-31'),
(2, 16, 'Engineer', 100, '2024-02-01', '2024-08-31'),
(2, 28, 'Product Manager', 80, '2024-02-01', '2024-08-31'),
(2, 35, 'UX Designer', 40, '2024-02-01', '2024-08-31'),

-- API v3 Migration
(3, 9, 'Engineering Lead', 70, '2024-03-01', '2024-07-15'),
(3, 13, 'Senior Engineer', 100, '2024-03-01', '2024-07-15'),
(3, 17, 'Engineer', 100, '2024-03-01', '2024-07-15'),
(3, 22, 'DevOps Lead', 60, '2024-03-01', '2024-07-15'),
(3, 29, 'Product Manager', 60, '2024-03-01', '2024-07-15'),

-- Global Expansion
(5, 37, 'Sales Lead', 40, '2024-01-01', '2024-12-31'),
(5, 38, 'Enterprise Sales', 60, '2024-01-01', '2024-12-31'),
(5, 40, 'Account Executive', 80, '2024-01-01', '2024-12-31'),
(5, 45, 'Marketing Lead', 30, '2024-01-01', '2024-12-31'),
(5, 46, 'Marketing Manager', 50, '2024-01-01', '2024-12-31'),

-- Brand Refresh
(6, 32, 'Design Lead', 70, '2024-02-15', '2024-05-31'),
(6, 33, 'UX Designer', 40, '2024-02-15', '2024-05-31'),
(6, 34, 'UI Designer', 20, '2024-02-15', '2024-05-31'),
(6, 47, 'Content Lead', 80, '2024-02-15', '2024-05-31'),
(6, 48, 'Growth Marketing', 60, '2024-02-15', '2024-05-31');

-- Insert Leave Requests
INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, days, status, reason, approved_by) VALUES
-- Approved leaves
(12, 'vacation', '2024-03-15', '2024-03-22', 6, 'approved', 'Family vacation to Hawaii', 7),
(15, 'vacation', '2024-04-01', '2024-04-05', 5, 'approved', 'Spring break trip', 8),
(27, 'parental', '2024-02-01', '2024-05-01', 65, 'approved', 'Parental leave for new baby', 26),
(33, 'vacation', '2024-05-20', '2024-05-31', 10, 'approved', 'Europe trip', 32),
(40, 'sick', '2024-02-10', '2024-02-12', 3, 'approved', 'Flu recovery', 38),
(48, 'personal', '2024-03-25', '2024-03-26', 2, 'approved', 'Personal matters', 46),

-- Pending leaves
(18, 'vacation', '2024-06-10', '2024-06-21', 10, 'pending', 'Summer vacation', NULL),
(22, 'vacation', '2024-07-01', '2024-07-12', 10, 'pending', 'Family reunion', NULL),
(35, 'vacation', '2024-05-01', '2024-05-10', 8, 'pending', 'Wedding in Italy', NULL),
(51, 'sick', '2024-02-20', '2024-02-21', 2, 'pending', 'Medical appointment', NULL);

-- Insert Payroll Records (Last 3 months)
-- January 2024
INSERT INTO payroll_records (employee_id, pay_period_start, pay_period_end, gross_pay, deductions, net_pay, status, payment_date) 
SELECT 
    id,
    '2024-01-01'::date,
    '2024-01-15'::date,
    salary / 24, -- Semi-monthly
    (salary / 24) * 0.25, -- 25% deductions (taxes, benefits, etc.)
    (salary / 24) * 0.75,
    'paid',
    '2024-01-15'::date
FROM employees WHERE status = 'active';

-- February 2024
INSERT INTO payroll_records (employee_id, pay_period_start, pay_period_end, gross_pay, deductions, net_pay, status, payment_date) 
SELECT 
    id,
    '2024-02-01'::date,
    '2024-02-15'::date,
    salary / 24,
    (salary / 24) * 0.25,
    (salary / 24) * 0.75,
    'paid',
    '2024-02-15'::date
FROM employees WHERE status = 'active';

-- March 2024 (pending)
INSERT INTO payroll_records (employee_id, pay_period_start, pay_period_end, gross_pay, deductions, net_pay, status, payment_date) 
SELECT 
    id,
    '2024-03-01'::date,
    '2024-03-15'::date,
    salary / 24,
    (salary / 24) * 0.25,
    (salary / 24) * 0.75,
    'pending',
    NULL
FROM employees WHERE status = 'active';

-- Insert Expense Reports
INSERT INTO expense_reports (employee_id, project_id, category, amount, description, expense_date, status, approved_by) VALUES
-- Approved expenses
(10, 2, 'software', 2500.00, 'ML development tools and cloud GPU credits', '2024-02-05', 'approved', 7),
(14, 1, 'equipment', 3200.00, 'MacBook Pro M3 for mobile development', '2024-01-20', 'approved', 8),
(22, 3, 'software', 1800.00, 'Infrastructure monitoring and deployment tools', '2024-03-01', 'approved', 9),
(27, 1, 'travel', 2100.00, 'Flight and hotel for customer research in NYC', '2024-02-15', 'approved', 26),
(33, 6, 'software', 850.00, 'Adobe Creative Cloud and Figma licenses', '2024-02-20', 'approved', 32),
(38, 5, 'travel', 4500.00, 'Business trip to London for EMEA expansion', '2024-02-10', 'approved', 37),
(40, 5, 'meals', 320.00, 'Client dinner in San Francisco', '2024-02-25', 'approved', 38),
(47, 6, 'software', 450.00, 'Content creation and SEO tools', '2024-03-01', 'approved', 46),

-- Pending expenses
(12, 2, 'travel', 1800.00, 'Conference attendance - AI Summit 2024', '2024-03-10', 'pending', NULL),
(18, 1, 'equipment', 450.00, 'External monitor and accessories', '2024-03-12', 'pending', NULL),
(35, 6, 'software', 299.00, 'Stock photo subscription', '2024-03-15', 'pending', NULL),
(42, 5, 'meals', 180.00, 'Client lunch meeting', '2024-03-18', 'pending', NULL),

-- Rejected expenses
(20, NULL, 'other', 800.00, 'Personal laptop upgrade', '2024-02-28', 'rejected', 7);

-- Insert Budget Allocations (2024 - Q1 & Q2)
INSERT INTO budget_allocations (department_id, fiscal_year, quarter, category, allocated, spent) VALUES
-- Engineering - Q1 2024
(1, 2024, 1, 'salaries', 1800000.00, 1800000.00),
(1, 2024, 1, 'infrastructure', 400000.00, 285000.00),
(1, 2024, 1, 'r_and_d', 300000.00, 180000.00),
(1, 2024, 1, 'operations', 200000.00, 145000.00),

-- Engineering - Q2 2024
(1, 2024, 2, 'salaries', 1850000.00, 920000.00),
(1, 2024, 2, 'infrastructure', 420000.00, 180000.00),
(1, 2024, 2, 'r_and_d', 320000.00, 95000.00),
(1, 2024, 2, 'operations', 210000.00, 78000.00),

-- Sales - Q1 2024
(4, 2024, 1, 'salaries', 750000.00, 750000.00),
(4, 2024, 1, 'marketing', 200000.00, 185000.00),
(4, 2024, 1, 'operations', 150000.00, 125000.00),

-- Sales - Q2 2024
(4, 2024, 2, 'salaries', 780000.00, 390000.00),
(4, 2024, 2, 'marketing', 250000.00, 95000.00),
(4, 2024, 2, 'operations', 160000.00, 62000.00),

-- Marketing - Q1 2024
(5, 2024, 1, 'salaries', 420000.00, 420000.00),
(5, 2024, 1, 'marketing', 180000.00, 165000.00),
(5, 2024, 1, 'operations', 80000.00, 68000.00),

-- Marketing - Q2 2024
(5, 2024, 2, 'salaries', 440000.00, 220000.00),
(5, 2024, 2, 'marketing', 200000.00, 75000.00),
(5, 2024, 2, 'operations', 85000.00, 32000.00),

-- HR - Q1 2024
(6, 2024, 1, 'salaries', 220000.00, 220000.00),
(6, 2024, 1, 'operations', 80000.00, 65000.00),

-- HR - Q2 2024
(6, 2024, 2, 'salaries', 230000.00, 115000.00),
(6, 2024, 2, 'operations', 85000.00, 28000.00),

-- Finance - Q1 2024
(7, 2024, 1, 'salaries', 180000.00, 180000.00),
(7, 2024, 1, 'operations', 70000.00, 52000.00),

-- Finance - Q2 2024
(7, 2024, 2, 'salaries', 190000.00, 95000.00),
(7, 2024, 2, 'operations', 75000.00, 25000.00);
