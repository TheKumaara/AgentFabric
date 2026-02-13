-- TechCorp Inc. - Company Database Schema
-- A realistic tech company with employees, departments, finances, and projects

-- Drop existing tables if they exist
DROP TABLE IF EXISTS expense_reports CASCADE;
DROP TABLE IF EXISTS payroll_records CASCADE;
DROP TABLE IF EXISTS project_assignments CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS budget_allocations CASCADE;

-- Departments
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    budget DECIMAL(12, 2) NOT NULL,
    head_employee_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department_id INTEGER REFERENCES departments(id),
    position VARCHAR(100) NOT NULL,
    level VARCHAR(20) NOT NULL, -- Junior, Mid, Senior, Staff, Principal, Manager, Director
    salary DECIMAL(10, 2) NOT NULL,
    hire_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, on_leave, terminated
    manager_id INTEGER REFERENCES employees(id),
    location VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key for department head
ALTER TABLE departments ADD CONSTRAINT fk_department_head 
    FOREIGN KEY (head_employee_id) REFERENCES employees(id);

-- Projects
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    project_code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL, -- planning, active, on_hold, completed, cancelled
    budget DECIMAL(12, 2) NOT NULL,
    spent DECIMAL(12, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE,
    department_id INTEGER REFERENCES departments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project Assignments
CREATE TABLE project_assignments (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    employee_id INTEGER REFERENCES employees(id),
    role VARCHAR(100) NOT NULL,
    allocation_percentage INTEGER NOT NULL, -- 0-100
    start_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, employee_id)
);

-- Leave Requests
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    leave_type VARCHAR(50) NOT NULL, -- vacation, sick, personal, parental
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL, -- pending, approved, rejected, cancelled
    reason TEXT,
    approved_by INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payroll Records
CREATE TABLE payroll_records (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    gross_pay DECIMAL(10, 2) NOT NULL,
    deductions DECIMAL(10, 2) NOT NULL,
    net_pay DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL, -- pending, processed, paid
    payment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expense Reports
CREATE TABLE expense_reports (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    project_id INTEGER REFERENCES projects(id),
    category VARCHAR(50) NOT NULL, -- travel, meals, equipment, software, other
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    expense_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- pending, approved, rejected, reimbursed
    approved_by INTEGER REFERENCES employees(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budget Allocations
CREATE TABLE budget_allocations (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id),
    fiscal_year INTEGER NOT NULL,
    quarter INTEGER NOT NULL, -- 1, 2, 3, 4
    category VARCHAR(50) NOT NULL, -- salaries, operations, marketing, r_and_d, infrastructure
    allocated DECIMAL(12, 2) NOT NULL,
    spent DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_manager ON employees(manager_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_department ON projects(department_id);
CREATE INDEX idx_leave_requests_employee ON leave_requests(employee_id);
CREATE INDEX idx_leave_requests_status ON leave_requests(status);
CREATE INDEX idx_payroll_employee ON payroll_records(employee_id);
CREATE INDEX idx_expense_reports_employee ON expense_reports(employee_id);
CREATE INDEX idx_expense_reports_status ON expense_reports(status);
