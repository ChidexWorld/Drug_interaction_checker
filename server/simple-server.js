// Simple test server for Precious Drug Interaction Checker
const http = require('http');
const url = require('url');

// Mock data
const mockDrugs = [
    {
        id: 1,
        generic_name: 'Lisinopril',
        drug_class: 'ACE Inhibitor',
        description: 'Used to treat high blood pressure and heart failure',
        brands: ['Zestril (AstraZeneca Nigeria)', 'Prinivil (Merck Nigeria)']
    },
    {
        id: 2,
        generic_name: 'Warfarin',
        drug_class: 'Anticoagulant',
        description: 'Blood thinner to prevent clots',
        brands: ['Coumadin (Bristol-Myers Squibb Nigeria)']
    },
    {
        id: 3,
        generic_name: 'Aspirin',
        drug_class: 'NSAID',
        description: 'Pain reliever and blood thinner',
        brands: ['Aspirin (Bayer Nigeria)', 'Ecotrin (GlaxoSmithKline Nigeria)']
    },
    {
        id: 4,
        generic_name: 'Metformin',
        drug_class: 'Antidiabetic',
        description: 'Used to treat type 2 diabetes',
        brands: ['Glucophage (Merck Nigeria)']
    }
];

const mockConditions = [
    {
        id: 1,
        name: 'Hypertension',
        description: 'High blood pressure',
        severity_level: 2,
        symptoms: ['Headache', 'Dizziness', 'Chest Pain']
    },
    {
        id: 2,
        name: 'Diabetes',
        description: 'High blood sugar levels',
        severity_level: 2,
        symptoms: ['Frequent Urination', 'Excessive Thirst', 'Fatigue']
    },
    {
        id: 3,
        name: 'Heart Failure',
        description: 'Heart cannot pump blood effectively',
        severity_level: 3,
        symptoms: ['Shortness of Breath', 'Swelling', 'Fatigue']
    }
];

const mockInteraction = {
    drugs: [
        { id: 2, generic_name: 'Warfarin', drug_class: 'Anticoagulant' },
        { id: 3, generic_name: 'Aspirin', drug_class: 'NSAID' }
    ],
    interactions: [
        {
            id: 1,
            drug1_name: 'Warfarin',
            drug2_name: 'Aspirin',
            interaction_type: 'Major',
            severity_score: 3,
            description: 'Increased risk of bleeding when warfarin is combined with aspirin. Both drugs affect blood clotting.',
            mechanism: 'Additive anticoagulant effects',
            clinical_notes: [
                {
                    note_type: 'monitoring',
                    clinical_note: 'Monitor INR more frequently when starting or stopping aspirin',
                    recommendation: 'Check INR within 3-5 days of aspirin initiation'
                }
            ],
            alternatives: [
                {
                    original_drug_id: 3,
                    alternative_name: 'Clopidogrel',
                    alternative_class: 'Antiplatelet',
                    reason: 'Lower bleeding risk compared to aspirin when combined with warfarin'
                }
            ]
        }
    ],
    summary: {
        total_interactions: 1,
        max_severity: 3,
        risk_level: 'Major',
        risk_color: '#fd7e14',
        condition_considered: false
    }
};

// Helper functions
function setCORSHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJSON(res, data, statusCode = 200) {
    setCORSHeaders(res);
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

function handleDrugSearch(query, res) {
    const searchTerm = query.query?.toLowerCase() || '';
    const results = mockDrugs.filter(drug => 
        drug.generic_name.toLowerCase().includes(searchTerm) ||
        drug.drug_class.toLowerCase().includes(searchTerm)
    );
    
    sendJSON(res, {
        query: query.query || '',
        results,
        count: results.length
    });
}

function handleInteractionCheck(body, res) {
    try {
        const data = JSON.parse(body);
        const drugIds = data.drug_ids || [];
        
        if (drugIds.length < 2) {
            sendJSON(res, { error: 'At least 2 drugs required' }, 400);
            return;
        }
        
        // For demo, return interaction if Warfarin (2) and Aspirin (3) are selected
        if (drugIds.includes(2) && drugIds.includes(3)) {
            sendJSON(res, mockInteraction);
        } else {
            sendJSON(res, {
                drugs: drugIds.map(id => mockDrugs.find(d => d.id === id)).filter(Boolean),
                interactions: [],
                summary: {
                    total_interactions: 0,
                    max_severity: 0,
                    risk_level: 'No Known Interactions',
                    risk_color: '#6c757d',
                    condition_considered: false
                }
            });
        }
    } catch (error) {
        sendJSON(res, { error: 'Invalid JSON' }, 400);
    }
}

// Create server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;
    
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        setCORSHeaders(res);
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Health check
    if (path === '/health') {
        sendJSON(res, { 
            status: 'OK', 
            message: 'Precious Drug Interaction Checker API is running',
            timestamp: new Date().toISOString()
        });
        return;
    }
    
    // Drug search
    if (path === '/api/drugs/search' && req.method === 'GET') {
        handleDrugSearch(query, res);
        return;
    }
    
    // Get all drugs
    if (path === '/api/drugs' && req.method === 'GET') {
        sendJSON(res, {
            drugs: mockDrugs,
            pagination: {
                page: 1,
                limit: 20,
                total: mockDrugs.length,
                pages: 1
            }
        });
        return;
    }
    
    // Get conditions
    if (path === '/api/conditions' && req.method === 'GET') {
        sendJSON(res, { conditions: mockConditions });
        return;
    }
    
    // Check interactions
    if (path === '/api/interactions/check' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            handleInteractionCheck(body, res);
        });
        return;
    }
    
    // 404
    sendJSON(res, { error: 'Not Found', message: 'The requested endpoint does not exist' }, 404);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Precious Drug Interaction Checker API running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
    console.log('🔧 Using mock data for demonstration');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
