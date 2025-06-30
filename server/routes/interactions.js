const express = require('express');
const Joi = require('joi');
const database = require('../database/connection');

const router = express.Router();

// Validation schemas
const checkInteractionSchema = Joi.object({
    drug_ids: Joi.array().items(Joi.number().integer().positive()).min(2).max(10).required(),
    condition_id: Joi.number().integer().positive().optional()
});

// POST /api/interactions/check - Check interactions between multiple drugs
router.post('/check', async (req, res, next) => {
    try {
        const { error, value } = checkInteractionSchema.validate(req.body);
        if (error) {
            return next({
                type: 'validation',
                message: error.details[0].message,
                details: error.details
            });
        }

        const { drug_ids, condition_id } = value;

        // Get drug names for the provided IDs
        const drugs = await database.all(`
            SELECT id, generic_name, drug_class
            FROM Drug
            WHERE id IN (${drug_ids.map(() => '?').join(',')})
        `, drug_ids);

        if (drugs.length !== drug_ids.length) {
            return res.status(400).json({
                error: 'Invalid drug IDs',
                message: 'One or more drug IDs are invalid'
            });
        }

        // Find all interactions between the provided drugs
        const interactions = [];
        
        for (let i = 0; i < drug_ids.length; i++) {
            for (let j = i + 1; j < drug_ids.length; j++) {
                const drug1_id = drug_ids[i];
                const drug2_id = drug_ids[j];

                // Check for interaction (both directions)
                const interaction = await database.get(`
                    SELECT 
                        i.id,
                        i.drug1_id,
                        i.drug2_id,
                        i.interaction_type,
                        i.severity_score,
                        i.description,
                        i.mechanism,
                        d1.generic_name as drug1_name,
                        d2.generic_name as drug2_name
                    FROM Interaction i
                    JOIN Drug d1 ON i.drug1_id = d1.id
                    JOIN Drug d2 ON i.drug2_id = d2.id
                    WHERE 
                        (i.drug1_id = ? AND i.drug2_id = ?) OR
                        (i.drug1_id = ? AND i.drug2_id = ?)
                `, [drug1_id, drug2_id, drug2_id, drug1_id]);

                if (interaction) {
                    let finalInteraction = { ...interaction };

                    // Check for condition-specific adjustments
                    if (condition_id) {
                        const conditionAdjustment = await database.get(`
                            SELECT 
                                adjusted_severity_score,
                                adjusted_interaction_type,
                                condition_specific_note
                            FROM Condition_Interaction
                            WHERE interaction_id = ? AND condition_id = ?
                        `, [interaction.id, condition_id]);

                        if (conditionAdjustment) {
                            finalInteraction.severity_score = conditionAdjustment.adjusted_severity_score;
                            finalInteraction.interaction_type = conditionAdjustment.adjusted_interaction_type;
                            finalInteraction.condition_note = conditionAdjustment.condition_specific_note;
                            finalInteraction.condition_adjusted = true;
                        }
                    }

                    // Get clinical notes
                    const clinicalNotes = await database.all(`
                        SELECT note_type, clinical_note, recommendation
                        FROM Clinical_Note
                        WHERE interaction_id = ?
                        ORDER BY note_type
                    `, [interaction.id]);

                    finalInteraction.clinical_notes = clinicalNotes;

                    // Get alternative drugs
                    const alternatives = await database.all(`
                        SELECT 
                            ad.original_drug_id,
                            ad.reason,
                            ad.safety_note,
                            d.generic_name as alternative_name,
                            d.drug_class as alternative_class
                        FROM Alternative_Drug ad
                        JOIN Drug d ON ad.alternative_drug_id = d.id
                        WHERE ad.interaction_id = ?
                    `, [interaction.id]);

                    finalInteraction.alternatives = alternatives;

                    interactions.push(finalInteraction);
                }
            }
        }

        // Calculate overall risk level
        const maxSeverity = interactions.length > 0 ? Math.max(...interactions.map(i => i.severity_score)) : 0;
        const riskLevel = getRiskLevel(maxSeverity);
        const riskColor = getRiskColor(maxSeverity);

        res.json({
            drugs,
            interactions,
            summary: {
                total_interactions: interactions.length,
                max_severity: maxSeverity,
                risk_level: riskLevel,
                risk_color: riskColor,
                condition_considered: !!condition_id
            }
        });
    } catch (error) {
        console.error('Error checking interactions:', error);
        next({ type: 'database', message: error.message });
    }
});

// Helper functions
function getRiskLevel(severityScore) {
    switch (severityScore) {
        case 4: return 'Contraindicated';
        case 3: return 'Major';
        case 2: return 'Moderate';
        case 1: return 'Minor';
        default: return 'No Known Interactions';
    }
}

function getRiskColor(severityScore) {
    switch (severityScore) {
        case 4: return '#dc3545'; // Red
        case 3: return '#fd7e14'; // Orange
        case 2: return '#ffc107'; // Yellow
        case 1: return '#28a745'; // Green
        default: return '#6c757d'; // Gray
    }
}

module.exports = router;
