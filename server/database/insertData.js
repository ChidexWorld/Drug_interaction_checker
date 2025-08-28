const mysql = require("mysql2/promise");
require("dotenv").config();

// Import all data files
const drugs = require("../data/drugs");
const conditions = require("../data/conditions");
const symptoms = require("../data/symptoms");
const interactions = require("../data/interactions");
const clinicalNotes = require("../data/clinicalNotes");
const alternativeDrugs = require("../data/alternativeDrugs");
const conditionInteractions = require("../data/conditionInteraction");
const symptomToConditions = require("../data/symptomToCondition");

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "drug_interaction_db",
  port: process.env.DB_PORT || 3306,
};

async function insertData() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("Connected to database");

    // Insert drugs first (no foreign keys)
    console.log("Inserting drugs...");
    for (const drug of drugs) {
      const {
        id,
        generic_name,
        brand_name_1,
        manufacturer_1,
        brand_name_2,
        manufacturer_2,
        drug_class,
      } = drug;
      await connection.execute(
        `INSERT IGNORE INTO drug (id, generic_name, brand_name_1, manufacturer_1, brand_name_2, manufacturer_2, drug_class) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          generic_name,
          brand_name_1 || null,
          manufacturer_1 || null,
          brand_name_2 || null,
          manufacturer_2 || null,
          drug_class,
        ]
      );
    }
    console.log(`Inserted ${drugs.length} drugs`);

    // Insert conditions (no foreign keys)
    console.log("Inserting conditions...");
    for (const condition of conditions) {
      const { id, name, description } = condition;
      await connection.execute(
        `INSERT IGNORE INTO conditions (id, name, description) 
         VALUES (?, ?, ?)`,
        [id, name, description || null]
      );
    }
    console.log(`Inserted ${conditions.length} conditions`);

    // Insert symptoms (no foreign keys)
    console.log("Inserting symptoms...");
    for (const symptom of symptoms) {
      const { symptom_id, name } = symptom;
      await connection.execute(
        `INSERT IGNORE INTO symptoms (symptom_id, name) 
         VALUES (?, ?)`,
        [symptom_id, name]
      );
    }
    console.log(`Inserted ${symptoms.length} symptoms`);

    // Insert clinical notes first (no foreign keys in our schema)
    console.log("Inserting clinical notes...");
    for (const note of clinicalNotes) {
      const { clinical_note_id, clinical_note } = note;
      await connection.execute(
        `INSERT IGNORE INTO clinicalNote (clinical_note_id, clinical_note) 
         VALUES (?, ?)`,
        [clinical_note_id, clinical_note]
      );
    }
    console.log(`Inserted ${clinicalNotes.length} clinical notes`);

    // Insert alternative drugs (references drug table)
    console.log("Inserting alternative drugs...");
    for (const altDrug of alternativeDrugs) {
      const { alternative_id, replaced_drug_id, alternative_drug_id } = altDrug;
      await connection.execute(
        `INSERT IGNORE INTO alternativeDrugs (alternative_id, replaced_drug_id, alternative_drug_id) 
         VALUES (?, ?, ?)`,
        [alternative_id, replaced_drug_id, alternative_drug_id]
      );
    }
    console.log(`Inserted ${alternativeDrugs.length} alternative drugs`);

    // Insert interactions (foreign keys to drugs, clinicalNote, and alternativeDrugs)
    console.log("Inserting interactions...");
    for (const interaction of interactions) {
      const {
        id,
        drug1_id,
        drug2_id,
        interaction_type,
        severity_score,
        interaction_description,
        clinical_note_id,
        alternative_id,
      } = interaction;

      await connection.execute(
        `INSERT IGNORE INTO interactions (id, drug1_id, drug2_id, interaction_type, severity_score, 
         interaction_description, clinical_note_id, alternative_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          drug1_id,
          drug2_id,
          interaction_type,
          severity_score,
          interaction_description,
          clinical_note_id || null,
          alternative_id || null,
        ]
      );
    }
    console.log(`Inserted ${interactions.length} interactions`);

    // Insert condition interactions (foreign keys to conditions and interactions)
    console.log("Inserting condition interactions...");
    for (const condInt of conditionInteractions) {
      const {
        map_id,
        interaction_id,
        condition_id,
        adjusted_interaction_type,
        severity_score,
      } = condInt;
      await connection.execute(
        `INSERT IGNORE INTO conditionInteraction (map_id, interaction_id, condition_id, adjusted_interaction_type, severity_score) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          map_id,
          interaction_id,
          condition_id,
          adjusted_interaction_type,
          severity_score,
        ]
      );
    }
    console.log(
      `Inserted ${conditionInteractions.length} condition interactions`
    );

    // Insert symptom to condition mappings (foreign keys to symptoms and conditions)
    console.log("Inserting symptom to condition mappings...");
    for (const mapping of symptomToConditions) {
      const { map_id, condition_id, symptom_id } = mapping;
      await connection.execute(
        `INSERT IGNORE INTO symptomToconditions (map_id, condition_id, symptom_id) 
         VALUES (?, ?, ?)`,
        [map_id, condition_id, symptom_id]
      );
    }
    console.log(
      `Inserted ${symptomToConditions.length} symptom to condition mappings`
    );

    console.log("\n✅ All data inserted successfully!");

    // Verify data insertion
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
    const [noteCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM clinicalNote"
    );
    const [altDrugCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM alternativeDrugs"
    );
    const [condIntCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM conditionInteraction"
    );
    const [symCondCount] = await connection.execute(
      "SELECT COUNT(*) as count FROM symptomToconditions"
    );

    console.log(`Drugs: ${drugCount[0].count}`);
    console.log(`Conditions: ${conditionCount[0].count}`);
    console.log(`Symptoms: ${symptomCount[0].count}`);
    console.log(`Interactions: ${interactionCount[0].count}`);
    console.log(`Clinical Notes: ${noteCount[0].count}`);
    console.log(`Alternative Drugs: ${altDrugCount[0].count}`);
    console.log(`Condition Interactions: ${condIntCount[0].count}`);
    console.log(`Symptom Conditions: ${symCondCount[0].count}`);

    // Display sample data to verify successful insertion
    console.log("\n📋 Sample data verification:");

    // Sample drugs
    const [sampleDrugs] = await connection.execute(
      "SELECT id, generic_name, brand_name_1, drug_class FROM drug LIMIT 3"
    );
    console.log("Sample drugs:", sampleDrugs);

    // Sample interactions with drug names
    const [sampleInteractions] = await connection.execute(`
      SELECT i.id, d1.generic_name as drug1, d2.generic_name as drug2, i.interaction_type, i.severity_score 
      FROM interactions i 
      JOIN drug d1 ON i.drug1_id = d1.id 
      JOIN drug d2 ON i.drug2_id = d2.id 
      LIMIT 3
    `);
    console.log("Sample interactions:", sampleInteractions);
  } catch (error) {
    console.error("Error inserting data:", error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("\nDatabase connection closed");
    }
  }
}

// Run the data insertion
insertData();
