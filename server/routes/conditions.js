const express = require('express');
const database = require('../database/connection');

const router = express.Router();

// GET /api/conditions - Get all conditions
router.get('/', async (req, res, next) => {
    try {
        const conditions = await database.all(`
            SELECT 
                c.id,
                c.name,
                c.description,
                c.severity_level,
                GROUP_CONCAT(s.name) as symptoms
            FROM Condition c
            LEFT JOIN Condition_Symptom_Map csm ON c.id = csm.condition_id
            LEFT JOIN Symptom s ON csm.symptom_id = s.id
            GROUP BY c.id, c.name, c.description, c.severity_level
            ORDER BY c.name
        `);

        res.json({
            conditions: conditions.map(condition => ({
                ...condition,
                symptoms: condition.symptoms ? condition.symptoms.split(',') : []
            }))
        });
    } catch (error) {
        console.error('Error fetching conditions:', error);
        next({ type: 'database', message: error.message });
    }
});

// GET /api/conditions/:id - Get specific condition details
router.get('/:id', async (req, res, next) => {
    try {
        const conditionId = parseInt(req.params.id);
        
        if (isNaN(conditionId)) {
            return res.status(400).json({
                error: 'Invalid condition ID',
                message: 'Condition ID must be a number'
            });
        }

        const condition = await database.get(`
            SELECT id, name, description, severity_level, created_at
            FROM Condition
            WHERE id = ?
        `, [conditionId]);

        if (!condition) {
            return res.status(404).json({
                error: 'Condition not found',
                message: 'No condition found with the specified ID'
            });
        }

        // Get symptoms for this condition
        const symptoms = await database.all(`
            SELECT 
                s.id,
                s.name,
                s.description,
                csm.relevance_score
            FROM Symptom s
            JOIN Condition_Symptom_Map csm ON s.id = csm.symptom_id
            WHERE csm.condition_id = ?
            ORDER BY csm.relevance_score DESC, s.name
        `, [conditionId]);

        res.json({
            ...condition,
            symptoms
        });
    } catch (error) {
        console.error('Error fetching condition details:', error);
        next({ type: 'database', message: error.message });
    }
});

// GET /api/conditions/:id/interactions - Get condition-specific interaction adjustments
router.get('/:id/interactions', async (req, res, next) => {
    try {
        const conditionId = parseInt(req.params.id);
        
        if (isNaN(conditionId)) {
            return res.status(400).json({
                error: 'Invalid condition ID',
                message: 'Condition ID must be a number'
            });
        }

        const interactions = await database.all(`
            SELECT 
                ci.id,
                ci.adjusted_severity_score,
                ci.adjusted_interaction_type,
                ci.condition_specific_note,
                i.interaction_type as original_type,
                i.severity_score as original_severity,
                i.description,
                d1.generic_name as drug1_name,
                d2.generic_name as drug2_name
            FROM Condition_Interaction ci
            JOIN Interaction i ON ci.interaction_id = i.id
            JOIN Drug d1 ON i.drug1_id = d1.id
            JOIN Drug d2 ON i.drug2_id = d2.id
            WHERE ci.condition_id = ?
            ORDER BY ci.adjusted_severity_score DESC
        `, [conditionId]);

        res.json({
            condition_id: conditionId,
            interactions,
            count: interactions.length
        });
    } catch (error) {
        console.error('Error fetching condition interactions:', error);
        next({ type: 'database', message: error.message });
    }
});

module.exports = router;
