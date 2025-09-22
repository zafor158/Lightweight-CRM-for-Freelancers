-- Migration script to add new columns to existing tables
-- Run this if you have existing data and want to add the new fields

-- Add new columns to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS website VARCHAR(255),
ADD COLUMN IF NOT EXISTS tax_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS payment_terms INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS preferred_contact_method VARCHAR(20) DEFAULT 'email';

-- Add new columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS budget DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'Medium',
ADD COLUMN IF NOT EXISTS project_type VARCHAR(50) DEFAULT 'Development',
ADD COLUMN IF NOT EXISTS tags TEXT;

-- Add new columns to invoices table
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS payment_terms INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'USD';

-- Add constraints for new columns (using DO blocks to handle IF NOT EXISTS)
DO $$
BEGIN
    -- Add priority constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_priority' 
        AND conrelid = 'projects'::regclass
    ) THEN
        ALTER TABLE projects 
        ADD CONSTRAINT check_priority 
        CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent'));
    END IF;

    -- Add project_type constraint if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'check_project_type' 
        AND conrelid = 'projects'::regclass
    ) THEN
        ALTER TABLE projects 
        ADD CONSTRAINT check_project_type 
        CHECK (project_type IN ('Development', 'Design', 'Consulting', 'Marketing', 'Writing', 'Other'));
    END IF;
END $$;
