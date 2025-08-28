const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "drug_interaction_db",
  port: process.env.DB_PORT || 3306,
};

async function createTables() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database");

    // Create drug table (matches schema structure)
    await connection.execute(`
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
      )
    `);
    console.log("Created drug table");

    // Create conditions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS conditions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created conditions table");

    // Create symptoms table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS symptoms (
        symptom_id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created symptoms table");

    // Create clinicalNote table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS clinicalNote (
        clinical_note_id INT PRIMARY KEY AUTO_INCREMENT,
        clinical_note TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created clinicalNote table");

    // Create alternativeDrugs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS alternativeDrugs (
        alternative_id INT PRIMARY KEY AUTO_INCREMENT,
        replaced_drug_id INT NOT NULL,
        alternative_drug_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (replaced_drug_id) REFERENCES drug(id) ON DELETE CASCADE,
        FOREIGN KEY (alternative_drug_id) REFERENCES drug(id) ON DELETE CASCADE
      )
    `);
    console.log("Created alternativeDrugs table");

    // Create interactions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS interactions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        drug1_id INT NOT NULL,
        drug2_id INT NOT NULL,
        interaction_type VARCHAR(50) NOT NULL,
        severity_score INT NOT NULL,
        interaction_description TEXT NOT NULL,
        clinical_note_id INT,
        alternative_id INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (drug1_id) REFERENCES drug(id) ON DELETE CASCADE,
        FOREIGN KEY (drug2_id) REFERENCES drug(id) ON DELETE CASCADE,
        FOREIGN KEY (clinical_note_id) REFERENCES clinicalNote(clinical_note_id) ON DELETE SET NULL,
        FOREIGN KEY (alternative_id) REFERENCES alternativeDrugs(alternative_id) ON DELETE SET NULL
      )
    `);
    console.log("Created interactions table");

    // Create conditionInteraction table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS conditionInteraction (
        map_id INT PRIMARY KEY AUTO_INCREMENT,
        interaction_id INT NOT NULL,
        condition_id INT NOT NULL,
        adjusted_interaction_type VARCHAR(50) NOT NULL,
        severity_score INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (interaction_id) REFERENCES interactions(id) ON DELETE CASCADE,
        FOREIGN KEY (condition_id) REFERENCES conditions(id) ON DELETE CASCADE
      )
    `);
    console.log("Created conditionInteraction table");

    // Create symptomToconditions table (mapping table)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS symptomToconditions (
        map_id INT PRIMARY KEY AUTO_INCREMENT,
        condition_id INT NOT NULL,
        symptom_id INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (condition_id) REFERENCES conditions(id) ON DELETE CASCADE,
        FOREIGN KEY (symptom_id) REFERENCES symptoms(symptom_id) ON DELETE CASCADE
      )
    `);
    console.log("Created symptomToconditions table");

    // Create ConditionWithSymptoms view
    await connection.execute(`
      CREATE VIEW IF NOT EXISTS ConditionWithSymptoms AS
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
        c.description
    `);
    console.log("Created ConditionWithSymptoms view");

    // Create indexes for optimized searching
    await connection.execute(
      "CREATE INDEX IF NOT EXISTS idx_drug_generic_name ON drug(generic_name)"
    );
    await connection.execute(
      "CREATE INDEX IF NOT EXISTS idx_drug_brand_name_1 ON drug(brand_name_1)"
    );
    await connection.execute(
      "CREATE INDEX IF NOT EXISTS idx_drug_brand_name_2 ON drug(brand_name_2)"
    );
    await connection.execute(
      "CREATE INDEX IF NOT EXISTS idx_conditions_name ON conditions(name)"
    );
    await connection.execute(
      "CREATE INDEX IF NOT EXISTS idx_interaction_drugs ON interactions(drug1_id, drug2_id)"
    );
    await connection.execute(
      "CREATE INDEX IF NOT EXISTS idx_condition_interaction ON conditionInteraction(interaction_id, condition_id)"
    );
    console.log("Created indexes");

    console.log("\n✅ All tables, views, and indexes created successfully!");

    // Verify table creation
    console.log("\n📊 Table verification:");
    const [tables] = await connection.execute("SHOW TABLES");
    console.log(
      "Created tables:",
      tables.map((t) => Object.values(t)[0])
    );

    // Show table structures for verification
    console.log("\n📋 Sample table structures:");
    const [drugStructure] = await connection.execute("DESCRIBE drug");
    console.log(
      "Drug table structure:",
      drugStructure.map((col) => `${col.Field} (${col.Type})`)
    );

    const [interactionStructure] = await connection.execute(
      "DESCRIBE interactions"
    );
    console.log(
      "Interactions table structure:",
      interactionStructure.map((col) => `${col.Field} (${col.Type})`)
    );
  } catch (error) {
    console.error("Error creating tables:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("\nDatabase connection closed");
    }
  }
}

createTables();
