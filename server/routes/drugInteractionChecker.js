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
        message: "Query must be at least 2 characters long",
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
      total: drugsWithDetails.length,
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
        message: "Drug name is required",
      });
    }

    const drugResults = await searchDrug(name.trim());

    if (drugResults.length === 0) {
      return res.status(404).json({
        error: "Not Found",
        message: `No drug found matching "${name}"`,
      });
    }

    // Get the best match (first result)
    const selectedDrug = drugResults[0];
    const drugDetails = await getDrugDetails(selectedDrug.id);

    if (!drugDetails) {
      return res.status(404).json({
        error: "Not Found",
        message: "Drug details not found",
      });
    }

    res.json({
      search_term: name,
      drug: drugDetails,
      match_quality: selectedDrug.relevance_score === 1 ? "exact" : "partial",
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
      FROM conditions
    `;

    let params = [];

    if (search && search.trim().length > 0) {
      query += ` WHERE name LIKE ? OR description LIKE ?`;
      const searchTerm = `%${search.trim()}%`;
      params = [searchTerm, searchTerm];
    }

    query += ` ORDER BY id ASC`;

    const conditions = await database.all(query, params);

    // Get symptoms for each condition
    const conditionsWithSymptoms = await Promise.all(
      conditions.map(async (condition) => {
        const symptoms = await database.all(
          `
          SELECT DISTINCT
            s.symptom_id,
            s.name
          FROM symptoms s
          JOIN symptomToconditions stc ON s.symptom_id = stc.symptom_id
          WHERE stc.condition_id = ?
          ORDER BY s.name
          `,
          [condition.id]
        );

        return {
          ...condition,
          symptoms: symptoms,
        };
      })
    );

    res.json({
      search_term: search || null,
      conditions: conditionsWithSymptoms,
      total: conditionsWithSymptoms.length,
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
        message: "Condition name is required",
      });
    }

    const condition = await database.get(
      `
      SELECT 
        id,
        name,
        description
      FROM conditions
      WHERE name = ?
      `,
      [name.trim()]
    );

    if (!condition) {
      return res.status(404).json({
        error: "Not Found",
        message: `No condition found matching "${name}"`,
      });
    }

    // Get symptoms for this condition
    const symptoms = await database.all(
      `
      SELECT DISTINCT
        s.symptom_id,
        s.name
      FROM symptoms s
      JOIN symptomToconditions stc ON s.symptom_id = stc.symptom_id
      WHERE stc.condition_id = ?
      ORDER BY s.name
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
      FROM conditions c
      JOIN symptomToconditions stc ON c.id = stc.condition_id
      WHERE stc.symptom_id IN (
        SELECT symptom_id 
        FROM symptomToconditions 
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
        related_conditions: relatedConditions,
      },
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
      interaction: interactionResult
        ? {
            exists: true,
            interaction_type: interactionResult.interaction_type,
            severity_score: interactionResult.severity_score,
            description: interactionResult.interaction_description,
            mechanism: interactionResult.interaction_description, // Use description as mechanism
            risk_level: getRiskLevel(interactionResult.severity_score),
            risk_color: getRiskColor(interactionResult.severity_score),
            condition_adjusted: !!interactionResult.condition_adjusted,
            condition_note: interactionResult.condition_note || null,
          }
        : {
            exists: false,
            message: "No known interaction between these drugs",
            risk_level: "No Known Interactions",
            risk_color: "#6c757d",
          },
      clinical_notes: clinicalNotes,
      alternative_drugs: alternativeDrugs,
      recommendations: generateRecommendations(
        interactionResult,
        alternativeDrugs
      ),
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
        CASE 
            WHEN LOWER(d.generic_name) LIKE ? THEN 1
            WHEN LOWER(d.brand_name_1) LIKE ? THEN 2
            WHEN LOWER(d.brand_name_2) LIKE ? THEN 2
            ELSE 3
        END as relevance_score
    FROM drug d
    WHERE 
        LOWER(d.generic_name) LIKE ? OR
        LOWER(d.brand_name_1) LIKE ? OR
        LOWER(d.brand_name_2) LIKE ?
    ORDER BY relevance_score, d.generic_name
    LIMIT 20
    `,
    [term, term, term, term, term, term]
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
        d.brand_name_1,
        d.manufacturer_1,
        d.brand_name_2,
        d.manufacturer_2
    FROM drug d
    WHERE d.id = ?
    `,
    [drugId]
  );

  if (!drug) return null;

  // Create brands and manufacturers arrays
  const brands = [];
  const manufacturers = [];

  if (drug.brand_name_1) {
    brands.push(drug.brand_name_1);
    manufacturers.push(drug.manufacturer_1 || "Unknown");
  }

  if (drug.brand_name_2) {
    brands.push(drug.brand_name_2);
    manufacturers.push(drug.manufacturer_2 || "Unknown");
  }

  return {
    id: drug.id,
    generic_name: drug.generic_name,
    drug_class: drug.drug_class,
    brands: brands,
    manufacturers: manufacturers,
    description: `${drug.drug_class} medication`,
  };
}

  /**
   * Check for interaction between two drugs
   */
/**
 * Check for interaction between two drugs
 */
async function checkDrugInteraction(drug1Id, drug2Id, conditionNames = []) {
  // Step 1: Get base interaction (both directions)
  let interaction = await database.get(
    `
    SELECT 
        i.id,
        i.drug1_id,
        i.drug2_id,
        i.interaction_type,
        i.severity_score,
        i.interaction_description,
        i.clinical_note_id,
        i.alternative_id
    FROM interactions i
    WHERE 
        (i.drug1_id = ? AND i.drug2_id = ?) OR
        (i.drug1_id = ? AND i.drug2_id = ?)
    `,
    [drug1Id, drug2Id, drug2Id, drug1Id]
  );

  if (!interaction) return null;

  // Step 2: If conditions exist, try to fetch adjustment in one query
  if (conditionNames.length > 0) {
    const placeholders = conditionNames.map(() => "?").join(", ");
    const conditionAdjustment = await database.get(
      `
      SELECT 
          ci.adjusted_interaction_type,
          ci.severity_score,
          c.name AS condition_name
      FROM conditionInteraction ci
      JOIN conditions c ON ci.condition_id = c.id
      WHERE ci.interaction_id = ?
      AND c.name IN (${placeholders})
      LIMIT 1
      `,
      [interaction.id, ...conditionNames]
    );

    if (conditionAdjustment) {
      interaction.interaction_type = conditionAdjustment.adjusted_interaction_type;
      interaction.severity_score = conditionAdjustment.severity_score;
      interaction.condition_note = `Adjusted for ${conditionAdjustment.condition_name} condition`;
      interaction.condition_adjusted = true;
    }
  }

  return interaction;
}

/**
 * Get clinical notes for an interaction
 */
async function getClinicalNotes(interactionId) {
  // Get the clinical note ID from the interaction
  const interaction = await database.get(
    `SELECT clinical_note_id FROM interactions WHERE id = ?`,
    [interactionId]
  );

  if (!interaction || !interaction.clinical_note_id) return [];

  const clinicalNote = await database.get(
    `
    SELECT 
        clinical_note_id,
        clinical_note
    FROM clinicalNote
    WHERE clinical_note_id = ?
    `,
    [interaction.clinical_note_id]
  );

  return clinicalNote
    ? [
        {
          id: clinicalNote.clinical_note_id,
          clinical_note: clinicalNote.clinical_note,
          note_type: "general",
          recommendation: "Follow clinical guidance and monitor closely",
        },
      ]
    : [];
}

/**
 * Get alternative drugs for major/contraindicated interactions
 */
async function getAlternativeDrugs(interactionId) {
  // Get the alternative ID from the interaction
  const interaction = await database.get(
    `SELECT alternative_id FROM interactions WHERE id = ?`,
    [interactionId]
  );

  if (!interaction || !interaction.alternative_id) return [];

  const alternative = await database.get(
    `
    SELECT 
        ad.alternative_id,
        ad.replaced_drug_id,
        ad.alternative_drug_id
    FROM alternativeDrugs ad
    WHERE ad.alternative_id = ?
    `,
    [interaction.alternative_id]
  );

  if (!alternative) return [];

  // Get drug details for both original and alternative
  const originalDrug = await database.get(
    `SELECT id, generic_name, drug_class FROM drug WHERE id = ?`,
    [alternative.replaced_drug_id]
  );

  const alternativeDrug = await database.get(
    `SELECT id, generic_name, drug_class FROM drug WHERE id = ?`,
    [alternative.alternative_drug_id]
  );

  if (!originalDrug || !alternativeDrug) return [];

  return [
    {
      original_drug_id: alternative.replaced_drug_id,
      alternative_drug_id: alternative.alternative_drug_id,
      original_drug_name: originalDrug.generic_name,
      alternative_name: alternativeDrug.generic_name,
      alternative_class: alternativeDrug.drug_class,
      reason: `${alternativeDrug.generic_name} may be a safer alternative to ${originalDrug.generic_name}`,
      safety_note: "Monitor for effectiveness and adverse effects",
    },
  ];
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
        message:
          "This combination is contraindicated and should not be used together.",
        priority: "critical",
      });
      break;

    case 3: // Major
      recommendations.push({
        type: "major",
        message:
          "Major interaction detected. Use with extreme caution and close monitoring.",
        priority: "high",
      });
      break;

    case 2: // Moderate
      recommendations.push({
        type: "moderate",
        message:
          "Moderate interaction. Monitor patient closely for adverse effects.",
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
