-- TechCorp Inc. - Seed Data
-- A realistic mid-sized tech company (150 employees)

-- Insert Departments
INSERT INTO departments (name, code, budget) VALUES
('Engineering', 'ENG', 5000000.00),
('Product', 'PROD', 1500000.00),
('Design', 'DES', 800000.00),
('Sales', 'SALES', 2000000.00),
('Marketing', 'MKT', 1200000.00),
('Human Resources', 'HR', 600000.00),
('Finance', 'FIN', 500000.00),
('Operations', 'OPS', 1000000.00),
('Customer Success', 'CS', 900000.00),
('Legal', 'LEGAL', 400000.00);

-- Insert Employees (Leadership first, then teams)
-- CEO & C-Suite
INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, level, salary, hire_date, location, manager_id) VALUES
('EMP001', 'Sarah', 'Chen', 'sarah.chen@techcorp.com', '+1-555-0101', 7, 'Chief Executive Officer', 'Executive', 350000.00, '2018-01-15', 'San Francisco', NULL),
('EMP002', 'Michael', 'Rodriguez', 'michael.rodriguez@techcorp.com', '+1-555-0102', 1, 'Chief Technology Officer', 'Executive', 320000.00, '2018-03-01', 'San Francisco', 1),
('EMP003', 'Jennifer', 'Park', 'jennifer.park@techcorp.com', '+1-555-0103', 2, 'Chief Product Officer', 'Executive', 300000.00, '2018-06-15', 'San Francisco', 1),
('EMP004', 'David', 'Thompson', 'david.thompson@techcorp.com', '+1-555-0104', 7, 'Chief Financial Officer', 'Executive', 310000.00, '2019-01-10', 'San Francisco', 1),
('EMP005', 'Lisa', 'Anderson', 'lisa.anderson@techcorp.com', '+1-555-0105', 6, 'Chief People Officer', 'Executive', 280000.00, '2019-04-01', 'San Francisco', 1);

-- Engineering Department (40 people)
INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, level, salary, hire_date, location, manager_id) VALUES
('EMP006', 'James', 'Wilson', 'james.wilson@techcorp.com', '+1-555-0106', 1, 'VP of Engineering', 'Director', 250000.00, '2019-07-01', 'San Francisco', 2),
('EMP007', 'Emily', 'Davis', 'emily.davis@techcorp.com', '+1-555-0107', 1, 'Engineering Manager - Backend', 'Manager', 180000.00, '2020-02-15', 'San Francisco', 6),
('EMP008', 'Robert', 'Martinez', 'robert.martinez@techcorp.com', '+1-555-0108', 1, 'Engineering Manager - Frontend', 'Manager', 175000.00, '2020-03-01', 'Remote', 6),
('EMP009', 'Amanda', 'Taylor', 'amanda.taylor@techcorp.com', '+1-555-0109', 1, 'Engineering Manager - Platform', 'Manager', 185000.00, '2020-05-10', 'Austin', 6),
('EMP010', 'Christopher', 'Lee', 'christopher.lee@techcorp.com', '+1-555-0110', 1, 'Staff Software Engineer', 'Staff', 220000.00, '2019-09-01', 'San Francisco', 7),
('EMP011', 'Jessica', 'White', 'jessica.white@techcorp.com', '+1-555-0111', 1, 'Staff Software Engineer', 'Staff', 215000.00, '2020-01-15', 'Remote', 7),
('EMP012', 'Daniel', 'Harris', 'daniel.harris@techcorp.com', '+1-555-0112', 1, 'Senior Software Engineer', 'Senior', 180000.00, '2020-06-01', 'San Francisco', 7),
('EMP013', 'Ashley', 'Clark', 'ashley.clark@techcorp.com', '+1-555-0113', 1, 'Senior Software Engineer', 'Senior', 175000.00, '2020-08-15', 'Austin', 7),
('EMP014', 'Matthew', 'Lewis', 'matthew.lewis@techcorp.com', '+1-555-0114', 1, 'Senior Software Engineer', 'Senior', 178000.00, '2021-01-10', 'Remote', 8),
('EMP015', 'Stephanie', 'Walker', 'stephanie.walker@techcorp.com', '+1-555-0115', 1, 'Senior Software Engineer', 'Senior', 172000.00, '2021-03-01', 'San Francisco', 8),
('EMP016', 'Joshua', 'Hall', 'joshua.hall@techcorp.com', '+1-555-0116', 1, 'Software Engineer', 'Mid', 140000.00, '2021-06-15', 'Austin', 7),
('EMP017', 'Michelle', 'Allen', 'michelle.allen@techcorp.com', '+1-555-0117', 1, 'Software Engineer', 'Mid', 138000.00, '2021-08-01', 'Remote', 7),
('EMP018', 'Ryan', 'Young', 'ryan.young@techcorp.com', '+1-555-0118', 1, 'Software Engineer', 'Mid', 142000.00, '2022-01-15', 'San Francisco', 8),
('EMP019', 'Lauren', 'King', 'lauren.king@techcorp.com', '+1-555-0119', 1, 'Software Engineer', 'Mid', 135000.00, '2022-03-01', 'Austin', 8),
('EMP020', 'Brandon', 'Wright', 'brandon.wright@techcorp.com', '+1-555-0120', 1, 'Junior Software Engineer', 'Junior', 110000.00, '2023-01-10', 'Remote', 7),
('EMP021', 'Samantha', 'Lopez', 'samantha.lopez@techcorp.com', '+1-555-0121', 1, 'Junior Software Engineer', 'Junior', 108000.00, '2023-06-15', 'San Francisco', 7),
('EMP022', 'Kevin', 'Hill', 'kevin.hill@techcorp.com', '+1-555-0122', 1, 'Senior DevOps Engineer', 'Senior', 185000.00, '2020-09-01', 'Austin', 9),
('EMP023', 'Rachel', 'Scott', 'rachel.scott@techcorp.com', '+1-555-0123', 1, 'DevOps Engineer', 'Mid', 145000.00, '2021-11-15', 'Remote', 9),
('EMP024', 'Justin', 'Green', 'justin.green@techcorp.com', '+1-555-0124', 1, 'DevOps Engineer', 'Mid', 142000.00, '2022-05-01', 'San Francisco', 9),
('EMP025', 'Nicole', 'Adams', 'nicole.adams@techcorp.com', '+1-555-0125', 1, 'Senior QA Engineer', 'Senior', 155000.00, '2020-10-15', 'Austin', 6);

-- Product Department (15 people)
INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, level, salary, hire_date, location, manager_id) VALUES
('EMP026', 'Andrew', 'Baker', 'andrew.baker@techcorp.com', '+1-555-0126', 2, 'VP of Product', 'Director', 240000.00, '2019-08-01', 'San Francisco', 3),
('EMP027', 'Megan', 'Nelson', 'megan.nelson@techcorp.com', '+1-555-0127', 2, 'Senior Product Manager', 'Senior', 170000.00, '2020-04-15', 'San Francisco', 26),
('EMP028', 'Tyler', 'Carter', 'tyler.carter@techcorp.com', '+1-555-0128', 2, 'Senior Product Manager', 'Senior', 168000.00, '2020-07-01', 'Remote', 26),
('EMP029', 'Brittany', 'Mitchell', 'brittany.mitchell@techcorp.com', '+1-555-0129', 2, 'Product Manager', 'Mid', 135000.00, '2021-02-15', 'Austin', 26),
('EMP030', 'Jordan', 'Perez', 'jordan.perez@techcorp.com', '+1-555-0130', 2, 'Product Manager', 'Mid', 132000.00, '2021-09-01', 'San Francisco', 26),
('EMP031', 'Alexis', 'Roberts', 'alexis.roberts@techcorp.com', '+1-555-0131', 2, 'Associate Product Manager', 'Junior', 105000.00, '2023-03-15', 'Remote', 27);

-- Design Department (10 people)
INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, level, salary, hire_date, location, manager_id) VALUES
('EMP032', 'Nathan', 'Turner', 'nathan.turner@techcorp.com', '+1-555-0132', 3, 'Head of Design', 'Director', 200000.00, '2019-10-01', 'San Francisco', 3),
('EMP033', 'Olivia', 'Phillips', 'olivia.phillips@techcorp.com', '+1-555-0133', 3, 'Senior UX Designer', 'Senior', 145000.00, '2020-11-15', 'San Francisco', 32),
('EMP034', 'Zachary', 'Campbell', 'zachary.campbell@techcorp.com', '+1-555-0134', 3, 'Senior UI Designer', 'Senior', 142000.00, '2021-01-20', 'Austin', 32),
('EMP035', 'Hannah', 'Parker', 'hannah.parker@techcorp.com', '+1-555-0135', 3, 'UX Designer', 'Mid', 115000.00, '2021-08-10', 'Remote', 32),
('EMP036', 'Ethan', 'Evans', 'ethan.evans@techcorp.com', '+1-555-0136', 3, 'UI Designer', 'Mid', 112000.00, '2022-02-15', 'San Francisco', 32);

-- Sales Department (25 people)
INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, level, salary, hire_date, location, manager_id) VALUES
('EMP037', 'Victoria', 'Edwards', 'victoria.edwards@techcorp.com', '+1-555-0137', 4, 'VP of Sales', 'Director', 230000.00, '2019-05-15', 'San Francisco', 1),
('EMP038', 'Jacob', 'Collins', 'jacob.collins@techcorp.com', '+1-555-0138', 4, 'Sales Manager - Enterprise', 'Manager', 160000.00, '2020-03-20', 'San Francisco', 37),
('EMP039', 'Emma', 'Stewart', 'emma.stewart@techcorp.com', '+1-555-0139', 4, 'Sales Manager - SMB', 'Manager', 155000.00, '2020-06-10', 'Austin', 37),
('EMP040', 'William', 'Sanchez', 'william.sanchez@techcorp.com', '+1-555-0140', 4, 'Senior Account Executive', 'Senior', 130000.00, '2020-09-15', 'San Francisco', 38),
('EMP041', 'Sophia', 'Morris', 'sophia.morris@techcorp.com', '+1-555-0141', 4, 'Senior Account Executive', 'Senior', 128000.00, '2021-01-05', 'Remote', 38),
('EMP042', 'Alexander', 'Rogers', 'alexander.rogers@techcorp.com', '+1-555-0142', 4, 'Account Executive', 'Mid', 105000.00, '2021-07-20', 'Austin', 38),
('EMP043', 'Isabella', 'Reed', 'isabella.reed@techcorp.com', '+1-555-0143', 4, 'Account Executive', 'Mid', 102000.00, '2022-01-10', 'San Francisco', 39),
('EMP044', 'Mason', 'Cook', 'mason.cook@techcorp.com', '+1-555-0144', 4, 'Account Executive', 'Mid', 108000.00, '2022-06-15', 'Remote', 39);

-- Marketing Department (12 people)
INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, level, salary, hire_date, location, manager_id) VALUES
('EMP045', 'Ava', 'Morgan', 'ava.morgan@techcorp.com', '+1-555-0145', 5, 'VP of Marketing', 'Director', 220000.00, '2019-09-10', 'San Francisco', 1),
('EMP046', 'Liam', 'Bell', 'liam.bell@techcorp.com', '+1-555-0146', 5, 'Marketing Manager', 'Manager', 145000.00, '2020-05-15', 'San Francisco', 45),
('EMP047', 'Charlotte', 'Murphy', 'charlotte.murphy@techcorp.com', '+1-555-0147', 5, 'Content Marketing Lead', 'Senior', 125000.00, '2021-03-20', 'Remote', 46),
('EMP048', 'Noah', 'Bailey', 'noah.bailey@techcorp.com', '+1-555-0148', 5, 'Growth Marketing Manager', 'Mid', 115000.00, '2021-09-10', 'Austin', 46);

-- HR Department (8 people)
INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, level, salary, hire_date, location, manager_id) VALUES
('EMP049', 'Grace', 'Rivera', 'grace.rivera@techcorp.com', '+1-555-0149', 6, 'HR Director', 'Director', 180000.00, '2019-11-01', 'San Francisco', 5),
('EMP050', 'Lucas', 'Cooper', 'lucas.cooper@techcorp.com', '+1-555-0150', 6, 'Senior HR Business Partner', 'Senior', 135000.00, '2020-08-15', 'San Francisco', 49),
('EMP051', 'Chloe', 'Richardson', 'chloe.richardson@techcorp.com', '+1-555-0151', 6, 'HR Business Partner', 'Mid', 105000.00, '2021-04-20', 'Austin', 49),
('EMP052', 'Henry', 'Cox', 'henry.cox@techcorp.com', '+1-555-0152', 6, 'Recruiter', 'Mid', 95000.00, '2021-10-15', 'Remote', 49),
('EMP053', 'Lily', 'Howard', 'lily.howard@techcorp.com', '+1-555-0153', 6, 'Recruiter', 'Mid', 92000.00, '2022-03-01', 'San Francisco', 49);

-- Finance Department (10 people)
INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, level, salary, hire_date, location, manager_id) VALUES
('EMP054', 'Jack', 'Ward', 'jack.ward@techcorp.com', '+1-555-0154', 7, 'Finance Director', 'Director', 190000.00, '2019-12-01', 'San Francisco', 4),
('EMP055', 'Zoe', 'Torres', 'zoe.torres@techcorp.com', '+1-555-0155', 7, 'Senior Financial Analyst', 'Senior', 125000.00, '2020-07-20', 'San Francisco', 54),
('EMP056', 'Owen', 'Peterson', 'owen.peterson@techcorp.com', '+1-555-0156', 7, 'Financial Analyst', 'Mid', 95000.00, '2021-05-15', 'Austin', 54),
('EMP057', 'Aria', 'Gray', 'aria.gray@techcorp.com', '+1-555-0157', 7, 'Accountant', 'Mid', 85000.00, '2021-11-10', 'San Francisco', 54),
('EMP058', 'Carter', 'Ramirez', 'carter.ramirez@techcorp.com', '+1-555-0158', 7, 'Payroll Specialist', 'Mid', 78000.00, '2022-04-15', 'Remote', 54);

-- Operations Department (8 people)
INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, level, salary, hire_date, location, manager_id) VALUES
('EMP059', 'Ella', 'James', 'ella.james@techcorp.com', '+1-555-0159', 8, 'Operations Director', 'Director', 185000.00, '2020-01-15', 'San Francisco', 1),
('EMP060', 'Sebastian', 'Watson', 'sebastian.watson@techcorp.com', '+1-555-0160', 8, 'Operations Manager', 'Manager', 130000.00, '2020-10-20', 'Austin', 59);

-- Customer Success Department (10 people)
INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, level, salary, hire_date, location, manager_id) VALUES
('EMP061', 'Avery', 'Brooks', 'avery.brooks@techcorp.com', '+1-555-0161', 9, 'CS Director', 'Director', 175000.00, '2020-02-10', 'San Francisco', 1),
('EMP062', 'Jackson', 'Kelly', 'jackson.kelly@techcorp.com', '+1-555-0162', 9, 'Senior Customer Success Manager', 'Senior', 115000.00, '2020-11-15', 'San Francisco', 61),
('EMP063', 'Scarlett', 'Sanders', 'scarlett.sanders@techcorp.com', '+1-555-0163', 9, 'Customer Success Manager', 'Mid', 92000.00, '2021-06-20', 'Remote', 61);

-- Legal Department (3 people)
INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, position, level, salary, hire_date, location, manager_id) VALUES
('EMP064', 'Elijah', 'Price', 'elijah.price@techcorp.com', '+1-555-0164', 10, 'General Counsel', 'Director', 250000.00, '2019-06-15', 'San Francisco', 1),
('EMP065', 'Layla', 'Bennett', 'layla.bennett@techcorp.com', '+1-555-0165', 10, 'Corporate Counsel', 'Senior', 165000.00, '2020-09-20', 'San Francisco', 64);

-- Update department heads
UPDATE departments SET head_employee_id = 2 WHERE code = 'ENG';
UPDATE departments SET head_employee_id = 3 WHERE code = 'PROD';
UPDATE departments SET head_employee_id = 32 WHERE code = 'DES';
UPDATE departments SET head_employee_id = 37 WHERE code = 'SALES';
UPDATE departments SET head_employee_id = 45 WHERE code = 'MKT';
UPDATE departments SET head_employee_id = 5 WHERE code = 'HR';
UPDATE departments SET head_employee_id = 4 WHERE code = 'FIN';
UPDATE departments SET head_employee_id = 59 WHERE code = 'OPS';
UPDATE departments SET head_employee_id = 61 WHERE code = 'CS';
UPDATE departments SET head_employee_id = 64 WHERE code = 'LEGAL';
