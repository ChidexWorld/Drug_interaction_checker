-- Precious Drug Interaction Checker Database Schema

-- Table 1: Drug - Master list of drugs with names, classes, brands, and manufacturers
CREATE TABLE IF NOT EXISTS Drug (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    generic_name TEXT NOT NULL UNIQUE,
    drug_class TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table for drug brands and manufacturers (one-to-many relationship with Drug)
CREATE TABLE IF NOT EXISTS Drug_Brand (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drug_id INTEGER NOT NULL,
    brand_name TEXT NOT NULL,
    manufacturer TEXT NOT NULL,
    country TEXT DEFAULT 'Nigeria',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drug_id) REFERENCES Drug(id) ON DELETE CASCADE
);

-- Table 2: Condition - List of predefined medical conditions
CREATE TABLE IF NOT EXISTS Condition (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    severity_level INTEGER DEFAULT 1, -- 1=mild, 2=moderate, 3=severe
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: Symptom - List of symptoms tied to conditions
CREATE TABLE IF NOT EXISTS Symptom (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table 4: Condition_Symptom_Map - Links symptoms to their respective conditions
CREATE TABLE IF NOT EXISTS Condition_Symptom_Map (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    condition_id INTEGER NOT NULL,
    symptom_id INTEGER NOT NULL,
    relevance_score INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high relevance
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (condition_id) REFERENCES Condition(id) ON DELETE CASCADE,
    FOREIGN KEY (symptom_id) REFERENCES Symptom(id) ON DELETE CASCADE,
    UNIQUE(condition_id, symptom_id)
);

-- Table 5: Interaction - Base interactions between two drugs
CREATE TABLE IF NOT EXISTS Interaction (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    drug1_id INTEGER NOT NULL,
    drug2_id INTEGER NOT NULL,
    interaction_type TEXT NOT NULL, -- 'Major', 'Moderate', 'Minor', 'Contraindicated'
    severity_score INTEGER NOT NULL, -- 1=Minor, 2=Moderate, 3=Major, 4=Contraindicated
    description TEXT NOT NULL,
    mechanism TEXT, -- How the interaction occurs
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drug1_id) REFERENCES Drug(id) ON DELETE CASCADE,
    FOREIGN KEY (drug2_id) REFERENCES Drug(id) ON DELETE CASCADE,
    UNIQUE(drug1_id, drug2_id)
);

-- Table 6: Condition_Interaction - Adjusts interaction severity per condition
CREATE TABLE IF NOT EXISTS Condition_Interaction (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    interaction_id INTEGER NOT NULL,
    condition_id INTEGER NOT NULL,
    adjusted_severity_score INTEGER NOT NULL,
    adjusted_interaction_type TEXT NOT NULL,
    condition_specific_note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interaction_id) REFERENCES Interaction(id) ON DELETE CASCADE,
    FOREIGN KEY (condition_id) REFERENCES Condition(id) ON DELETE CASCADE,
    UNIQUE(interaction_id, condition_id)
);

-- Table 7: Clinical_Note - Explanatory notes tied to each interaction
CREATE TABLE IF NOT EXISTS Clinical_Note (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    interaction_id INTEGER NOT NULL,
    note_type TEXT DEFAULT 'general', -- 'general', 'monitoring', 'contraindication'
    clinical_note TEXT NOT NULL,
    recommendation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interaction_id) REFERENCES Interaction(id) ON DELETE CASCADE
);

-- Table 8: Alternative_Drug - Alternatives for flagged drug combinations
CREATE TABLE IF NOT EXISTS Alternative_Drug (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    interaction_id INTEGER NOT NULL,
    original_drug_id INTEGER NOT NULL, -- Which drug to replace
    alternative_drug_id INTEGER NOT NULL, -- Suggested replacement
    reason TEXT,
    safety_note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interaction_id) REFERENCES Interaction(id) ON DELETE CASCADE,
    FOREIGN KEY (original_drug_id) REFERENCES Drug(id) ON DELETE CASCADE,
    FOREIGN KEY (alternative_drug_id) REFERENCES Drug(id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_drug_generic_name ON Drug(generic_name);
CREATE INDEX IF NOT EXISTS idx_drug_brand_name ON Drug_Brand(brand_name);
CREATE INDEX IF NOT EXISTS idx_interaction_drugs ON Interaction(drug1_id, drug2_id);
CREATE INDEX IF NOT EXISTS idx_condition_interaction ON Condition_Interaction(interaction_id, condition_id);

-- Views for easier querying
CREATE VIEW IF NOT EXISTS DrugWithBrands AS
SELECT 
    d.id,
    d.generic_name,
    d.drug_class,
    d.description,
    GROUP_CONCAT(db.brand_name || ' (' || db.manufacturer || ')') as brands
FROM Drug d
LEFT JOIN Drug_Brand db ON d.id = db.drug_id
GROUP BY d.id, d.generic_name, d.drug_class, d.description;

CREATE VIEW IF NOT EXISTS ConditionWithSymptoms AS
SELECT 
    c.id,
    c.name as condition_name,
    c.description,
    GROUP_CONCAT(s.name) as symptoms
FROM Condition c
LEFT JOIN Condition_Symptom_Map csm ON c.id = csm.condition_id
LEFT JOIN Symptom s ON csm.symptom_id = s.id
GROUP BY c.id, c.name, c.description;
