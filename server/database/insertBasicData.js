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

    // Insert drugs first
    console.log("Inserting drugs...");
    for (const drug of drugs) {
      const { id, generic_name, drug_class, brands, manufacturers } = drug;
      try {
        await connection.execute(
          `INSERT IGNORE INTO drugs (id, generic_name, drug_class, brands, manufacturers) 
           VALUES (?, ?, ?, ?, ?)`,
          [id, generic_name, drug_class, JSON.stringify(brands || []), JSON.stringify(manufacturers || [])]
        );
      } catch (err) {
        console.log(`Error inserting drug ${id}: ${err.message}`);
      }
    }
    console.log(`✅ Inserted ${drugs.length} drugs`);

    // Insert conditions
    console.log("Inserting conditions...");
    for (const condition of conditions) {
      const { id, name, description } = condition;
      try {
        await connection.execute(
          `INSERT IGNORE INTO conditions (id, name, description, severity_level) 
           VALUES (?, ?, ?, ?)`,
          [id, name, description || null, 1]
        );
      } catch (err) {
        console.log(`Error inserting condition ${id}: ${err.message}`);
      }
    }
    console.log(`✅ Inserted ${conditions.length} conditions`);

    // Insert symptoms
    console.log("Inserting symptoms...");
    for (const symptom of symptoms) {
      const { id, name } = symptom;
      try {
        await connection.execute(
          `INSERT IGNORE INTO symptoms (id, name, description, severity) 
           VALUES (?, ?, ?, ?)`,
          [id, name, null, 1]
        );
      } catch (err) {
        console.log(`Error inserting symptom ${id}: ${err.message}`);
      }
    }
    console.log(`✅ Inserted ${symptoms.length} symptoms`);

    // Insert interactions with proper drug names
    console.log("Inserting interactions...");
    for (const interaction of interactions) {
      const { id, drug1_id, drug2_id, interaction_type, severity_score, interaction_description } = interaction;
      
      // Get drug names
      const drug1 = drugs.find(d => d.id === drug1_id);
      const drug2 = drugs.find(d => d.id === drug2_id);
      
      if (!drug1 || !drug2) {
        console.log(`Skipping interaction ${id} - drugs not found`);
        continue;
      }
      
      try {
        await connection.execute(
          `INSERT IGNORE INTO interactions (id, drug1_id, drug2_id, drug1_name, drug2_name, 
           interaction_type, severity_score, description) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [id, drug1_id, drug2_id, drug1.generic_name, drug2.generic_name, 
           interaction_type, severity_score, interaction_description || null]
        );
      } catch (err) {
        console.log(`Error inserting interaction ${id}: ${err.message}`);
      }
    }
    console.log(`✅ Inserted interactions`);

    // Verify data insertion
    console.log("\n📊 Data verification:");
    const [drugCount] = await connection.execute("SELECT COUNT(*) as count FROM drugs");
    const [conditionCount] = await connection.execute("SELECT COUNT(*) as count FROM conditions");
    const [symptomCount] = await connection.execute("SELECT COUNT(*) as count FROM symptoms");
    const [interactionCount] = await connection.execute("SELECT COUNT(*) as count FROM interactions");

    console.log(`Drugs: ${drugCount[0].count}`);
    console.log(`Conditions: ${conditionCount[0].count}`);
    console.log(`Symptoms: ${symptomCount[0].count}`);
    console.log(`Interactions: ${interactionCount[0].count}`);

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