// Mock data for testing without database setup

// Import all data from separate files
const drugs = require('../data/drugs');
const conditions = require('../data/conditions');
const symptoms = require('../data/symptoms');
const symptomToCondition = require('../data/symptomToCondition');
const conditionInteraction = require('../data/conditionInteraction');
const interactions = require('../data/interactions');
const clinicalNotes = require('../data/clinicalNotes');
const alternativeDrugs = require('../data/alternativeDrugs');

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
    // Handle complex drug search queries
    if (sql.includes("FROM Drug") && sql.includes("LIKE")) {
      const searchTerm = params[0] || params[1] || params[2];
      if (searchTerm) {
        const term = searchTerm.replace(/%/g, "").toLowerCase();
        
        // Search by generic name and brands
        const matchingDrugs = drugs.filter(drug => {
          const genericMatch = drug.generic_name.toLowerCase().includes(term);
          const brandMatch = drug.brands.some(brand => 
            brand.toLowerCase().includes(term)
          );
          return genericMatch || brandMatch;
        }).map(drug => ({
          ...drug,
          relevance_score: drug.generic_name.toLowerCase().includes(term) ? 1 : 2,
          brands: drug.brands.map((brand, index) => 
            `${brand} (${drug.manufacturers[index] || drug.manufacturers[0]})`
          ).join(',')
        }));

        return matchingDrugs.sort((a, b) => a.relevance_score - b.relevance_score);
      }
    }

    // Handle Drug_Brand table queries
    if (sql.includes("FROM Drug_Brand")) {
      const drugBrands = [];
      drugs.forEach(drug => {
        drug.brands.forEach((brand, index) => {
          drugBrands.push({
            drug_id: drug.id,
            brand_name: brand,
            manufacturer: drug.manufacturers[index] || drug.manufacturers[0],
            country: 'Nigeria' // Default country
          });
        });
      });

      if (sql.includes("WHERE drug_id")) {
        const drugId = params[0];
        return drugBrands.filter(brand => brand.drug_id === drugId);
      }
      return drugBrands;
    }

    // Handle Interaction queries with JOINs
    if (sql.includes("FROM Interaction") && sql.includes("JOIN Drug")) {
      const drugId1 = params[0];
      const drugId2 = params[1];
      const drugId3 = params[2]; // For bidirectional search
      const drugId4 = params[3];

      return interactions.filter(interaction => {
        if (drugId3 !== undefined && drugId4 !== undefined) {
          // Bidirectional search
          return (interaction.drug1_id === drugId1 && interaction.drug2_id === drugId2) ||
                 (interaction.drug1_id === drugId3 && interaction.drug2_id === drugId4);
        }
        // Single direction or general interaction query
        return interaction.drug1_id === drugId1 || 
               interaction.drug2_id === drugId1 ||
               interaction.drug1_id === drugId2 || 
               interaction.drug2_id === drugId2;
      }).map(interaction => {
        const drug1 = drugs.find(d => d.id === interaction.drug1_id);
        const drug2 = drugs.find(d => d.id === interaction.drug2_id);
        return {
          ...interaction,
          drug1_name: drug1?.generic_name,
          drug2_name: drug2?.generic_name,
          interacting_drug: drugId1 === interaction.drug1_id ? drug2?.generic_name : drug1?.generic_name
        };
      });
    }

    // Handle Clinical_Note queries
    if (sql.includes("FROM Clinical_Note")) {
      if (sql.includes("WHERE interaction_id")) {
        const interactionId = params[0];
        return clinicalNotes.filter(note => {
          const interaction = interactions.find(i => 
            i.id === interactionId && i.clinical_note_id === note.clinical_note_id
          );
          return !!interaction;
        }).map(note => ({
          clinical_note_id: note.clinical_note_id,
          clinical_note: note.clinical_note,
          note_type: 'general',
          recommendation: 'Monitor closely and follow clinical guidance'
        }));
      }
      return clinicalNotes;
    }

    // Handle Alternative_Drug queries with JOINs
    if (sql.includes("FROM Alternative_Drug") && sql.includes("JOIN Drug")) {
      if (sql.includes("WHERE ad.interaction_id")) {
        const interactionId = params[0];
        
        return alternativeDrugs.filter(alt => {
          const interaction = interactions.find(i => i.id === interactionId && i.alternative_id === alt.alternative_id);
          return !!interaction;
        }).map(alt => {
          const originalDrug = drugs.find(d => d.id === alt.replaced_drug_id);
          const alternativeDrug = drugs.find(d => d.id === alt.alternative_drug_id);
          return {
            ...alt,
            original_drug_id: alt.replaced_drug_id,
            original_drug_name: originalDrug?.generic_name,
            alternative_name: alternativeDrug?.generic_name,
            alternative_class: alternativeDrug?.drug_class,
            reason: `${alternativeDrug?.generic_name} may be a safer alternative to ${originalDrug?.generic_name}`,
            safety_note: 'Monitor for effectiveness and adverse effects'
          };
        });
      }
      return alternativeDrugs;
    }

    // Handle Condition_Interaction queries
    if (sql.includes("FROM Condition_Interaction")) {
      if (sql.includes("WHERE interaction_id") && sql.includes("AND condition_id")) {
        const interactionId = params[0];
        const conditionId = params[1];
        
        const conditionInt = conditionInteraction.find(ci => 
          ci.interaction_id === interactionId && ci.condition_id === conditionId
        );
        
        return conditionInt ? [conditionInt] : [];
      }
      return conditionInteraction;
    }

    // Default handlers for simple queries
    if (sql.includes("FROM Drug")) {
      return drugs;
    }

    if (sql.includes("FROM Condition")) {
      return conditions;
    }

    if (sql.includes("FROM Symptom")) {
      return symptoms;
    }

    if (sql.includes("FROM SymptomToCondition")) {
      return symptomToCondition;
    }

    if (sql.includes("FROM Interaction")) {
      return interactions;
    }

    return [];
  }

  async get(sql, params = []) {
    // Handle interaction queries with bidirectional search
    if (sql.includes("FROM Interaction") && (sql.includes("drug1_id = ?") || sql.includes("drug2_id = ?"))) {
      const drug1Id = params[0];
      const drug2Id = params[1];
      const drug2Id_alt = params[2]; // For bidirectional
      const drug1Id_alt = params[3];
      
      const interaction = interactions.find(i => 
        (i.drug1_id === drug1Id && i.drug2_id === drug2Id) ||
        (i.drug1_id === drug2Id_alt && i.drug2_id === drug1Id_alt)
      );
      
      if (interaction) {
        return {
          ...interaction,
          mechanism: interaction.interaction_description // Use description as mechanism
        };
      }
      return null;
    }

    // Handle Condition_Interaction single record queries
    if (sql.includes("FROM Condition_Interaction") && sql.includes("WHERE interaction_id") && sql.includes("AND condition_id")) {
      const interactionId = params[0];
      const conditionId = params[1];
      
      const conditionInt = conditionInteraction.find(ci => 
        ci.interaction_id === interactionId && ci.condition_id === conditionId
      );
      
      if (conditionInt) {
        return {
          adjusted_severity_score: conditionInt.severity_score,
          adjusted_interaction_type: conditionInt.adjusted_interaction_type,
          condition_specific_note: `${conditionInt.adjusted_interaction_type} interaction in patients with this condition`
        };
      }
      return null;
    }

    // Handle Drug queries
    if (sql.includes("FROM Drug WHERE id")) {
      const id = params[0];
      const drug = drugs.find((drug) => drug.id === id);
      if (drug) {
        return {
          ...drug,
          description: `${drug.drug_class} medication` // Add description
        };
      }
      return null;
    }

    // Handle simple lookups
    if (sql.includes("FROM Condition WHERE id")) {
      const id = params[0];
      return conditions.find((condition) => condition.id === id);
    }

    if (sql.includes("FROM Symptom WHERE id")) {
      const id = params[0];
      return symptoms.find((symptom) => symptom.id === id);
    }

    // Handle count queries
    if (sql.includes("SELECT COUNT(*) as count FROM Drug")) {
      return { count: drugs.length };
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