-- Precious Drug Interaction Checker Database Schema

-- Table 1: Drug - Master list of drugs with names, classes, brands, and manufacturers
CREATE TABLE IF NOT EXISTS Drug (
    id INT PRIMARY KEY AUTO_INCREMENT,
    generic_name VARCHAR(255) NOT NULL UNIQUE,
    drug_class VARCHAR(255) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for drug brands and manufacturers (one-to-many relationship with Drug)
CREATE TABLE IF NOT EXISTS Drug_Brand (
    id INT PRIMARY KEY AUTO_INCREMENT,
    drug_id INT NOT NULL,
    brand_name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    country VARCHAR(255) DEFAULT 'Nigeria',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drug_id) REFERENCES Drug(id) ON DELETE CASCADE
);

-- Table 2: Condition - List of predefined medical conditions
CREATE TABLE IF NOT EXISTS `Condition` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    severity_level INT DEFAULT 1, -- 1=mild, 2=moderate, 3=severe
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: Symptom - List of symptoms tied to conditions
CREATE TABLE IF NOT EXISTS Symptom (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table 4: Condition_Symptom_Map - Links symptoms to their respective conditions
CREATE TABLE IF NOT EXISTS Condition_Symptom_Map (
    id INT PRIMARY KEY AUTO_INCREMENT,
    condition_id INT NOT NULL,
    symptom_id INT NOT NULL,
    relevance_score INT DEFAULT 1, -- 1=low, 2=medium, 3=high relevance
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (condition_id) REFERENCES `Condition`(id) ON DELETE CASCADE,
    FOREIGN KEY (symptom_id) REFERENCES Symptom(id) ON DELETE CASCADE,
    UNIQUE(condition_id, symptom_id)
);

-- Table 5: Interaction - Base interactions between two drugs
CREATE TABLE IF NOT EXISTS Interaction (
    id INT PRIMARY KEY AUTO_INCREMENT,
    drug1_id INT NOT NULL,
    drug2_id INT NOT NULL,
    interaction_type VARCHAR(50) NOT NULL, -- 'Major', 'Moderate', 'Minor', 'Contraindicated'
    severity_score INT NOT NULL, -- 1=Minor, 2=Moderate, 3=Major, 4=Contraindicated
    description TEXT NOT NULL,
    mechanism TEXT, -- How the interaction occurs
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drug1_id) REFERENCES Drug(id) ON DELETE CASCADE,
    FOREIGN KEY (drug2_id) REFERENCES Drug(id) ON DELETE CASCADE,
    UNIQUE(drug1_id, drug2_id)
);

-- Table 6: Condition_Interaction - Adjusts interaction severity per condition
CREATE TABLE IF NOT EXISTS Condition_Interaction (
    id INT PRIMARY KEY AUTO_INCREMENT,
    interaction_id INT NOT NULL,
    condition_id INT NOT NULL,
    adjusted_severity_score INT NOT NULL,
    adjusted_interaction_type VARCHAR(50) NOT NULL,
    condition_specific_note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interaction_id) REFERENCES Interaction(id) ON DELETE CASCADE,
    FOREIGN KEY (condition_id) REFERENCES `Condition`(id) ON DELETE CASCADE,
    UNIQUE(interaction_id, condition_id)
);

-- Table 7: Clinical_Note - Explanatory notes tied to each interaction
CREATE TABLE IF NOT EXISTS Clinical_Note (
    id INT PRIMARY KEY AUTO_INCREMENT,
    interaction_id INT NOT NULL,
    note_type VARCHAR(50) DEFAULT 'general', -- 'general', 'monitoring', 'contraindication'
    clinical_note TEXT NOT NULL,
    recommendation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interaction_id) REFERENCES Interaction(id) ON DELETE CASCADE
);

-- Table 8: Alternative_Drug - Alternatives for flagged drug combinations
CREATE TABLE IF NOT EXISTS Alternative_Drug (
    id INT PRIMARY KEY AUTO_INCREMENT,
    interaction_id INT NOT NULL,
    original_drug_id INT NOT NULL, -- Which drug to replace
    alternative_drug_id INT NOT NULL, -- Suggested replacement
    reason TEXT,
    safety_note TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interaction_id) REFERENCES Interaction(id) ON DELETE CASCADE,
    FOREIGN KEY (original_drug_id) REFERENCES Drug(id) ON DELETE CASCADE,
    FOREIGN KEY (alternative_drug_id) REFERENCES Drug(id) ON DELETE CASCADE
);


CREATE INDEX idx_drug_generic_name ON Drug(generic_name);
CREATE INDEX idx_drug_brand_name ON Drug_Brand(brand_name);
CREATE INDEX idx_interaction_drugs ON Interaction(drug1_id, drug2_id);
CREATE INDEX idx_condition_interaction ON Condition_Interaction(interaction_id, condition_id);


CREATE VIEW DrugWithBrands AS
SELECT 
    d.id,
    d.generic_name,
    d.drug_class,
    d.description,
    GROUP_CONCAT(CONCAT(db.brand_name, ' (', db.manufacturer, ')')) as brands
FROM Drug d
LEFT JOIN Drug_Brand db ON d.id = db.drug_id
GROUP BY d.id, d.generic_name, d.drug_class, d.description;

CREATE VIEW ConditionWithSymptoms AS
SELECT 
    c.id,
    c.name as condition_name,
    c.description,
    GROUP_CONCAT(s.name) as symptoms
FROM `Condition` c
LEFT JOIN Condition_Symptom_Map csm ON c.id = csm.condition_id
LEFT JOIN Symptom s ON csm.symptom_id = s.id
GROUP BY c.id, c.name, c.description;
