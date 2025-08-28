-- Database Setup Script for Drug Interaction Checker
-- This script creates the database and sets up the complete schema with foreign keys

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS drug_interaction_db;

USE drug_interaction_db;

-- Set foreign key checks to ensure referential integrity
SET foreign_key_checks = 1;

-- Drop existing tables if they exist (for clean setup)
-- Order matters due to foreign key constraints - drop child tables first
DROP TABLE IF EXISTS conditionInteraction;

DROP TABLE IF EXISTS symptomToconditions;

DROP TABLE IF EXISTS interactions;

DROP TABLE IF EXISTS alternativeDrugs;

DROP TABLE IF EXISTS clinicalNote;

DROP TABLE IF EXISTS symptoms;

DROP TABLE IF EXISTS conditions;

DROP TABLE IF EXISTS drug;

-- Drop existing views if they exist
DROP VIEW IF EXISTS ConditionWithSymptoms;

-- Now run the schema creation
SOURCE schema.sql;

-- Create indexes for optimized searching
CREATE INDEX IF NOT EXISTS idx_drug_generic_name ON drug (generic_name);

CREATE INDEX IF NOT EXISTS idx_drug_brand_name_1 ON drug (brand_name_1);

CREATE INDEX IF NOT EXISTS idx_drug_brand_name_2 ON drug (brand_name_2);

CREATE INDEX IF NOT EXISTS idx_conditions_name ON conditions (name);

CREATE INDEX IF NOT EXISTS idx_interaction_drugs ON interactions (drug1_id, drug2_id);

CREATE INDEX IF NOT EXISTS idx_condition_interaction ON conditionInteraction (interaction_id, condition_id);

-- Insert the data
SOURCE insertData.sql;

-- Verify the setup with some basic queries
SELECT 'Database setup completed successfully!' as status;

SELECT COUNT(*) as drug_count FROM drug;

SELECT COUNT(*) as condition_count FROM conditions;

SELECT COUNT(*) as interaction_count FROM interactions;

SELECT COUNT(*) as symptom_count FROM symptoms;

SELECT COUNT(*) as clinical_notes_count FROM clinicalNote;

SELECT COUNT(*) as alternatives_count FROM alternativeDrugs;

-- Display sample data to verify successful setup
SELECT 'Sample drugs:' as info;

SELECT id, generic_name, brand_name_1, drug_class FROM drug LIMIT 5;

SELECT 'Sample conditions:' as info;

SELECT id, name FROM conditions LIMIT 5;

SELECT 'Sample interactions:' as info;

SELECT i.id, d1.generic_name as drug1, d2.generic_name as drug2, i.interaction_type, i.severity_score
FROM
    interactions i
    JOIN drug d1 ON i.drug1_id = d1.id
    JOIN drug d2 ON i.drug2_id = d2.id
LIMIT 5;