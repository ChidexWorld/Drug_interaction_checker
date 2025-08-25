const express = require("express");
const Joi = require("joi");
const database = require("../database/connection");

const router = express.Router();

// Validation schemas
const drugInteractionCheckSchema = Joi.object({
  drug1: Joi.string().min(1).max(100).required(),
  drug2: Joi.string().min(1).max(100).required(),
  condition_names: Joi.array().items(Joi.string().min(1).max(100)).optional(),
});

/**
 * @swagger
 * tags:
 *   name: DrugInteractionChecker
 *   description: Complete drug interaction checking workflow
 */

/**
 * @swagger
 * /api/drug-checker/search-drugs:
 *   get:
 *     summary: Search for drugs by name
 *     tags: [DrugInteractionChecker]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Drug name to search for
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of results
 *     responses:
 *       200:
 *         description: List of matching drugs
 */
router.get("/search-drugs", async (req, res, next) => {
  try {
    const { query, limit = 20 } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Query must be at least 2 characters long"
      });
    }

    const results = await searchDrug(query);
    const limitedResults = results.slice(0, parseInt(limit));
    
    // Get detailed information for each drug
    const drugsWithDetails = await Promise.all(
      limitedResults.map(async (drug) => {
        const details = await getDrugDetails(drug.id);
        return details;
      })
    );

    res.json({
      query,
      results: drugsWithDetails,
      total: drugsWithDetails.length
    });

  } catch (error) {
    console.error("Error searching drugs:", error);
    next({ type: "database", message: error.message });
  }
});

/**
 * @swagger
 * /api/drug-checker/drug-details:
 *   get:
 *     summary: Get detailed information for a drug by name
 *     tags: [DrugInteractionChecker]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Drug name (generic or brand name)
 *     responses:
 *       200:
 *         description: Drug details
 *       404:
 *         description: Drug not found
 */
router.get("/drug-details", async (req, res, next) => {
  try {
    const { name } = req.query;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Drug name is required"
      });
    }

    const drugResults = await searchDrug(name.trim());
    
    if (drugResults.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: `No drug found matching "${name}"`
      });
    }

    // Get the best match (first result)
    const selectedDrug = drugResults[0];
    const drugDetails = await getDrugDetails(selectedDrug.id);
    
    if (!drugDetails) {
      return res.status(404).json({
        error: "Not Found",
        message: "Drug details not found"
      });
    }

    res.json({
      search_term: name,
      drug: drugDetails,
      match_quality: selectedDrug.relevance_score === 1 ? "exact" : "partial"
    });

  } catch (error) {
    console.error("Error getting drug details:", error);
    next({ type: "database", message: error.message });
  }
});

/**
 * @swagger
 * /api/drug-checker/conditions:
 *   get:
 *     summary: Get list of all medical conditions
 *     tags: [DrugInteractionChecker]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional search term to filter conditions
 *     responses:
 *       200:
 *         description: List of conditions
 */
router.get("/conditions", async (req, res, next) => {
  try {
    const { search } = req.query;
    
    let query = `
      SELECT 
        id,
        name,
        description
      FROM \`Condition\`
    `;
    
    let params = [];
    
    if (search && search.trim().length > 0) {
      query += ` WHERE name LIKE ? OR description LIKE ?`;
      const searchTerm = `%${search.trim()}%`;
      params = [searchTerm, searchTerm];
    }
    
    query += ` ORDER BY name`;
    
    const conditions = await database.all(query, params);
    
    // Get symptoms for each condition
    const conditionsWithSymptoms = await Promise.all(
      conditions.map(async (condition) => {
        const symptoms = await database.all(
          `
          SELECT DISTINCT
            s.id,
            s.name,
            s.description,
            s.severity
          FROM symptoms s
          JOIN symptom_conditions stc ON s.id = stc.symptom_id
          WHERE stc.condition_id = ?
          ORDER BY s.severity DESC, s.name
          `,
          [condition.id]
        );
        
        return {
          ...condition,
          symptoms: symptoms
        };
      })
    );
    
    res.json({
      search_term: search || null,
      conditions: conditionsWithSymptoms,
      total: conditionsWithSymptoms.length
    });

  } catch (error) {
    console.error("Error getting conditions:", error);
    next({ type: "database", message: error.message });
  }
});

/**
 * @swagger
 * /api/drug-checker/condition-details:
 *   get:
 *     summary: Get detailed information for a specific condition
 *     tags: [DrugInteractionChecker]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Condition name
 *     responses:
 *       200:
 *         description: Condition details
 *       404:
 *         description: Condition not found
 */
router.get("/condition-details", async (req, res, next) => {
  try {
    const { name } = req.query;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Condition name is required"
      });
    }

    const condition = await database.get(
      `
      SELECT 
        id,
        name,
        description
      FROM \`Condition\`
      WHERE name = ?
      `,
      [name.trim()]
    );
    
    if (!condition) {
      return res.status(404).json({
        error: "Not Found",
        message: `No condition found matching "${name}"`
      });
    }

    // Get symptoms for this condition
    const symptoms = await database.all(
      `
      SELECT DISTINCT
        s.id,
        s.name,
        s.description,
        s.severity
      FROM symptoms s
      JOIN Symptom_To_Condition stc ON s.id = stc.symptom_id
      WHERE stc.condition_id = ?
      ORDER BY s.severity DESC, s.name
      `,
      [condition.id]
    );

    // Get related conditions (conditions that share symptoms)
    const relatedConditions = await database.all(
      `
      SELECT DISTINCT
        c.id,
        c.name,
        COUNT(DISTINCT stc.symptom_id) as shared_symptoms
      FROM \`Condition\` c
      JOIN Symptom_To_Condition stc ON c.id = stc.condition_id
      WHERE stc.symptom_id IN (
        SELECT symptom_id 
        FROM symptom_conditions 
        WHERE condition_id = ?
      )
      AND c.id != ?
      GROUP BY c.id, c.name
      HAVING shared_symptoms > 0
      ORDER BY shared_symptoms DESC, c.name
      LIMIT 5
      `,
      [condition.id, condition.id]
    );

    res.json({
      search_term: name,
      condition: {
        ...condition,
        symptoms: symptoms,
        symptom_count: symptoms.length,
        related_conditions: relatedConditions
      }
    });

  } catch (error) {
    console.error("Error getting condition details:", error);
    next({ type: "database", message: error.message });
  }
});

/**
 * @swagger
 * /api/drug-checker/search-and-check:
 *   post:
 *     summary: Search for 2 drugs and check their interactions with complete details
 *     tags: [DrugInteractionChecker]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               drug1:
 *                 type: string
 *                 description: First drug name (generic name or brand name)
 *               drug2:
 *                 type: string
 *                 description: Second drug name (generic name or brand name)
 *               condition_names:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Optional condition names for context-specific interactions (e.g., ["Hypertension", "Diabetes Mellitus"])
 *     responses:
 *       200:
 *         description: Complete interaction analysis
 */
router.post("/search-and-check", async (req, res, next) => {
  try {
    const { error, value } = drugInteractionCheckSchema.validate(req.body);
    if (error) {
      return next({
        type: "validation",
        message: error.details[0].message,
        details: error.details,
      });
    }

    const { drug1, drug2, condition_names = [] } = value;

    // Step 1: Search for both drugs by generic name or brand name
    const drug1Results = await searchDrug(drug1);
    const drug2Results = await searchDrug(drug2);

    if (drug1Results.length === 0) {
      return res.status(404).json({
        error: "Drug not found",
        message: `No drug found matching "${drug1}"`,
      });
    }

    if (drug2Results.length === 0) {
      return res.status(404).json({
        error: "Drug not found",
        message: `No drug found matching "${drug2}"`,
      });
    }

    // Get the best match (first result) for each drug
    const selectedDrug1 = drug1Results[0];
    const selectedDrug2 = drug2Results[0];

    // Step 2: Get detailed drug information including brands
    const drug1Details = await getDrugDetails(selectedDrug1.id);
    const drug2Details = await getDrugDetails(selectedDrug2.id);

    // Step 3: Check for interactions between the two drugs
    const interactionResult = await checkDrugInteraction(
      selectedDrug1.id,
      selectedDrug2.id,
      condition_names
    );

    // Step 4: Get clinical notes if interaction exists
    let clinicalNotes = [];
    let alternativeDrugs = [];
    
    if (interactionResult) {
      clinicalNotes = await getClinicalNotes(interactionResult.id);
      
      // Step 5: Get alternative drugs if interaction is Major or Contraindicated
      if (interactionResult.severity_score >= 3) {
        alternativeDrugs = await getAlternativeDrugs(interactionResult.id);
      }
    }

    // Prepare response
    const response = {
      search_terms: { drug1, drug2 },
      drugs: {
        drug1: drug1Details,
        drug2: drug2Details,
      },
      interaction: interactionResult ? {
        exists: true,
        interaction_type: interactionResult.interaction_type,
        severity_score: interactionResult.severity_score,
        description: interactionResult.description,
        mechanism: interactionResult.mechanism,
        risk_level: getRiskLevel(interactionResult.severity_score),
        risk_color: getRiskColor(interactionResult.severity_score),
        condition_adjusted: !!interactionResult.condition_adjusted,
        condition_note: interactionResult.condition_note || null,
      } : {
        exists: false,
        message: "No known interaction between these drugs",
        risk_level: "No Known Interactions",
        risk_color: "#6c757d",
      },
      clinical_notes: clinicalNotes,
      alternative_drugs: alternativeDrugs,
      recommendations: generateRecommendations(interactionResult, alternativeDrugs),
    };

    res.json(response);

  } catch (error) {
    console.error("Error in drug interaction checker:", error);
    next({ type: "database", message: error.message });
  }
});

/**
 * Search for a drug by generic name or brand name
 */
async function searchDrug(searchTerm) {
  const term = `%${searchTerm.toLowerCase()}%`;
  
  const results = await database.all(
    `
    SELECT DISTINCT
        d.id,
        d.generic_name,
        d.drug_class,
        d.description,
        CASE 
            WHEN LOWER(d.generic_name) LIKE ? THEN 1
            ELSE 2
        END as relevance_score
    FROM drugs d
    WHERE 
        LOWER(d.generic_name) LIKE ?
    ORDER BY relevance_score, d.generic_name
    LIMIT 5
    `,
    [term]
  );

  return results;
}

/**
 * Get detailed drug information including brands and manufacturers
 */
async function getDrugDetails(drugId) {
  const drug = await database.get(
    `
    SELECT 
        d.id,
        d.generic_name,
        d.drug_class,
        d.description
    FROM drugs d
    WHERE d.id = ?
    `,
    [drugId]
  );

  if (!drug) return null;

  // Parse brands and manufacturers from JSON
  let brandsData = [];
  try {
    const brands = JSON.parse(drug.brands || '[]');
    const manufacturers = JSON.parse(drug.manufacturers || '[]');
    brandsData = brands.map((brand, index) => ({
      brand_name: brand,
      manufacturer: manufacturers[index] || 'Unknown'
    }));
  } catch (e) {
    brandsData = [];
  }

  // Extract brands and manufacturers arrays that correspond by index (no duplicates)
  const brands = brandsData.map(b => b.brand_name);
  const manufacturers = brandsData.map(b => b.manufacturer);

  return {
    ...drug,
    brands: brands,
    manufacturers: manufacturers,
  };
}


/**
 * Check for interaction between two drugs
 */
async function checkDrugInteraction(drug1Id, drug2Id, conditionNames = []) {
  // Check for interaction (both directions)
  let interaction = await database.get(
    `
    SELECT 
        i.id,
        i.drug1_id,
        i.drug2_id,
        i.interaction_type,
        i.severity_score,
        i.description,
        i.mechanism
    FROM interactions i
    WHERE 
        (i.drug1_id = ? AND i.drug2_id = ?) OR
        (i.drug1_id = ? AND i.drug2_id = ?)
    `,
    [drug1Id, drug2Id, drug2Id, drug1Id]
  );

  if (!interaction) return null;

  // Check for condition-specific adjustments
  if (conditionNames.length > 0) {
    for (const conditionName of conditionNames) {
      // First get the condition ID from condition name
      const condition = await database.get(
        `SELECT id FROM \`Condition\` WHERE name = ?`,
        [conditionName]
      );
      
      if (condition) {
        const conditionAdjustment = await database.get(
          `
          SELECT 
              adjusted_severity_score,
              adjusted_interaction_type,
              condition_specific_note
          FROM condition_interactions
          WHERE interaction_id = ? AND condition_id = ?
          `,
          [interaction.id, condition.id]
        );

        if (conditionAdjustment) {
          interaction.severity_score = conditionAdjustment.adjusted_severity_score;
          interaction.interaction_type = conditionAdjustment.adjusted_interaction_type;
          interaction.condition_note = conditionAdjustment.condition_specific_note;
          interaction.condition_adjusted = true;
          break; // Use first matching condition adjustment
        }
      }
    }
  }

  return interaction;
}

/**
 * Get clinical notes for an interaction
 */
async function getClinicalNotes(interactionId) {
  return await database.all(
    `
    SELECT 
        id,
        clinical_note,
        note_type,
        recommendation
    FROM clinical_notes
    WHERE interaction_id = ?
    ORDER BY id
    `,
    [interactionId]
  );
}

/**
 * Get alternative drugs for major/contraindicated interactions
 */
async function getAlternativeDrugs(interactionId) {
  return await database.all(
    `
    SELECT 
        ad.original_drug_id,
        ad.alternative_drug_id,
        ad.reason,
        ad.safety_note,
        d_orig.generic_name as original_drug_name,
        d_alt.generic_name as alternative_name,
        d_alt.drug_class as alternative_class
    FROM alternative_drugs ad
    JOIN Drug d_orig ON ad.original_drug_id = d_orig.id
    JOIN Drug d_alt ON ad.alternative_drug_id = d_alt.id
    WHERE ad.interaction_id = ?
    ORDER BY d_alt.generic_name
    `,
    [interactionId]
  );
}

/**
 * Generate recommendations based on interaction analysis
 */
function generateRecommendations(interaction, alternativeDrugs) {
  const recommendations = [];

  if (!interaction) {
    recommendations.push({
      type: "safe",
      message: "No known interactions detected between these drugs.",
      priority: "low",
    });
    return recommendations;
  }

  switch (interaction.severity_score) {
    case 4: // Contraindicated
      recommendations.push({
        type: "contraindicated",
        message: "This combination is contraindicated and should not be used together.",
        priority: "critical",
      });
      break;
    
    case 3: // Major
      recommendations.push({
        type: "major",
        message: "Major interaction detected. Use with extreme caution and close monitoring.",
        priority: "high",
      });
      break;
    
    case 2: // Moderate
      recommendations.push({
        type: "moderate",
        message: "Moderate interaction. Monitor patient closely for adverse effects.",
        priority: "medium",
      });
      break;
    
    case 1: // Minor
      recommendations.push({
        type: "minor",
        message: "Minor interaction. Generally safe with standard monitoring.",
        priority: "low",
      });
      break;
  }

  if (alternativeDrugs.length > 0) {
    recommendations.push({
      type: "alternatives",
      message: "Consider the suggested alternative medications listed below.",
      priority: "medium",
    });
  }

  return recommendations;
}

// Helper functions
function getRiskLevel(severityScore) {
  switch (severityScore) {
    case 4:
      return "Contraindicated";
    case 3:
      return "Major";
    case 2:
      return "Moderate";
    case 1:
      return "Minor";
    default:
      return "No Known Interactions";
  }
}

function getRiskColor(severityScore) {
  switch (severityScore) {
    case 4:
      return "#dc3545"; // Red
    case 3:
      return "#fd7e14"; // Orange
    case 2:
      return "#ffc107"; // Yellow
    case 1:
      return "#28a745"; // Green
    default:
      return "#6c757d"; // Gray
  }
}

module.exports = router;