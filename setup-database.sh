#!/bin/bash

#  Database - Quick Setup for Hackathon Demo
# This script sets up PostgreSQL database with realistic company data

set -e

echo "🏢 Database Setup"
echo "=========================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL not set in environment"
    echo ""
    echo "Please add to .env.local:"
    echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/database"
    echo ""
    read -p "Do you want to use the default local PostgreSQL? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/database"
        echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/database" >> .env.local
        echo "✅ Added DATABASE_URL to .env.local"
    else
        echo "❌ Aborted. Please set DATABASE_URL and run again."
        exit 1
    fi
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Setting up database..."

# Check if database exists
if psql "$DATABASE_URL" -c '\q' 2>/dev/null; then
    echo "✅ Database connection successful"
else
    echo "⚠️  Cannot connect to database"
    echo ""
    read -p "Do you want to create the database? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        createdb database 2>/dev/null || echo "Database might already exist"
    else
        echo "❌ Aborted. Please create the database and run again."
        exit 1
    fi
fi

echo ""
echo "📋 Generating Drizzle schema..."
npm run db:generate

echo ""
echo "🚀 Pushing schema to database..."
npm run db:push

echo ""
echo "🌱 Seeding database with company data..."
npm run db:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "📊 Database Summary:"
echo "   - 10 departments (Engineering, HR, Finance, etc.)"
echo "   - 23+ employees with realistic roles and salaries"
echo "   - 3 active projects with budgets"
echo "   - Leave requests, expenses, payroll data"
echo ""
echo "🎯 Next Steps for Hackathon:"
echo "   1. Configure PostgreSQL MCP in Archestra dashboard"
echo "   2. Connect HR agent to database"
echo "   3. Connect Finance agent to database"
echo "   4. Test queries via chat UI at http://localhost:3001"
echo ""
echo "💡 Useful Commands:"
echo "   npm run db:studio  - Open database GUI"
echo "   npm run db:seed    - Re-seed database"
echo "   npm run dev        - Start Next.js app"
echo ""
