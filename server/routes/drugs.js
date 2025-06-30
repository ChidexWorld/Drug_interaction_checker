const express = require('express');
const Joi = require('joi');
const database = require('../database/connection');

const router = express.Router();

// Validation schemas
const searchSchema = Joi.object({
    query: Joi.string().min(1).max(100).required(),
    limit: Joi.number().integer().min(1).max(50).default(20)
});

// GET /api/drugs - Get all drugs with pagination
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const drugs = await database.all(`
            SELECT 
                d.id,
                d.generic_name,
                d.drug_class,
                d.description,
                GROUP_CONCAT(
                    db.brand_name || ' (' || db.manufacturer || ')'
                ) as brands
            FROM Drug d
            LEFT JOIN Drug_Brand db ON d.id = db.drug_id
            GROUP BY d.id, d.generic_name, d.drug_class, d.description
            ORDER BY d.generic_name
            LIMIT ? OFFSET ?
        `, [parseInt(limit), offset]);

        const totalCount = await database.get('SELECT COUNT(*) as count FROM Drug');

        res.json({
            drugs: drugs.map(drug => ({
                ...drug,
                brands: drug.brands ? drug.brands.split(',') : []
            })),
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: totalCount.count,
                pages: Math.ceil(totalCount.count / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching drugs:', error);
        next({ type: 'database', message: error.message });
    }
});

// GET /api/drugs/search - Search drugs by name (generic or brand)
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

        const drugs = await database.all(`
            SELECT DISTINCT
                d.id,
                d.generic_name,
                d.drug_class,
                d.description,
                GROUP_CONCAT(
                    DISTINCT db.brand_name || ' (' || db.manufacturer || ')'
                ) as brands,
                CASE 
                    WHEN LOWER(d.generic_name) LIKE ? THEN 1
                    ELSE 2
                END as relevance_score
            FROM Drug d
            LEFT JOIN Drug_Brand db ON d.id = db.drug_id
            WHERE 
                LOWER(d.generic_name) LIKE ? 
                OR d.id IN (
                    SELECT DISTINCT drug_id 
                    FROM Drug_Brand 
                    WHERE LOWER(brand_name) LIKE ?
                )
            GROUP BY d.id, d.generic_name, d.drug_class, d.description
            ORDER BY relevance_score, d.generic_name
            LIMIT ?
        `, [searchTerm, searchTerm, searchTerm, limit]);

        res.json({
            query,
            results: drugs.map(drug => ({
                ...drug,
                brands: drug.brands ? drug.brands.split(',') : []
            })),
            count: drugs.length
        });
    } catch (error) {
        console.error('Error searching drugs:', error);
        next({ type: 'database', message: error.message });
    }
});

// GET /api/drugs/:id - Get specific drug details
router.get('/:id', async (req, res, next) => {
    try {
        const drugId = parseInt(req.params.id);
        
        if (isNaN(drugId)) {
            return res.status(400).json({
                error: 'Invalid drug ID',
                message: 'Drug ID must be a number'
            });
        }

        const drug = await database.get(`
            SELECT 
                d.id,
                d.generic_name,
                d.drug_class,
                d.description,
                d.created_at,
                d.updated_at
            FROM Drug d
            WHERE d.id = ?
        `, [drugId]);

        if (!drug) {
            return res.status(404).json({
                error: 'Drug not found',
                message: 'No drug found with the specified ID'
            });
        }

        // Get brands for this drug
        const brands = await database.all(`
            SELECT brand_name, manufacturer, country
            FROM Drug_Brand
            WHERE drug_id = ?
            ORDER BY brand_name
        `, [drugId]);

        res.json({
            ...drug,
            brands
        });
    } catch (error) {
        console.error('Error fetching drug details:', error);
        next({ type: 'database', message: error.message });
    }
});

// GET /api/drugs/:id/interactions - Get all interactions for a specific drug
router.get('/:id/interactions', async (req, res, next) => {
    try {
        const drugId = parseInt(req.params.id);
        
        if (isNaN(drugId)) {
            return res.status(400).json({
                error: 'Invalid drug ID',
                message: 'Drug ID must be a number'
            });
        }

        const interactions = await database.all(`
            SELECT 
                i.id,
                i.interaction_type,
                i.severity_score,
                i.description,
                i.mechanism,
                d1.generic_name as drug1_name,
                d2.generic_name as drug2_name,
                CASE 
                    WHEN i.drug1_id = ? THEN d2.generic_name
                    ELSE d1.generic_name
                END as interacting_drug
            FROM Interaction i
            JOIN Drug d1 ON i.drug1_id = d1.id
            JOIN Drug d2 ON i.drug2_id = d2.id
            WHERE i.drug1_id = ? OR i.drug2_id = ?
            ORDER BY i.severity_score DESC, interacting_drug
        `, [drugId, drugId, drugId]);

        res.json({
            drug_id: drugId,
            interactions,
            count: interactions.length
        });
    } catch (error) {
        console.error('Error fetching drug interactions:', error);
        next({ type: 'database', message: error.message });
    }
});

module.exports = router;
