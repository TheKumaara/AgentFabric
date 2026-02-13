import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { Pool } from 'pg';
import * as schema from './schema';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function seed() {
    console.log('🌱 Seeding database...');

    try {
        // Insert Departments
        console.log('📁 Creating departments...');
        const depts = await db.insert(schema.departments).values([
            { name: 'Engineering', code: 'ENG', budget: '5000000.00' },
            { name: 'Product', code: 'PROD', budget: '1500000.00' },
            { name: 'Design', code: 'DES', budget: '800000.00' },
            { name: 'Sales', code: 'SALES', budget: '2000000.00' },
            { name: 'Marketing', code: 'MKT', budget: '1200000.00' },
            { name: 'Human Resources', code: 'HR', budget: '600000.00' },
            { name: 'Finance', code: 'FIN', budget: '500000.00' },
            { name: 'Operations', code: 'OPS', budget: '1000000.00' },
            { name: 'Customer Success', code: 'CS', budget: '900000.00' },
            { name: 'Legal', code: 'LEGAL', budget: '400000.00' },
        ]).returning();

        // Insert Employees (Leadership & Key Personnel)
        console.log('👥 Creating employees...');
        const emps = await db.insert(schema.employees).values([
            // C-Suite
            { employeeId: 'EMP001', firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@techcorp.com', phone: '+1-555-0101', departmentId: 7, position: 'Chief Executive Officer', level: 'Executive', salary: '350000.00', hireDate: '2018-01-15', location: 'San Francisco', managerId: null },
            { employeeId: 'EMP002', firstName: 'Michael', lastName: 'Rodriguez', email: 'michael.rodriguez@techcorp.com', phone: '+1-555-0102', departmentId: 1, position: 'Chief Technology Officer', level: 'Executive', salary: '320000.00', hireDate: '2018-03-01', location: 'San Francisco', managerId: 1 },
            { employeeId: 'EMP003', firstName: 'Jennifer', lastName: 'Park', email: 'jennifer.park@techcorp.com', phone: '+1-555-0103', departmentId: 2, position: 'Chief Product Officer', level: 'Executive', salary: '300000.00', hireDate: '2018-06-15', location: 'San Francisco', managerId: 1 },
            { employeeId: 'EMP004', firstName: 'David', lastName: 'Thompson', email: 'david.thompson@techcorp.com', phone: '+1-555-0104', departmentId: 7, position: 'Chief Financial Officer', level: 'Executive', salary: '310000.00', hireDate: '2019-01-10', location: 'San Francisco', managerId: 1 },
            { employeeId: 'EMP005', firstName: 'Lisa', lastName: 'Anderson', email: 'lisa.anderson@techcorp.com', phone: '+1-555-0105', departmentId: 6, position: 'Chief People Officer', level: 'Executive', salary: '280000.00', hireDate: '2019-04-01', location: 'San Francisco', managerId: 1 },

            // Engineering
            { employeeId: 'EMP006', firstName: 'James', lastName: 'Wilson', email: 'james.wilson@techcorp.com', phone: '+1-555-0106', departmentId: 1, position: 'VP of Engineering', level: 'Director', salary: '250000.00', hireDate: '2019-07-01', location: 'San Francisco', managerId: 2 },
            { employeeId: 'EMP007', firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@techcorp.com', phone: '+1-555-0107', departmentId: 1, position: 'Engineering Manager - Backend', level: 'Manager', salary: '180000.00', hireDate: '2020-02-15', location: 'San Francisco', managerId: 6 },
            { employeeId: 'EMP008', firstName: 'Robert', lastName: 'Martinez', email: 'robert.martinez@techcorp.com', phone: '+1-555-0108', departmentId: 1, position: 'Engineering Manager - Frontend', level: 'Manager', salary: '175000.00', hireDate: '2020-03-01', location: 'Remote', managerId: 6 },
            { employeeId: 'EMP009', firstName: 'Amanda', lastName: 'Taylor', email: 'amanda.taylor@techcorp.com', phone: '+1-555-0109', departmentId: 1, position: 'Engineering Manager - Platform', level: 'Manager', salary: '185000.00', hireDate: '2020-05-10', location: 'Austin', managerId: 6 },
            { employeeId: 'EMP010', firstName: 'Christopher', lastName: 'Lee', email: 'christopher.lee@techcorp.com', phone: '+1-555-0110', departmentId: 1, position: 'Staff Software Engineer', level: 'Staff', salary: '220000.00', hireDate: '2019-09-01', location: 'San Francisco', managerId: 7 },
            { employeeId: 'EMP011', firstName: 'Jessica', lastName: 'White', email: 'jessica.white@techcorp.com', phone: '+1-555-0111', departmentId: 1, position: 'Staff Software Engineer', level: 'Staff', salary: '215000.00', hireDate: '2020-01-15', location: 'Remote', managerId: 7 },
            { employeeId: 'EMP012', firstName: 'Daniel', lastName: 'Harris', email: 'daniel.harris@techcorp.com', phone: '+1-555-0112', departmentId: 1, position: 'Senior Software Engineer', level: 'Senior', salary: '180000.00', hireDate: '2020-06-01', location: 'San Francisco', managerId: 7 },
            { employeeId: 'EMP013', firstName: 'Ashley', lastName: 'Clark', email: 'ashley.clark@techcorp.com', phone: '+1-555-0113', departmentId: 1, position: 'Senior Software Engineer', level: 'Senior', salary: '175000.00', hireDate: '2020-08-15', location: 'Austin', managerId: 7 },
            { employeeId: 'EMP014', firstName: 'Matthew', lastName: 'Lewis', email: 'matthew.lewis@techcorp.com', phone: '+1-555-0114', departmentId: 1, position: 'Senior Software Engineer', level: 'Senior', salary: '178000.00', hireDate: '2021-01-10', location: 'Remote', managerId: 8 },
            { employeeId: 'EMP015', firstName: 'Stephanie', lastName: 'Walker', email: 'stephanie.walker@techcorp.com', phone: '+1-555-0115', departmentId: 1, position: 'Senior Software Engineer', level: 'Senior', salary: '172000.00', hireDate: '2021-03-01', location: 'San Francisco', managerId: 8 },

            // HR
            { employeeId: 'EMP049', firstName: 'Grace', lastName: 'Rivera', email: 'grace.rivera@techcorp.com', phone: '+1-555-0149', departmentId: 6, position: 'HR Director', level: 'Director', salary: '180000.00', hireDate: '2019-11-01', location: 'San Francisco', managerId: 5 },
            { employeeId: 'EMP050', firstName: 'Lucas', lastName: 'Cooper', email: 'lucas.cooper@techcorp.com', phone: '+1-555-0150', departmentId: 6, position: 'Senior HR Business Partner', level: 'Senior', salary: '135000.00', hireDate: '2020-08-15', location: 'San Francisco', managerId: 49 },
            { employeeId: 'EMP051', firstName: 'Chloe', lastName: 'Richardson', email: 'chloe.richardson@techcorp.com', phone: '+1-555-0151', departmentId: 6, position: 'HR Business Partner', level: 'Mid', salary: '105000.00', hireDate: '2021-04-20', location: 'Austin', managerId: 49 },

            // Finance
            { employeeId: 'EMP054', firstName: 'Jack', lastName: 'Ward', email: 'jack.ward@techcorp.com', phone: '+1-555-0154', departmentId: 7, position: 'Finance Director', level: 'Director', salary: '190000.00', hireDate: '2019-12-01', location: 'San Francisco', managerId: 4 },
            { employeeId: 'EMP055', firstName: 'Zoe', lastName: 'Torres', email: 'zoe.torres@techcorp.com', phone: '+1-555-0155', departmentId: 7, position: 'Senior Financial Analyst', level: 'Senior', salary: '125000.00', hireDate: '2020-07-20', location: 'San Francisco', managerId: 54 },
            { employeeId: 'EMP056', firstName: 'Owen', lastName: 'Peterson', email: 'owen.peterson@techcorp.com', phone: '+1-555-0156', departmentId: 7, position: 'Financial Analyst', level: 'Mid', salary: '95000.00', hireDate: '2021-05-15', location: 'Austin', managerId: 54 },
            { employeeId: 'EMP057', firstName: 'Aria', lastName: 'Gray', email: 'aria.gray@techcorp.com', phone: '+1-555-0157', departmentId: 7, position: 'Accountant', level: 'Mid', salary: '85000.00', hireDate: '2021-11-10', location: 'San Francisco', managerId: 54 },
            { employeeId: 'EMP058', firstName: 'Carter', lastName: 'Ramirez', email: 'carter.ramirez@techcorp.com', phone: '+1-555-0158', departmentId: 7, position: 'Payroll Specialist', level: 'Mid', salary: '78000.00', hireDate: '2022-04-15', location: 'Remote', managerId: 54 },
        ]).returning();

        // Update department heads
        console.log('🔗 Updating department heads...');
        await db.update(schema.departments).set({ headEmployeeId: 2 }).where(eq(schema.departments.code, 'ENG'));
        await db.update(schema.departments).set({ headEmployeeId: 3 }).where(eq(schema.departments.code, 'PROD'));
        await db.update(schema.departments).set({ headEmployeeId: 5 }).where(eq(schema.departments.code, 'HR'));
        await db.update(schema.departments).set({ headEmployeeId: 4 }).where(eq(schema.departments.code, 'FIN'));

        // Insert Projects
        console.log('📊 Creating projects...');
        await db.insert(schema.projects).values([
            { projectCode: 'PROJ-2024-001', name: 'Mobile App Redesign', description: 'Complete overhaul of iOS and Android mobile applications', status: 'active', budget: '800000.00', spent: '450000.00', startDate: '2024-01-15', endDate: '2024-06-30', departmentId: 1 },
            { projectCode: 'PROJ-2024-002', name: 'AI-Powered Analytics Dashboard', description: 'Build ML-powered analytics platform', status: 'active', budget: '1200000.00', spent: '320000.00', startDate: '2024-02-01', endDate: '2024-08-31', departmentId: 1 },
            { projectCode: 'PROJ-2024-003', name: 'API v3 Migration', description: 'Migrate to new REST API v3 with GraphQL', status: 'active', budget: '600000.00', spent: '180000.00', startDate: '2024-03-01', endDate: '2024-07-15', departmentId: 1 },
        ]);

        // Insert Leave Requests
        console.log('🏖️ Creating leave requests...');
        await db.insert(schema.leaveRequests).values([
            { employeeId: 12, leaveType: 'vacation', startDate: '2024-03-15', endDate: '2024-03-22', days: 6, status: 'approved', reason: 'Family vacation', approvedBy: 7 },
            { employeeId: 15, leaveType: 'vacation', startDate: '2024-04-01', endDate: '2024-04-05', days: 5, status: 'approved', reason: 'Spring break', approvedBy: 8 },
            { employeeId: 13, leaveType: 'vacation', startDate: '2024-06-10', endDate: '2024-06-21', days: 10, status: 'pending', reason: 'Summer vacation', approvedBy: null },
        ]);

        // Insert Expense Reports
        console.log('💰 Creating expense reports...');
        await db.insert(schema.expenseReports).values([
            { employeeId: 10, projectId: 2, category: 'software', amount: '2500.00', description: 'ML development tools and cloud GPU credits', expenseDate: '2024-02-05', status: 'approved', approvedBy: 7 },
            { employeeId: 12, projectId: 1, category: 'equipment', amount: '3200.00', description: 'MacBook Pro M3 for mobile development', expenseDate: '2024-01-20', status: 'approved', approvedBy: 8 },
            { employeeId: 13, projectId: 2, category: 'travel', amount: '1800.00', description: 'Conference attendance - AI Summit 2024', expenseDate: '2024-03-10', status: 'pending', approvedBy: null },
        ]);

        // Insert Budget Allocations
        console.log('📈 Creating budget allocations...');
        await db.insert(schema.budgetAllocations).values([
            // Engineering Q1 2024
            { departmentId: 1, fiscalYear: 2024, quarter: 1, category: 'salaries', allocated: '1800000.00', spent: '1800000.00' },
            { departmentId: 1, fiscalYear: 2024, quarter: 1, category: 'infrastructure', allocated: '400000.00', spent: '285000.00' },
            { departmentId: 1, fiscalYear: 2024, quarter: 1, category: 'r_and_d', allocated: '300000.00', spent: '180000.00' },
            // HR Q1 2024
            { departmentId: 6, fiscalYear: 2024, quarter: 1, category: 'salaries', allocated: '220000.00', spent: '220000.00' },
            { departmentId: 6, fiscalYear: 2024, quarter: 1, category: 'operations', allocated: '80000.00', spent: '65000.00' },
            // Finance Q1 2024
            { departmentId: 7, fiscalYear: 2024, quarter: 1, category: 'salaries', allocated: '180000.00', spent: '180000.00' },
            { departmentId: 7, fiscalYear: 2024, quarter: 1, category: 'operations', allocated: '70000.00', spent: '52000.00' },
        ]);

        console.log('✅ Database seeded successfully!');
        console.log(`   - ${depts.length} departments`);
        console.log(`   - ${emps.length} employees`);
        console.log('   - 3 projects');
        console.log('   - 3 leave requests');
        console.log('   - 3 expense reports');
        console.log('   - 7 budget allocations');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

seed();
