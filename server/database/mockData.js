// Mock data for testing without database setup

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
    },
    {
        id: 5,
        generic_name: 'Simvastatin',
        drug_class: 'Statin',
        description: 'Cholesterol-lowering medication',
        brands: ['Zocor (Merck Nigeria)']
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
    },
    {
        id: 4,
        name: 'Kidney Disease',
        description: 'Impaired kidney function',
        severity_level: 3,
        symptoms: ['Swelling', 'Fatigue', 'Frequent Urination']
    }
];

const mockInteractions = [
    {
        id: 1,
        drug1_id: 2,
        drug2_id: 3,
        drug1_name: 'Warfarin',
        drug2_name: 'Aspirin',
        interaction_type: 'Major',
        severity_score: 3,
        description: 'Increased risk of bleeding when warfarin is combined with aspirin. Both drugs affect blood clotting.',
        mechanism: 'Additive anticoagulant effects - warfarin inhibits vitamin K synthesis while aspirin inhibits platelet aggregation',
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
                reason: 'Lower bleeding risk compared to aspirin when combined with warfarin',
                safety_note: 'Still requires monitoring but generally safer combination'
            }
        ]
    },
    {
        id: 2,
        drug1_id: 1,
        drug2_id: 3,
        drug1_name: 'Lisinopril',
        drug2_name: 'Aspirin',
        interaction_type: 'Moderate',
        severity_score: 2,
        description: 'NSAIDs like aspirin may reduce the effectiveness of ACE inhibitors.',
        mechanism: 'NSAIDs can reduce kidney function and interfere with ACE inhibitor effectiveness',
        clinical_notes: [
            {
                note_type: 'monitoring',
                clinical_note: 'Monitor blood pressure and kidney function',
                recommendation: 'Check creatinine and blood pressure weekly initially'
            }
        ],
        alternatives: []
    }
];

// Mock database class
class MockDatabase {
    constructor() {
        this.connected = false;
    }

    async connect() {
        this.connected = true;
        console.log('Connected to mock database');
        return Promise.resolve();
    }

    async close() {
        this.connected = false;
        console.log('Mock database connection closed');
        return Promise.resolve();
    }

    async all(sql, params = []) {
        // Simple mock responses based on SQL patterns
        if (sql.includes('FROM Drug')) {
            if (sql.includes('LIKE')) {
                const searchTerm = params[0] || params[1] || params[2];
                if (searchTerm) {
                    const term = searchTerm.replace(/%/g, '').toLowerCase();
                    return mockDrugs.filter(drug => 
                        drug.generic_name.toLowerCase().includes(term) ||
                        drug.drug_class.toLowerCase().includes(term)
                    );
                }
            }
            return mockDrugs;
        }
        
        if (sql.includes('FROM Condition')) {
            return mockConditions;
        }
        
        if (sql.includes('FROM Interaction')) {
            return mockInteractions;
        }
        
        return [];
    }

    async get(sql, params = []) {
        if (sql.includes('FROM Drug WHERE id')) {
            const id = params[0];
            return mockDrugs.find(drug => drug.id === id);
        }
        
        if (sql.includes('FROM Condition WHERE id')) {
            const id = params[0];
            return mockConditions.find(condition => condition.id === id);
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
