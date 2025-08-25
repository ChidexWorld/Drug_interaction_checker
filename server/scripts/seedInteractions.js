const database = require("../database/connection");

// Import data from organized data folder
const drugs = require('../data/drugs');
const conditions = require('../data/conditions');
const symptoms = require('../data/symptoms');
const interactions = require('../data/interactions');
const clinicalNotes = require('../data/clinicalNotes');
const alternativeDrugs = require('../data/alternativeDrugs');
const symptomToCondition = require('../data/symptomToCondition');
const conditionInteraction = require('../data/conditionInteraction');

// Create a drug name lookup for the interactions
const drugNameLookup = {};
drugs.forEach(drug => {
  drugNameLookup[drug.id] = drug.generic_name;
});

// Create condition name lookup
const conditionNameLookup = {};
conditions.forEach(condition => {
  conditionNameLookup[condition.id] = condition.name;
});

// Create symptom name lookup
const symptomNameLookup = {};
symptoms.forEach(symptom => {
  symptomNameLookup[symptom.id] = symptom.name;
});

// Transform our data to match the expected format
const interactionData = {
  interactions: interactions.map(interaction => ({
    drug1_name: drugNameLookup[interaction.drug1_id],
    drug2_name: drugNameLookup[interaction.drug2_id],
    interaction_type: interaction.interaction_type,
    severity_score: interaction.severity_score,
    description: interaction.interaction_description,
    mechanism: interaction.interaction_description // Use same as description for now
  })),

  clinicalNotes: clinicalNotes.map(note => {
    // Find the corresponding interaction
    const interaction = interactions.find(int => int.clinical_note_id === note.clinical_note_id);
    if (interaction) {
      return {
        drug1_name: drugNameLookup[interaction.drug1_id],
        drug2_name: drugNameLookup[interaction.drug2_id],
        notes: [{
          note_type: "general",
          clinical_note: note.clinical_note,
          recommendation: "Monitor closely and follow clinical guidance"
        }]
      };
    }
    return null;
  }).filter(Boolean),

  conditionInteractions: conditionInteraction.map(condInt => {
    const interaction = interactions.find(int => int.id === condInt.interaction_id);
    if (interaction) {
      return {
        drug1_name: drugNameLookup[interaction.drug1_id],
        drug2_name: drugNameLookup[interaction.drug2_id],
        condition_name: conditionNameLookup[condInt.condition_id],
        adjusted_severity_score: condInt.severity_score,
        adjusted_interaction_type: condInt.adjusted_interaction_type,
        condition_specific_note: `${condInt.adjusted_interaction_type} interaction in ${conditionNameLookup[condInt.condition_id]} patients`
      };
    }
    return null;
  }).filter(Boolean),

  alternatives: alternativeDrugs.map(alt => {
    const originalDrug = drugs.find(drug => drug.id === alt.replaced_drug_id);
    const alternativeDrug = drugs.find(drug => drug.id === alt.alternative_drug_id);
    
    if (originalDrug && alternativeDrug) {
      return {
        drug1_name: originalDrug.generic_name,
        drug2_name: alternativeDrug.generic_name,
        original_drug_name: originalDrug.generic_name,
        alternative_name: alternativeDrug.generic_name,
        reason: `${alternativeDrug.generic_name} may be a safer alternative to ${originalDrug.generic_name}`,
        safety_note: "Monitor for effectiveness and adverse effects"
      };
    }
    return null;
  }).filter(Boolean),

  conditionSymptomMaps: symptomToCondition.map(mapping => ({
    condition_name: conditionNameLookup[mapping.condition_id],
    symptom_name: symptomNameLookup[mapping.symptom_id],
    relevance_score: 3 // Default relevance score
  })),
};

async function seedInteractions() {
  try {
    await database.connect();
    console.log("Starting interaction data seeding...");

    // Insert interactions
    console.log("Inserting interactions...");
    for (const interaction of interactionData.interactions) {
      const drug1 = await database.get(
        "SELECT id FROM Drug WHERE generic_name = ?",
        [interaction.drug1_name]
      );
      const drug2 = await database.get(
        "SELECT id FROM Drug WHERE generic_name = ?",
        [interaction.drug2_name]
      );

      if (drug1 && drug2) {
        const result = await database.run(
          `
                    INSERT IGNORE INTO Interaction 
                    (drug1_id, drug2_id, interaction_type, severity_score, description, mechanism) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `,
          [
            drug1.id,
            drug2.id,
            interaction.interaction_type,
            interaction.severity_score,
            interaction.description,
            interaction.mechanism,
          ]
        );

        console.log(
          `Added interaction: ${interaction.drug1_name} + ${interaction.drug2_name}`
        );
      }
    }

    // Insert clinical notes
    console.log("Inserting clinical notes...");
    for (const noteGroup of interactionData.clinicalNotes) {
      const drug1 = await database.get(
        "SELECT id FROM Drug WHERE generic_name = ?",
        [noteGroup.drug1_name]
      );
      const drug2 = await database.get(
        "SELECT id FROM Drug WHERE generic_name = ?",
        [noteGroup.drug2_name]
      );

      if (drug1 && drug2) {
        const interaction = await database.get(
          `
                    SELECT id FROM Interaction 
                    WHERE (drug1_id = ? AND drug2_id = ?) OR (drug1_id = ? AND drug2_id = ?)
                `,
          [drug1.id, drug2.id, drug2.id, drug1.id]
        );

        if (interaction) {
          for (const note of noteGroup.notes) {
            await database.run(
              `
                            INSERT IGNORE INTO Clinical_Note 
                            (interaction_id, note_type, clinical_note, recommendation) 
                            VALUES (?, ?, ?, ?)
                        `,
              [
                interaction.id,
                note.note_type,
                note.clinical_note,
                note.recommendation,
              ]
            );
          }
        }
      }
    }

    // Insert condition-specific interactions
    console.log("Inserting condition-specific interactions...");
    for (const condInt of interactionData.conditionInteractions) {
      const drug1 = await database.get(
        "SELECT id FROM Drug WHERE generic_name = ?",
        [condInt.drug1_name]
      );
      const drug2 = await database.get(
        "SELECT id FROM Drug WHERE generic_name = ?",
        [condInt.drug2_name]
      );
      const condition = await database.get(
        "SELECT id FROM `Condition` WHERE name = ?",
        [condInt.condition_name]
      );

      if (drug1 && drug2 && condition) {
        const interaction = await database.get(
          `
                    SELECT id FROM Interaction 
                    WHERE (drug1_id = ? AND drug2_id = ?) OR (drug1_id = ? AND drug2_id = ?)
                `,
          [drug1.id, drug2.id, drug2.id, drug1.id]
        );

        if (interaction) {
          await database.run(
            `
                        INSERT IGNORE INTO Condition_Interaction 
                        (interaction_id, condition_id, adjusted_severity_score, adjusted_interaction_type, condition_specific_note) 
                        VALUES (?, ?, ?, ?, ?)
                    `,
            [
              interaction.id,
              condition.id,
              condInt.adjusted_severity_score,
              condInt.adjusted_interaction_type,
              condInt.condition_specific_note,
            ]
          );
        }
      }
    }

    // Insert condition-symptom mappings
    console.log("Inserting condition-symptom mappings...");
    for (const mapping of interactionData.conditionSymptomMaps) {
      const condition = await database.get(
        "SELECT id FROM `Condition` WHERE name = ?",
        [mapping.condition_name]
      );
      const symptom = await database.get(
        "SELECT id FROM Symptom WHERE name = ?",
        [mapping.symptom_name]
      );

      if (condition && symptom) {
        await database.run(
          `
                    INSERT IGNORE INTO Condition_Symptom_Map 
                    (condition_id, symptom_id, relevance_score) 
                    VALUES (?, ?, ?)
                `,
          [condition.id, symptom.id, mapping.relevance_score]
        );
      }
    }

    console.log("Interaction data seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding interaction data:", error);
    throw error;
  } finally {
    await database.close();
  }
}

// Run if called directly
if (require.main === module) {
  seedInteractions()
    .then(() => {
      console.log("Interaction seeding process completed.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Interaction seeding process failed:", err);
      process.exit(1);
    });
}

module.exports = { seedInteractions };
