const mysql = require("mysql2/promise");
require("dotenv").config();

// Import essential data files
const drugs = require("../data/drugs");
const conditions = require("../data/conditions");
const symptoms = require("../data/symptoms");
const interactions = require("../data/interactions");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "drug_interaction_db",
  port: process.env.DB_PORT || 3306,
};

async function insertBasicData() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database");

    // Insert drugs first (updated table name and structure)
    console.log("Inserting drugs...");
    for (const drug of drugs) {
      const {
        id,
        generic_name,
        drug_class,
        brand_name_1,
        manufacturer_1,
        brand_name_2,
        manufacturer_2,
      } = drug;
      try {
        await connection.execute(
          `INSERT IGNORE INTO drug (id, generic_name, drug_class, brand_name_1, manufacturer_1, brand_name_2, manufacturer_2) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            generic_name,
            drug_class,
            brand_name_1 || null,
            manufacturer_1 || null,
            brand_name_2 || null,
            manufacturer_2 || null,
          ]
        );
      } catch (err) {
        console.log(`Error inserting drug ${id}: ${err.message}`);
      }
    }
    console.log(`✅ Inserted ${drugs.length} drugs`);

    // Insert conditions (updated table structure)
    console.log("Inserting conditions...");
    for (const condition of conditions) {
      const { id, name, description } = condition;
      try {
        await connection.execute(
          `INSERT IGNORE INTO conditions (id, name, description) 
           VALUES (?, ?, ?)`,
          [id, name, description || null]
        );
      } catch (err) {
        console.log(`Error inserting condition ${id}: ${err.message}`);
      }
    }
    console.log(`✅ Inserted ${conditions.length} conditions`);

    // Insert symptoms (updated table structure with symptom_id)
    console.log("Inserting symptoms...");
    for (const symptom of symptoms) {
      const { symptom_id, name } = symptom;
      try {
        await connection.execute(
          `INSERT IGNORE INTO symptoms (symptom_id, name) 
           VALUES (?, ?)`,
          [symptom_id, name]
        );
      } catch (err) {
        console.log(`Error inserting symptom ${symptom_id}: ${err.message}`);
      }
    }
    console.log(`✅ Inserted ${symptoms.length} symptoms`);

    // Insert interactions (updated table structure)
    console.log("Inserting interactions...");
    for (const interaction of interactions) {
      const {
        id,
        drug1_id,
        drug2_id,
        interaction_type,
        severity_score,
        interaction_description,
      } = interaction;

      // Verify drugs exist
      const drug1 = drugs.find((d) => d.id === drug1_id);
      const drug2 = drugs.find((d) => d.id === drug2_id);

      if (!drug1 || !drug2) {
        console.log(
          `Skipping interaction ${id} - drugs not found (drug1_id: ${drug1_id}, drug2_id: ${drug2_id})`
        );
        continue;
      }

      try {
        await connection.execute(
          `INSERT IGNORE INTO interactions (id, drug1_id, drug2_id, interaction_type, severity_score, interaction_description) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            id,
            drug1_id,
            drug2_id,
            interaction_type,
            severity_score,
            interaction_description || null,
          ]
        );
      } catch (err) {
        console.log(`Error inserting interaction ${id}: ${err.message}`);
      }
    }
    console.log(`✅ Inserted interactions`);

    // Verify data insertion (updated table names)
    console.log("\n📊 Data verification:");
    const [drugCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM drug"
    );
    const [conditionCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM conditions"
    );
    const [symptomCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM symptoms"
    );
    const [interactionCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM interactions"
    );

    console.log(`Drugs: ${drugCount[0].count}`);
    console.log(`Conditions: ${conditionCount[0].count}`);
    console.log(`Symptoms: ${symptomCount[0].count}`);
    console.log(`Interactions: ${interactionCount[0].count}`);

    // Display sample data to verify structure
    console.log("\n📋 Sample data verification:");

    // Sample drugs
    const [sampleDrugs] = await connection.execute(
      "SELECT id, generic_name, brand_name_1, drug_class FROM drug LIMIT 3"
    );
    console.log("Sample drugs:", sampleDrugs);

    // Sample conditions
    const [sampleConditions] = await connection.execute(
      "SELECT id, name FROM conditions LIMIT 3"
    );
    console.log("Sample conditions:", sampleConditions);

    // Sample symptoms
    const [sampleSymptoms] = await connection.execute(
      "SELECT symptom_id, name FROM symptoms LIMIT 3"
    );
    console.log("Sample symptoms:", sampleSymptoms);

    // Sample interactions with drug names
    const [sampleInteractions] = await connection.execute(`
      SELECT i.id, d1.generic_name as drug1, d2.generic_name as drug2, i.interaction_type, i.severity_score 
      FROM interactions i 
      JOIN drug d1 ON i.drug1_id = d1.id 
      JOIN drug d2 ON i.drug2_id = d2.id 
      LIMIT 3
    `);
    console.log("Sample interactions:", sampleInteractions);

    console.log("\n✅ Basic data inserted successfully!");
  } catch (error) {
    console.error("Error inserting basic data:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("\nDatabase connection closed");
    }
  }
}

insertBasicData();
