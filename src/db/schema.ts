import { pgTable, serial, varchar, decimal, integer, timestamp, date, text, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Departments Table
export const departments = pgTable('departments', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    code: varchar('code', { length: 10 }).notNull().unique(),
    budget: decimal('budget', { precision: 12, scale: 2 }).notNull(),
    headEmployeeId: integer('head_employee_id'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Employees Table
export const employees = pgTable('employees', {
    id: serial('id').primaryKey(),
    employeeId: varchar('employee_id', { length: 20 }).notNull().unique(),
    firstName: varchar('first_name', { length: 50 }).notNull(),
    lastName: varchar('last_name', { length: 50 }).notNull(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    phone: varchar('phone', { length: 20 }),
    departmentId: integer('department_id').references(() => departments.id),
    position: varchar('position', { length: 100 }).notNull(),
    level: varchar('level', { length: 20 }).notNull(), // Junior, Mid, Senior, Staff, Principal, Manager, Director, Executive
    salary: decimal('salary', { precision: 10, scale: 2 }).notNull(),
    hireDate: date('hire_date').notNull(),
    status: varchar('status', { length: 20 }).default('active'), // active, on_leave, terminated
    managerId: integer('manager_id'),
    location: varchar('location', { length: 50 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
    departmentIdx: index('idx_employees_department').on(table.departmentId),
    managerIdx: index('idx_employees_manager').on(table.managerId),
    statusIdx: index('idx_employees_status').on(table.status),
}));

// Projects Table
export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    projectCode: varchar('project_code', { length: 20 }).notNull().unique(),
    name: varchar('name', { length: 200 }).notNull(),
    description: text('description'),
    status: varchar('status', { length: 20 }).notNull(), // planning, active, on_hold, completed, cancelled
    budget: decimal('budget', { precision: 12, scale: 2 }).notNull(),
    spent: decimal('spent', { precision: 12, scale: 2 }).default('0'),
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    departmentId: integer('department_id').references(() => departments.id),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
    statusIdx: index('idx_projects_status').on(table.status),
    departmentIdx: index('idx_projects_department').on(table.departmentId),
}));

// Project Assignments Table
export const projectAssignments = pgTable('project_assignments', {
    id: serial('id').primaryKey(),
    projectId: integer('project_id').references(() => projects.id),
    employeeId: integer('employee_id').references(() => employees.id),
    role: varchar('role', { length: 100 }).notNull(),
    allocationPercentage: integer('allocation_percentage').notNull(), // 0-100
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Leave Requests Table
export const leaveRequests = pgTable('leave_requests', {
    id: serial('id').primaryKey(),
    employeeId: integer('employee_id').references(() => employees.id),
    leaveType: varchar('leave_type', { length: 50 }).notNull(), // vacation, sick, personal, parental
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    days: integer('days').notNull(),
    status: varchar('status', { length: 20 }).notNull(), // pending, approved, rejected, cancelled
    reason: text('reason'),
    approvedBy: integer('approved_by').references(() => employees.id),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
    employeeIdx: index('idx_leave_requests_employee').on(table.employeeId),
    statusIdx: index('idx_leave_requests_status').on(table.status),
}));

// Payroll Records Table
export const payrollRecords = pgTable('payroll_records', {
    id: serial('id').primaryKey(),
    employeeId: integer('employee_id').references(() => employees.id),
    payPeriodStart: date('pay_period_start').notNull(),
    payPeriodEnd: date('pay_period_end').notNull(),
    grossPay: decimal('gross_pay', { precision: 10, scale: 2 }).notNull(),
    deductions: decimal('deductions', { precision: 10, scale: 2 }).notNull(),
    netPay: decimal('net_pay', { precision: 10, scale: 2 }).notNull(),
    status: varchar('status', { length: 20 }).notNull(), // pending, processed, paid
    paymentDate: date('payment_date'),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
    employeeIdx: index('idx_payroll_employee').on(table.employeeId),
}));

// Expense Reports Table
export const expenseReports = pgTable('expense_reports', {
    id: serial('id').primaryKey(),
    employeeId: integer('employee_id').references(() => employees.id),
    projectId: integer('project_id').references(() => projects.id),
    category: varchar('category', { length: 50 }).notNull(), // travel, meals, equipment, software, other
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    description: text('description').notNull(),
    expenseDate: date('expense_date').notNull(),
    status: varchar('status', { length: 20 }).notNull(), // pending, approved, rejected, reimbursed
    approvedBy: integer('approved_by').references(() => employees.id),
    createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
    employeeIdx: index('idx_expense_reports_employee').on(table.employeeId),
    statusIdx: index('idx_expense_reports_status').on(table.status),
}));

// Budget Allocations Table
export const budgetAllocations = pgTable('budget_allocations', {
    id: serial('id').primaryKey(),
    departmentId: integer('department_id').references(() => departments.id),
    fiscalYear: integer('fiscal_year').notNull(),
    quarter: integer('quarter').notNull(), // 1, 2, 3, 4
    category: varchar('category', { length: 50 }).notNull(), // salaries, operations, marketing, r_and_d, infrastructure
    allocated: decimal('allocated', { precision: 12, scale: 2 }).notNull(),
    spent: decimal('spent', { precision: 12, scale: 2 }).default('0'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const departmentsRelations = relations(departments, ({ one, many }) => ({
    head: one(employees, {
        fields: [departments.headEmployeeId],
        references: [employees.id],
    }),
    employees: many(employees),
    projects: many(projects),
    budgetAllocations: many(budgetAllocations),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
    department: one(departments, {
        fields: [employees.departmentId],
        references: [departments.id],
    }),
    manager: one(employees, {
        fields: [employees.managerId],
        references: [employees.id],
    }),
    directReports: many(employees),
    projectAssignments: many(projectAssignments),
    leaveRequests: many(leaveRequests),
    payrollRecords: many(payrollRecords),
    expenseReports: many(expenseReports),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
    department: one(departments, {
        fields: [projects.departmentId],
        references: [departments.id],
    }),
    assignments: many(projectAssignments),
    expenses: many(expenseReports),
}));

export const projectAssignmentsRelations = relations(projectAssignments, ({ one }) => ({
    project: one(projects, {
        fields: [projectAssignments.projectId],
        references: [projects.id],
    }),
    employee: one(employees, {
        fields: [projectAssignments.employeeId],
        references: [employees.id],
    }),
}));

export const leaveRequestsRelations = relations(leaveRequests, ({ one }) => ({
    employee: one(employees, {
        fields: [leaveRequests.employeeId],
        references: [employees.id],
    }),
    approver: one(employees, {
        fields: [leaveRequests.approvedBy],
        references: [employees.id],
    }),
}));

export const payrollRecordsRelations = relations(payrollRecords, ({ one }) => ({
    employee: one(employees, {
        fields: [payrollRecords.employeeId],
        references: [employees.id],
    }),
}));

export const expenseReportsRelations = relations(expenseReports, ({ one }) => ({
    employee: one(employees, {
        fields: [expenseReports.employeeId],
        references: [employees.id],
    }),
    project: one(projects, {
        fields: [expenseReports.projectId],
        references: [projects.id],
    }),
    approver: one(employees, {
        fields: [expenseReports.approvedBy],
        references: [employees.id],
    }),
}));

export const budgetAllocationsRelations = relations(budgetAllocations, ({ one }) => ({
    department: one(departments, {
        fields: [budgetAllocations.departmentId],
        references: [departments.id],
    }),
}));
