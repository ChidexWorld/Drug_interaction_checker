const express = require('express');
const Joi = require('joi');
const database = require('../database/connection');

const router = express.Router();

// Validation schemas
const searchSchema = Joi.object({
    query: Joi.string().min(1).max(100).required(),
    limit: Joi.number().integer().min(1).max(50).default(20)
});

// GET /api/symptoms - Get all symptoms
router.get('/', async (req, res, next) => {
    try {
        const symptoms = await database.all(`
            SELECT 
                s.id,
                s.name,
                s.description,
                GROUP_CONCAT(c.name) as related_conditions
            FROM Symptom s
            LEFT JOIN Condition_Symptom_Map csm ON s.id = csm.symptom_id
            LEFT JOIN Condition c ON csm.condition_id = c.id
            GROUP BY s.id, s.name, s.description
            ORDER BY s.name
        `);

        res.json({
            symptoms: symptoms.map(symptom => ({
                ...symptom,
                related_conditions: symptom.related_conditions ? symptom.related_conditions.split(',') : []
            }))
        });
    } catch (error) {
        console.error('Error fetching symptoms:', error);
        next({ type: 'database', message: error.message });
    }
});

// GET /api/symptoms/search - Search symptoms by name
router.get('/search', async (req, res, next) => {
    try {
        const { error, value } = searchSchema.validate(req.query);
        if (error) {
            return next({
                type: 'validation',
                message: error.details[0].message,
                details: error.details
            });
        }

        const { query, limit } = value;
        const searchTerm = `%${query.toLowerCase()}%`;

        const symptoms = await database.all(`
            SELECT 
                s.id,
                s.name,
                s.description,
                GROUP_CONCAT(c.name) as related_conditions
            FROM Symptom s
            LEFT JOIN Condition_Symptom_Map csm ON s.id = csm.symptom_id
            LEFT JOIN Condition c ON csm.condition_id = c.id
            WHERE LOWER(s.name) LIKE ? OR LOWER(s.description) LIKE ?
            GROUP BY s.id, s.name, s.description
            ORDER BY s.name
            LIMIT ?
        `, [searchTerm, searchTerm, limit]);

        res.json({
            query,
            results: symptoms.map(symptom => ({
                ...symptom,
                related_conditions: symptom.related_conditions ? symptom.related_conditions.split(',') : []
            })),
            count: symptoms.length
        });
    } catch (error) {
        console.error('Error searching symptoms:', error);
        next({ type: 'database', message: error.message });
    }
});

// POST /api/symptoms/suggest-conditions - Suggest conditions based on symptoms
router.post('/suggest-conditions', async (req, res, next) => {
    try {
        const { symptom_ids } = req.body;

        if (!Array.isArray(symptom_ids) || symptom_ids.length === 0) {
            return res.status(400).json({
                error: 'Invalid input',
                message: 'symptom_ids must be a non-empty array'
            });
        }

        // Get conditions that match the provided symptoms
        const conditions = await database.all(`
            SELECT 
                c.id,
                c.name,
                c.description,
                c.severity_level,
                COUNT(csm.symptom_id) as matching_symptoms,
                AVG(csm.relevance_score) as avg_relevance,
                GROUP_CONCAT(s.name) as matched_symptom_names
            FROM Condition c
            JOIN Condition_Symptom_Map csm ON c.id = csm.condition_id
            JOIN Symptom s ON csm.symptom_id = s.id
            WHERE csm.symptom_id IN (${symptom_ids.map(() => '?').join(',')})
            GROUP BY c.id, c.name, c.description, c.severity_level
            ORDER BY matching_symptoms DESC, avg_relevance DESC, c.name
        `, symptom_ids);

        // Calculate confidence scores
        const conditionsWithConfidence = conditions.map(condition => ({
            ...condition,
            confidence_score: Math.min(100, (condition.matching_symptoms / symptom_ids.length) * condition.avg_relevance * 33.33),
            matched_symptom_names: condition.matched_symptom_names.split(',')
        }));

        res.json({
            symptom_ids,
            suggested_conditions: conditionsWithConfidence,
            count: conditionsWithConfidence.length
        });
    } catch (error) {
        console.error('Error suggesting conditions:', error);
        next({ type: 'database', message: error.message });
    }
});

// GET /api/symptoms/:id - Get specific symptom details
router.get('/:id', async (req, res, next) => {
    try {
        const symptomId = parseInt(req.params.id);
        
        if (isNaN(symptomId)) {
            return res.status(400).json({
                error: 'Invalid symptom ID',
                message: 'Symptom ID must be a number'
            });
        }

        const symptom = await database.get(`
            SELECT id, name, description, created_at
            FROM Symptom
            WHERE id = ?
        `, [symptomId]);

        if (!symptom) {
            return res.status(404).json({
                error: 'Symptom not found',
                message: 'No symptom found with the specified ID'
            });
        }

        // Get related conditions
        const conditions = await database.all(`
            SELECT 
                c.id,
                c.name,
                c.description,
                c.severity_level,
                csm.relevance_score
            FROM Condition c
            JOIN Condition_Symptom_Map csm ON c.id = csm.condition_id
            WHERE csm.symptom_id = ?
            ORDER BY csm.relevance_score DESC, c.name
        `, [symptomId]);

        res.json({
            ...symptom,
            related_conditions: conditions
        });
    } catch (error) {
        console.error('Error fetching symptom details:', error);
        next({ type: 'database', message: error.message });
    }
});

module.exports = router;
