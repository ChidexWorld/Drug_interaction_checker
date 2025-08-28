// Mock data for testing without database setup

// Import all data from separate files
const drugs = require("../data/drugs");
const conditions = require("../data/conditions");
const symptoms = require("../data/symptoms");
const symptomToCondition = require("../data/symptomToCondition");
const conditionInteraction = require("../data/conditionInteraction");
const interactions = require("../data/interactions");
const clinicalNotes = require("../data/clinicalNotes");
const alternativeDrugs = require("../data/alternativeDrugs");

// Mock database class
class MockDatabase {
  constructor() {
    this.connected = false;
  }

  async connect() {
    this.connected = true;
    console.log("Connected to mock database");
    return Promise.resolve();
  }

  async close() {
    this.connected = false;
    console.log("Mock database connection closed");
    return Promise.resolve();
  }

  async all(sql, params = []) {
    // Handle complex drug search queries (updated table names)
    if (sql.includes("FROM drug") && sql.includes("LIKE")) {
      const searchTerm = params[0] || params[1] || params[2];
      if (searchTerm) {
        const term = searchTerm.replace(/%/g, "").toLowerCase();

        // Search by generic name, brand_name_1, and brand_name_2
        const matchingDrugs = drugs
          .filter((drug) => {
            const genericMatch = drug.generic_name.toLowerCase().includes(term);
            const brand1Match =
              drug.brand_name_1 &&
              drug.brand_name_1.toLowerCase().includes(term);
            const brand2Match =
              drug.brand_name_2 &&
              drug.brand_name_2.toLowerCase().includes(term);
            return genericMatch || brand1Match || brand2Match;
          })
          .map((drug) => ({
            ...drug,
            relevance_score: drug.generic_name.toLowerCase().includes(term)
              ? 1
              : 2,
          }));

        return matchingDrugs.sort(
          (a, b) => a.relevance_score - b.relevance_score
        );
      }
    }

    // Handle interaction queries with JOINs (updated table names)
    if (sql.includes("FROM interactions") && sql.includes("JOIN drug")) {
      const drugId1 = params[0];
      const drugId2 = params[1];
      const drugId3 = params[2]; // For bidirectional search
      const drugId4 = params[3];

      return interactions
        .filter((interaction) => {
          if (drugId3 !== undefined && drugId4 !== undefined) {
            // Bidirectional search
            return (
              (interaction.drug1_id === drugId1 &&
                interaction.drug2_id === drugId2) ||
              (interaction.drug1_id === drugId3 &&
                interaction.drug2_id === drugId4)
            );
          }
          // Single direction or general interaction query
          return (
            interaction.drug1_id === drugId1 ||
            interaction.drug2_id === drugId1 ||
            interaction.drug1_id === drugId2 ||
            interaction.drug2_id === drugId2
          );
        })
        .map((interaction) => {
          const drug1 = drugs.find((d) => d.id === interaction.drug1_id);
          const drug2 = drugs.find((d) => d.id === interaction.drug2_id);
          return {
            ...interaction,
            drug1_name: drug1?.generic_name,
            drug2_name: drug2?.generic_name,
            interacting_drug:
              drugId1 === interaction.drug1_id
                ? drug2?.generic_name
                : drug1?.generic_name,
          };
        });
    }

    // Handle clinicalNote queries (updated table name)
    if (sql.includes("FROM clinicalNote")) {
      if (sql.includes("WHERE clinical_note_id")) {
        const clinicalNoteId = params[0];
        return clinicalNotes.filter(
          (note) => note.clinical_note_id === clinicalNoteId
        );
      }
      return clinicalNotes;
    }

    // Handle alternativeDrugs queries with JOINs (updated table name)
    if (sql.includes("FROM alternativeDrugs") && sql.includes("JOIN drug")) {
      if (sql.includes("WHERE ad.alternative_id")) {
        const alternativeId = params[0];

        return alternativeDrugs
          .filter((alt) => alt.alternative_id === alternativeId)
          .map((alt) => {
            const originalDrug = drugs.find(
              (d) => d.id === alt.replaced_drug_id
            );
            const alternativeDrug = drugs.find(
              (d) => d.id === alt.alternative_drug_id
            );
            return {
              ...alt,
              original_drug_id: alt.replaced_drug_id,
              original_drug_name: originalDrug?.generic_name,
              alternative_name: alternativeDrug?.generic_name,
              alternative_class: alternativeDrug?.drug_class,
              reason: `${alternativeDrug?.generic_name} may be a safer alternative to ${originalDrug?.generic_name}`,
              safety_note: "Monitor for effectiveness and adverse effects",
            };
          });
      }
      return alternativeDrugs;
    }

    // Handle conditionInteraction queries (updated table name)
    if (sql.includes("FROM conditionInteraction")) {
      if (
        sql.includes("WHERE interaction_id") &&
        sql.includes("AND condition_id")
      ) {
        const interactionId = params[0];
        const conditionId = params[1];

        const conditionInt = conditionInteraction.find(
          (ci) =>
            ci.interaction_id === interactionId &&
            ci.condition_id === conditionId
        );

        return conditionInt ? [conditionInt] : [];
      }
      return conditionInteraction;
    }

    // Handle symptomToconditions queries (updated table name)
    if (sql.includes("FROM symptomToconditions")) {
      if (sql.includes("WHERE condition_id")) {
        const conditionId = params[0];
        return symptomToCondition.filter(
          (stc) => stc.condition_id === conditionId
        );
      }
      if (sql.includes("WHERE symptom_id")) {
        const symptomId = params[0];
        return symptomToCondition.filter((stc) => stc.symptom_id === symptomId);
      }
      return symptomToCondition;
    }

    // Handle ConditionWithSymptoms view
    if (sql.includes("FROM ConditionWithSymptoms")) {
      return conditions.map((condition) => {
        const relatedSymptoms = symptomToCondition
          .filter((stc) => stc.condition_id === condition.id)
          .map((stc) => {
            const symptom = symptoms.find(
              (s) => s.symptom_id === stc.symptom_id
            );
            return symptom?.name;
          })
          .filter(Boolean);

        return {
          id: condition.id,
          condition_name: condition.name,
          description: condition.description,
          symptoms: relatedSymptoms.join(","),
        };
      });
    }

    // Default handlers for simple queries (updated table names)
    if (sql.includes("FROM drug")) {
      return drugs;
    }

    if (sql.includes("FROM conditions")) {
      return conditions;
    }

    if (sql.includes("FROM symptoms")) {
      return symptoms;
    }

    if (sql.includes("FROM interactions")) {
      return interactions;
    }

    return [];
  }

  async get(sql, params = []) {
    // Handle interaction queries with bidirectional search (updated table name)
    if (
      sql.includes("FROM interactions") &&
      (sql.includes("drug1_id = ?") || sql.includes("drug2_id = ?"))
    ) {
      const drug1Id = params[0];
      const drug2Id = params[1];
      const drug2Id_alt = params[2]; // For bidirectional
      const drug1Id_alt = params[3];

      const interaction = interactions.find(
        (i) =>
          (i.drug1_id === drug1Id && i.drug2_id === drug2Id) ||
          (i.drug1_id === drug2Id_alt && i.drug2_id === drug1Id_alt)
      );

      if (interaction) {
        return {
          ...interaction,
          mechanism: interaction.interaction_description, // Use description as mechanism
        };
      }
      return null;
    }

    // Handle conditionInteraction single record queries (updated table name)
    if (
      sql.includes("FROM conditionInteraction") &&
      sql.includes("WHERE interaction_id") &&
      sql.includes("AND condition_id")
    ) {
      const interactionId = params[0];
      const conditionId = params[1];

      const conditionInt = conditionInteraction.find(
        (ci) =>
          ci.interaction_id === interactionId && ci.condition_id === conditionId
      );

      if (conditionInt) {
        return {
          adjusted_severity_score: conditionInt.severity_score,
          adjusted_interaction_type: conditionInt.adjusted_interaction_type,
          condition_specific_note: `${conditionInt.adjusted_interaction_type} interaction in patients with this condition`,
        };
      }
      return null;
    }

    // Handle drug queries (updated table name)
    if (sql.includes("FROM drug WHERE id")) {
      const id = params[0];
      const drug = drugs.find((drug) => drug.id === id);
      if (drug) {
        return {
          ...drug,
          description: `${drug.drug_class} medication`, // Add description
        };
      }
      return null;
    }

    // Handle condition queries (updated table name)
    if (sql.includes("FROM conditions WHERE id")) {
      const id = params[0];
      return conditions.find((condition) => condition.id === id);
    }

    if (sql.includes("FROM conditions WHERE name")) {
      const name = params[0];
      return conditions.find((condition) =>
        condition.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Handle symptom queries (updated table name and column)
    if (sql.includes("FROM symptoms WHERE symptom_id")) {
      const id = params[0];
      return symptoms.find((symptom) => symptom.symptom_id === id);
    }

    if (sql.includes("FROM symptoms WHERE name")) {
      const name = params[0];
      return symptoms.find((symptom) =>
        symptom.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Handle clinical note queries
    if (sql.includes("FROM clinicalNote WHERE clinical_note_id")) {
      const id = params[0];
      return clinicalNotes.find((note) => note.clinical_note_id === id);
    }

    // Handle alternative drug queries
    if (sql.includes("FROM alternativeDrugs WHERE alternative_id")) {
      const id = params[0];
      return alternativeDrugs.find((alt) => alt.alternative_id === id);
    }

    // Handle count queries (updated table names)
    if (sql.includes("SELECT COUNT(*) as count FROM drug")) {
      return { count: drugs.length };
    }

    if (sql.includes("SELECT COUNT(*) as count FROM conditions")) {
      return { count: conditions.length };
    }

    if (sql.includes("SELECT COUNT(*) as count FROM symptoms")) {
      return { count: symptoms.length };
    }

    if (sql.includes("SELECT COUNT(*) as count FROM interactions")) {
      return { count: interactions.length };
    }

    if (sql.includes("SELECT COUNT(*) as count FROM clinicalNote")) {
      return { count: clinicalNotes.length };
    }

    if (sql.includes("SELECT COUNT(*) as count FROM alternativeDrugs")) {
      return { count: alternativeDrugs.length };
    }

    if (sql.includes("SELECT COUNT(*) as count FROM conditionInteraction")) {
      return { count: conditionInteraction.length };
    }

    if (sql.includes("SELECT COUNT(*) as count FROM symptomToconditions")) {
      return { count: symptomToCondition.length };
    }

    return null;
  }

  async run(sql, params = []) {
    return Promise.resolve({ id: 1, changes: 1 });
  }

  async exec(sql) {
    return Promise.resolve();
  }
}

module.exports = new MockDatabase();
