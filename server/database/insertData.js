


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
      const { id, generic_name, drug_class, brands, manufacturers } = drug;
      await connection.execute(
        `INSERT IGNORE INTO drugs (id, generic_name, drug_class, brands, manufacturers) 
         VALUES (?, ?, ?, ?, ?)`,
        [id, generic_name, drug_class, JSON.stringify(brands), JSON.stringify(manufacturers)]
      );
    }
    console.log(`Inserted ${drugs.length} drugs`);

    // Insert conditions (no foreign keys)
    console.log("Inserting conditions...");
    for (const condition of conditions) {
      const { id, name, description, severity_level } = condition;
      await connection.execute(
        `INSERT IGNORE INTO conditions (id, name, description, severity_level) 
         VALUES (?, ?, ?, ?)`,
        [id, name, description, severity_level || 1]
      );
    }
    console.log(`Inserted ${conditions.length} conditions`);

    // Insert symptoms (no foreign keys)
    console.log("Inserting symptoms...");
    for (const symptom of symptoms) {
      const { id, name, description, severity, relevance_score } = symptom;
      await connection.execute(
        `INSERT IGNORE INTO symptoms (id, name, description, severity, relevance_score) 
         VALUES (?, ?, ?, ?, ?)`,
        [id, name, description || null, severity || 1, relevance_score || null]
      );
    }
    console.log(`Inserted ${symptoms.length} symptoms`);

    // Insert interactions (foreign keys to drugs)
    console.log("Inserting interactions...");
    for (const interaction of interactions) {
      const { 
        id, drug1_id, drug2_id, drug1_name, drug2_name, 
        interaction_type, severity_score, description, mechanism,
        interaction_description
      } = interaction;
      
      // Get drug names if not provided
      let d1_name = drug1_name;
      let d2_name = drug2_name;
      
      if (!d1_name || !d2_name) {
        const drug1 = drugs.find(d => d.id === drug1_id);
        const drug2 = drugs.find(d => d.id === drug2_id);
        d1_name = drug1 ? drug1.generic_name : 'Unknown';
        d2_name = drug2 ? drug2.generic_name : 'Unknown';
      }
      
      await connection.execute(
        `INSERT IGNORE INTO interactions (id, drug1_id, drug2_id, drug1_name, drug2_name, 
         interaction_type, severity_score, description, mechanism) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, drug1_id, drug2_id, d1_name, d2_name, interaction_type, severity_score, 
         description || interaction_description || null, mechanism || null]
      );
    }
    console.log(`Inserted ${interactions.length} interactions`);

    // Insert clinical notes (foreign keys to interactions)
    console.log("Inserting clinical notes...");
    for (const note of clinicalNotes) {
      const { id, interaction_id, note_type, clinical_note, recommendation } = note;
      await connection.execute(
        `INSERT IGNORE INTO clinical_notes (id, interaction_id, note_type, clinical_note, recommendation) 
         VALUES (?, ?, ?, ?, ?)`,
        [id, interaction_id, note_type || 'general', clinical_note || null, recommendation || null]
      );
    }
    console.log(`Inserted ${clinicalNotes.length} clinical notes`);

    // Insert alternative drugs (foreign keys to drugs and interactions)
    console.log("Inserting alternative drugs...");
    for (const altDrug of alternativeDrugs) {
      const { 
        id, interaction_id, original_drug_id, alternative_drug_id, 
        reason, safety_note 
      } = altDrug;
      await connection.execute(
        `INSERT IGNORE INTO alternative_drugs (id, interaction_id, original_drug_id, alternative_drug_id, 
         reason, safety_note) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, interaction_id, original_drug_id, alternative_drug_id, reason || null, safety_note || null]
      );
    }
    console.log(`Inserted ${alternativeDrugs.length} alternative drugs`);

    // Insert condition interactions (foreign keys to conditions and interactions)
    console.log("Inserting condition interactions...");
    for (const condInt of conditionInteractions) {
      const { 
        id, condition_id, interaction_id, condition_note, 
        condition_adjusted, severity_modifier 
      } = condInt;
      await connection.execute(
        `INSERT IGNORE INTO condition_interactions (id, condition_id, interaction_id, condition_note, 
         condition_adjusted, severity_modifier) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, condition_id, interaction_id, condition_note || null, condition_adjusted || false, severity_modifier || null]
      );
    }
    console.log(`Inserted ${conditionInteractions.length} condition interactions`);

    // Insert symptom to condition mappings (foreign keys to symptoms and conditions)
    console.log("Inserting symptom to condition mappings...");
    for (const mapping of symptomToConditions) {
      const { id, symptom_id, condition_id, relevance_score } = mapping;
      await connection.execute(
        `INSERT IGNORE INTO symptom_conditions (id, symptom_id, condition_id, relevance_score) 
         VALUES (?, ?, ?, ?)`,
        [id, symptom_id, condition_id, relevance_score || 1]
      );
    }
    console.log(`Inserted ${symptomToConditions.length} symptom to condition mappings`);

    console.log("\n✅ All data inserted successfully!");
    
    // Verify data insertion
    console.log("\n📊 Data verification:");
    const [drugCount] = await connection.execute("SELECT COUNT(*) as count FROM drugs");
    const [conditionCount] = await connection.execute("SELECT COUNT(*) as count FROM conditions");
    const [symptomCount] = await connection.execute("SELECT COUNT(*) as count FROM symptoms");
    const [interactionCount] = await connection.execute("SELECT COUNT(*) as count FROM interactions");
    const [noteCount] = await connection.execute("SELECT COUNT(*) as count FROM clinical_notes");
    const [altDrugCount] = await connection.execute("SELECT COUNT(*) as count FROM alternative_drugs");
    const [condIntCount] = await connection.execute("SELECT COUNT(*) as count FROM condition_interactions");
    const [symCondCount] = await connection.execute("SELECT COUNT(*) as count FROM symptom_conditions");

    console.log(`Drugs: ${drugCount[0].count}`);
    console.log(`Conditions: ${conditionCount[0].count}`);
    console.log(`Symptoms: ${symptomCount[0].count}`);
    console.log(`Interactions: ${interactionCount[0].count}`);
    console.log(`Clinical Notes: ${noteCount[0].count}`);
    console.log(`Alternative Drugs: ${altDrugCount[0].count}`);
    console.log(`Condition Interactions: ${condIntCount[0].count}`);
    console.log(`Symptom Conditions: ${symCondCount[0].count}`);

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