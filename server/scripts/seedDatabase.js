const database = require("../database/connection");

// Import data from organized data folder
const drugs = require('../data/drugs');
const conditions = require('../data/conditions');
const symptoms = require('../data/symptoms');

// Create drug brands data from drugs data
const drugBrands = [];
drugs.forEach(drug => {
  drug.brands.forEach((brand, index) => {
    drugBrands.push({
      drug_name: drug.generic_name,
      brand_name: brand,
      manufacturer: drug.manufacturers[index] || drug.manufacturers[0]
    });
  });
});

// Transform data to match seeding format
const sampleData = {
  drugs: drugs.map(drug => ({
    generic_name: drug.generic_name,
    drug_class: drug.drug_class,
    description: `${drug.drug_class} medication` // Simple description
  })),
  
  drugBrands: drugBrands,
  
  conditions: conditions.map(condition => ({
    name: condition.name,
    description: condition.description.split('\n')[0], // Use first line of description
    severity_level: 2 // Default severity level
  })),
  
  symptoms: symptoms
};

async function seedDatabase() {
  try {
    await database.connect();
    console.log("Starting database seeding...");

    // Insert drugs
    console.log("Inserting drugs...");
    for (const drug of sampleData.drugs) {
      await database.run(
        "INSERT IGNORE INTO Drug (generic_name, drug_class, description) VALUES (?, ?, ?)",
        [drug.generic_name, drug.drug_class, drug.description]
      );
    }

    // Insert drug brands
    console.log("Inserting drug brands...");
    for (const brand of sampleData.drugBrands) {
      const drug = await database.get(
        "SELECT id FROM Drug WHERE generic_name = ?",
        [brand.drug_name]
      );
      if (drug) {
        await database.run(
          "INSERT IGNORE INTO Drug_Brand (drug_id, brand_name, manufacturer) VALUES (?, ?, ?)",
          [drug.id, brand.brand_name, brand.manufacturer]
        );
      }
    }

    // Insert conditions
    console.log("Inserting conditions...");
    for (const condition of sampleData.conditions) {
      await database.run(
        "INSERT IGNORE INTO `Condition` (name, description, severity_level) VALUES (?, ?, ?)",
        [condition.name, condition.description, condition.severity_level]
      );
    }

    // Insert symptoms
    console.log("Inserting symptoms...");
    for (const symptom of sampleData.symptoms) {
      await database.run(
        "INSERT IGNORE INTO Symptom (name, description) VALUES (?, ?)",
        [symptom.name, symptom.description || null]
      );
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await database.close();
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("Seeding process completed.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Seeding process failed:", err);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
