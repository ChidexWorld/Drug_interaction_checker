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

    // Create drugs table (matches data structure)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS drugs (
        id INT PRIMARY KEY,
        generic_name VARCHAR(255) NOT NULL,
        drug_class VARCHAR(255) NOT NULL,
        brands JSON,
        manufacturers JSON,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Created drugs table");

    // Create conditions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS conditions (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        severity_level INT DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created conditions table");

    // Create symptoms table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS symptoms (
        id INT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        severity INT DEFAULT 1,
        relevance_score INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Created symptoms table");

    // Create interactions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS interactions (
        id INT PRIMARY KEY,
        drug1_id INT NOT NULL,
        drug2_id INT NOT NULL,
        drug1_name VARCHAR(255) NOT NULL,
        drug2_name VARCHAR(255) NOT NULL,
        interaction_type VARCHAR(50) NOT NULL,
        severity_score INT NOT NULL,
        description TEXT NOT NULL,
        mechanism TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (drug1_id) REFERENCES drugs(id) ON DELETE CASCADE,
        FOREIGN KEY (drug2_id) REFERENCES drugs(id) ON DELETE CASCADE
      )
    `);
    console.log("Created interactions table");

    // Create clinical_notes table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS clinical_notes (
        id INT PRIMARY KEY,
        interaction_id INT NOT NULL,
        note_type VARCHAR(50) DEFAULT 'general',
        clinical_note TEXT NOT NULL,
        recommendation TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (interaction_id) REFERENCES interactions(id) ON DELETE CASCADE
      )
    `);
    console.log("Created clinical_notes table");

    // Create alternative_drugs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS alternative_drugs (
        id INT PRIMARY KEY,
        interaction_id INT NOT NULL,
        original_drug_id INT NOT NULL,
        alternative_drug_id INT NOT NULL,
        reason TEXT,
        safety_note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (interaction_id) REFERENCES interactions(id) ON DELETE CASCADE,
        FOREIGN KEY (original_drug_id) REFERENCES drugs(id) ON DELETE CASCADE,
        FOREIGN KEY (alternative_drug_id) REFERENCES drugs(id) ON DELETE CASCADE
      )
    `);
    console.log("Created alternative_drugs table");

    // Create condition_interactions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS condition_interactions (
        id INT PRIMARY KEY,
        condition_id INT NOT NULL,
        interaction_id INT NOT NULL,
        condition_note TEXT,
        condition_adjusted BOOLEAN DEFAULT FALSE,
        severity_modifier INT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (condition_id) REFERENCES conditions(id) ON DELETE CASCADE,
        FOREIGN KEY (interaction_id) REFERENCES interactions(id) ON DELETE CASCADE
      )
    `);
    console.log("Created condition_interactions table");

    // Create symptom_conditions table (mapping table)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS symptom_conditions (
        id INT PRIMARY KEY,
        symptom_id INT NOT NULL,
        condition_id INT NOT NULL,
        relevance_score INT DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (symptom_id) REFERENCES symptoms(id) ON DELETE CASCADE,
        FOREIGN KEY (condition_id) REFERENCES conditions(id) ON DELETE CASCADE
      )
    `);
    console.log("Created symptom_conditions table");

    // Create useful indexes
    await connection.execute("CREATE INDEX IF NOT EXISTS idx_drug_generic_name ON drugs(generic_name)");
    await connection.execute("CREATE INDEX IF NOT EXISTS idx_interaction_drugs ON interactions(drug1_id, drug2_id)");
    await connection.execute("CREATE INDEX IF NOT EXISTS idx_condition_name ON conditions(name)");
    await connection.execute("CREATE INDEX IF NOT EXISTS idx_symptom_name ON symptoms(name)");
    console.log("Created indexes");

    console.log("\n✅ All tables created successfully!");

  } catch (error) {
    console.error("Error creating tables:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("Database connection closed");
    }
  }
}

createTables();