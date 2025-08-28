-- Precious Drug Interaction Checker Database Schema

-- Table 1: Drug - Master list of drugs with names, classes, brands, and manufacturers
CREATE TABLE IF NOT EXISTS drug (
    id INT PRIMARY KEY AUTO_INCREMENT,
    generic_name VARCHAR(255) NOT NULL UNIQUE,
    brand_name_1 VARCHAR(255),
    manufacturer_1 VARCHAR(255),
    brand_name_2 VARCHAR(255),
    manufacturer_2 VARCHAR(255),
    drug_class VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table 2: conditions - List of predefined medical conditions
CREATE TABLE IF NOT EXISTS conditions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table 3: symptoms - List of symptoms tied to conditions
CREATE TABLE IF NOT EXISTS symptoms (
    symptom_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table 4: symptomToconditions - Links symptoms to their respective conditions
CREATE TABLE IF NOT EXISTS symptomToconditions (
    map_id INT PRIMARY KEY AUTO_INCREMENT,
    condition_id INT NOT NULL,
    symptom_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (condition_id) REFERENCES conditions (id) ON DELETE CASCADE,
    FOREIGN KEY (symptom_id) REFERENCES symptoms (symptom_id) ON DELETE CASCADE
);

-- Table 5: interactions - Base interactions between two drugs
CREATE TABLE IF NOT EXISTS interactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    drug1_id INT NOT NULL,
    drug2_id INT NOT NULL,
    interaction_type VARCHAR(50) NOT NULL, -- 'Major', 'Moderate', 'Minor', 'Contraindicated'
    severity_score INT NOT NULL, -- 1=Minor, 2=Moderate, 3=Major, 4=Contraindicated
    interaction_description TEXT NOT NULL,
    clinical_note_id INT,
    alternative_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (drug1_id) REFERENCES drug (id) ON DELETE CASCADE,
    FOREIGN KEY (drug2_id) REFERENCES drug (id) ON DELETE CASCADE,
    FOREIGN KEY (clinical_note_id) REFERENCES clinicalNote (clinical_note_id) ON DELETE SET NULL,
    FOREIGN KEY (alternative_id) REFERENCES alternativeDrugs (alternative_id) ON DELETE SET NULL
);

-- Table 6: conditionInteraction - Adjusts interaction severity per condition
CREATE TABLE IF NOT EXISTS conditionInteraction (
    map_id INT PRIMARY KEY AUTO_INCREMENT,
    interaction_id INT NOT NULL,
    condition_id INT NOT NULL,
    adjusted_interaction_type VARCHAR(50) NOT NULL,
    severity_score INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (interaction_id) REFERENCES interactions (id) ON DELETE CASCADE,
    FOREIGN KEY (condition_id) REFERENCES conditions (id) ON DELETE CASCADE
);

-- Table 7: Clinical_Note - Explanatory notes tied to each interaction
CREATE TABLE IF NOT EXISTS clinicalNote (
    clinical_note_id INT PRIMARY KEY AUTO_INCREMENT,
    clinical_note TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table 8: alternativeDrugs - Alternatives for flagged drug combinations
CREATE TABLE IF NOT EXISTS alternativeDrugs (
    alternative_id INT PRIMARY KEY AUTO_INCREMENT,
    replaced_drug_id INT NOT NULL, -- Which drug to replace
    alternative_drug_id INT NOT NULL, -- Suggested replacement
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (replaced_drug_id) REFERENCES drug (id) ON DELETE CASCADE,
    FOREIGN KEY (alternative_drug_id) REFERENCES drug (id) ON DELETE CASCADE
);

-- INDEXES FOR OPTIMIZED SEARCHING

-- Index for drug searches by generic name
CREATE INDEX idx_drug_generic_name ON drug (generic_name);

-- Index for drug searches by brand name 1
CREATE INDEX idx_drug_brand_name_1 ON drug (brand_name_1);

-- Index for drug searches by brand name 2
CREATE INDEX idx_drug_brand_name_2 ON drug (brand_name_2);

-- Index for condition searches by name
CREATE INDEX idx_conditions_name ON conditions (name);

-- Index for interaction queries
CREATE INDEX idx_interaction_drugs ON interactions (drug1_id, drug2_id);

-- Index for condition-specific interactions
CREATE INDEX idx_condition_interaction ON conditionInteraction (interaction_id, condition_id);

-- VIEWS

CREATE VIEW ConditionWithSymptoms AS
SELECT
    c.id,
    c.name as condition_name,
    c.description,
    GROUP_CONCAT(s.name) as symptoms
FROM
    conditions c
    LEFT JOIN symptomToconditions stc ON c.id = stc.condition_id
    LEFT JOIN symptoms s ON stc.symptom_id = s.symptom_id
GROUP BY
    c.id,
    c.name,
    c.description;