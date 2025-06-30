const database = require('../database/connection');

// Sample interaction data
const interactionData = {
    interactions: [
        {
            drug1_name: 'Warfarin',
            drug2_name: 'Aspirin',
            interaction_type: 'Major',
            severity_score: 3,
            description: 'Increased risk of bleeding when warfarin is combined with aspirin. Both drugs affect blood clotting.',
            mechanism: 'Additive anticoagulant effects - warfarin inhibits vitamin K synthesis while aspirin inhibits platelet aggregation'
        },
        {
            drug1_name: 'Lisinopril',
            drug2_name: 'Furosemide',
            interaction_type: 'Moderate',
            severity_score: 2,
            description: 'May cause excessive drop in blood pressure and kidney function impairment.',
            mechanism: 'ACE inhibitors and diuretics both lower blood pressure through different mechanisms'
        },
        {
            drug1_name: 'Digoxin',
            drug2_name: 'Furosemide',
            interaction_type: 'Major',
            severity_score: 3,
            description: 'Furosemide can cause potassium loss, increasing risk of digoxin toxicity.',
            mechanism: 'Hypokalemia caused by furosemide increases sensitivity to digoxin'
        },
        {
            drug1_name: 'Simvastatin',
            drug2_name: 'Warfarin',
            interaction_type: 'Moderate',
            severity_score: 2,
            description: 'Simvastatin may enhance the anticoagulant effect of warfarin.',
            mechanism: 'Simvastatin may inhibit warfarin metabolism, increasing its effects'
        },
        {
            drug1_name: 'Metformin',
            drug2_name: 'Furosemide',
            interaction_type: 'Minor',
            severity_score: 1,
            description: 'Furosemide may affect blood glucose levels in diabetic patients.',
            mechanism: 'Diuretics can cause hyperglycemia and may reduce metformin effectiveness'
        },
        {
            drug1_name: 'Atenolol',
            drug2_name: 'Amlodipine',
            interaction_type: 'Minor',
            severity_score: 1,
            description: 'Additive blood pressure lowering effects. Generally well tolerated.',
            mechanism: 'Both drugs lower blood pressure through different mechanisms - often used together therapeutically'
        },
        {
            drug1_name: 'Omeprazole',
            drug2_name: 'Warfarin',
            interaction_type: 'Moderate',
            severity_score: 2,
            description: 'Omeprazole may increase warfarin levels and bleeding risk.',
            mechanism: 'Omeprazole inhibits CYP2C19 enzyme which metabolizes warfarin'
        },
        {
            drug1_name: 'Aspirin',
            drug2_name: 'Lisinopril',
            interaction_type: 'Moderate',
            severity_score: 2,
            description: 'NSAIDs like aspirin may reduce the effectiveness of ACE inhibitors.',
            mechanism: 'NSAIDs can reduce kidney function and interfere with ACE inhibitor effectiveness'
        }
    ],

    clinicalNotes: [
        {
            drug1_name: 'Warfarin',
            drug2_name: 'Aspirin',
            notes: [
                {
                    note_type: 'monitoring',
                    clinical_note: 'Monitor INR more frequently when starting or stopping aspirin',
                    recommendation: 'Check INR within 3-5 days of aspirin initiation'
                },
                {
                    note_type: 'contraindication',
                    clinical_note: 'Avoid combination in patients with history of GI bleeding',
                    recommendation: 'Consider alternative antiplatelet agents or gastroprotection'
                }
            ]
        },
        {
            drug1_name: 'Digoxin',
            drug2_name: 'Furosemide',
            notes: [
                {
                    note_type: 'monitoring',
                    clinical_note: 'Monitor serum potassium and digoxin levels regularly',
                    recommendation: 'Check electrolytes weekly initially, then monthly'
                },
                {
                    note_type: 'general',
                    clinical_note: 'Consider potassium supplementation or potassium-sparing diuretic',
                    recommendation: 'Maintain serum potassium >3.5 mEq/L'
                }
            ]
        }
    ],

    conditionInteractions: [
        {
            drug1_name: 'Warfarin',
            drug2_name: 'Aspirin',
            condition_name: 'Kidney Disease',
            adjusted_severity_score: 4,
            adjusted_interaction_type: 'Contraindicated',
            condition_specific_note: 'Kidney disease increases bleeding risk significantly with this combination'
        },
        {
            drug1_name: 'Lisinopril',
            drug2_name: 'Furosemide',
            condition_name: 'Heart Failure',
            adjusted_severity_score: 1,
            adjusted_interaction_type: 'Minor',
            condition_specific_note: 'This combination is often beneficial in heart failure patients when properly monitored'
        },
        {
            drug1_name: 'Digoxin',
            drug2_name: 'Furosemide',
            condition_name: 'Elderly (65+)',
            adjusted_severity_score: 4,
            adjusted_interaction_type: 'Contraindicated',
            condition_specific_note: 'Elderly patients are at higher risk of digoxin toxicity due to reduced kidney function'
        }
    ],

    alternatives: [
        {
            drug1_name: 'Warfarin',
            drug2_name: 'Aspirin',
            original_drug_name: 'Aspirin',
            alternative_name: 'Clopidogrel',
            reason: 'Lower bleeding risk compared to aspirin when combined with warfarin',
            safety_note: 'Still requires monitoring but generally safer combination'
        },
        {
            drug1_name: 'Digoxin',
            drug2_name: 'Furosemide',
            original_drug_name: 'Furosemide',
            alternative_name: 'Atenolol',
            reason: 'Beta-blockers can provide heart rate control without electrolyte disturbances',
            safety_note: 'Monitor for bradycardia and heart failure symptoms'
        }
    ],

    conditionSymptomMaps: [
        { condition_name: 'Hypertension', symptom_name: 'Headache', relevance_score: 2 },
        { condition_name: 'Hypertension', symptom_name: 'Dizziness', relevance_score: 3 },
        { condition_name: 'Hypertension', symptom_name: 'Chest Pain', relevance_score: 2 },
        
        { condition_name: 'Diabetes', symptom_name: 'Frequent Urination', relevance_score: 3 },
        { condition_name: 'Diabetes', symptom_name: 'Excessive Thirst', relevance_score: 3 },
        { condition_name: 'Diabetes', symptom_name: 'Fatigue', relevance_score: 2 },
        
        { condition_name: 'Heart Failure', symptom_name: 'Shortness of Breath', relevance_score: 3 },
        { condition_name: 'Heart Failure', symptom_name: 'Swelling', relevance_score: 3 },
        { condition_name: 'Heart Failure', symptom_name: 'Fatigue', relevance_score: 3 },
        { condition_name: 'Heart Failure', symptom_name: 'Irregular Heartbeat', relevance_score: 2 },
        
        { condition_name: 'Kidney Disease', symptom_name: 'Swelling', relevance_score: 3 },
        { condition_name: 'Kidney Disease', symptom_name: 'Fatigue', relevance_score: 2 },
        { condition_name: 'Kidney Disease', symptom_name: 'Frequent Urination', relevance_score: 2 },
        
        { condition_name: 'Asthma', symptom_name: 'Wheezing', relevance_score: 3 },
        { condition_name: 'Asthma', symptom_name: 'Shortness of Breath', relevance_score: 3 },
        { condition_name: 'Asthma', symptom_name: 'Cough', relevance_score: 3 },
        
        { condition_name: 'Bleeding Disorder', symptom_name: 'Easy Bruising', relevance_score: 3 },
        { condition_name: 'Bleeding Disorder', symptom_name: 'Excessive Bleeding', relevance_score: 3 },
        
        { condition_name: 'Gastric Ulcer', symptom_name: 'Stomach Pain', relevance_score: 3 },
        { condition_name: 'Gastric Ulcer', symptom_name: 'Nausea', relevance_score: 2 }
    ]
};

async function seedInteractions() {
    try {
        await database.connect();
        console.log('Starting interaction data seeding...');

        // Insert interactions
        console.log('Inserting interactions...');
        for (const interaction of interactionData.interactions) {
            const drug1 = await database.get('SELECT id FROM Drug WHERE generic_name = ?', [interaction.drug1_name]);
            const drug2 = await database.get('SELECT id FROM Drug WHERE generic_name = ?', [interaction.drug2_name]);
            
            if (drug1 && drug2) {
                const result = await database.run(`
                    INSERT OR IGNORE INTO Interaction 
                    (drug1_id, drug2_id, interaction_type, severity_score, description, mechanism) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [drug1.id, drug2.id, interaction.interaction_type, interaction.severity_score, 
                    interaction.description, interaction.mechanism]);
                
                console.log(`Added interaction: ${interaction.drug1_name} + ${interaction.drug2_name}`);
            }
        }

        // Insert clinical notes
        console.log('Inserting clinical notes...');
        for (const noteGroup of interactionData.clinicalNotes) {
            const drug1 = await database.get('SELECT id FROM Drug WHERE generic_name = ?', [noteGroup.drug1_name]);
            const drug2 = await database.get('SELECT id FROM Drug WHERE generic_name = ?', [noteGroup.drug2_name]);
            
            if (drug1 && drug2) {
                const interaction = await database.get(`
                    SELECT id FROM Interaction 
                    WHERE (drug1_id = ? AND drug2_id = ?) OR (drug1_id = ? AND drug2_id = ?)
                `, [drug1.id, drug2.id, drug2.id, drug1.id]);
                
                if (interaction) {
                    for (const note of noteGroup.notes) {
                        await database.run(`
                            INSERT OR IGNORE INTO Clinical_Note 
                            (interaction_id, note_type, clinical_note, recommendation) 
                            VALUES (?, ?, ?, ?)
                        `, [interaction.id, note.note_type, note.clinical_note, note.recommendation]);
                    }
                }
            }
        }

        // Insert condition-specific interactions
        console.log('Inserting condition-specific interactions...');
        for (const condInt of interactionData.conditionInteractions) {
            const drug1 = await database.get('SELECT id FROM Drug WHERE generic_name = ?', [condInt.drug1_name]);
            const drug2 = await database.get('SELECT id FROM Drug WHERE generic_name = ?', [condInt.drug2_name]);
            const condition = await database.get('SELECT id FROM Condition WHERE name = ?', [condInt.condition_name]);
            
            if (drug1 && drug2 && condition) {
                const interaction = await database.get(`
                    SELECT id FROM Interaction 
                    WHERE (drug1_id = ? AND drug2_id = ?) OR (drug1_id = ? AND drug2_id = ?)
                `, [drug1.id, drug2.id, drug2.id, drug1.id]);
                
                if (interaction) {
                    await database.run(`
                        INSERT OR IGNORE INTO Condition_Interaction 
                        (interaction_id, condition_id, adjusted_severity_score, adjusted_interaction_type, condition_specific_note) 
                        VALUES (?, ?, ?, ?, ?)
                    `, [interaction.id, condition.id, condInt.adjusted_severity_score, 
                        condInt.adjusted_interaction_type, condInt.condition_specific_note]);
                }
            }
        }

        // Insert condition-symptom mappings
        console.log('Inserting condition-symptom mappings...');
        for (const mapping of interactionData.conditionSymptomMaps) {
            const condition = await database.get('SELECT id FROM Condition WHERE name = ?', [mapping.condition_name]);
            const symptom = await database.get('SELECT id FROM Symptom WHERE name = ?', [mapping.symptom_name]);
            
            if (condition && symptom) {
                await database.run(`
                    INSERT OR IGNORE INTO Condition_Symptom_Map 
                    (condition_id, symptom_id, relevance_score) 
                    VALUES (?, ?, ?)
                `, [condition.id, symptom.id, mapping.relevance_score]);
            }
        }

        console.log('Interaction data seeding completed successfully!');
        
    } catch (error) {
        console.error('Error seeding interaction data:', error);
        throw error;
    } finally {
        await database.close();
    }
}

// Run if called directly
if (require.main === module) {
    seedInteractions()
        .then(() => {
            console.log('Interaction seeding process completed.');
            process.exit(0);
        })
        .catch((err) => {
            console.error('Interaction seeding process failed:', err);
            process.exit(1);
        });
}

module.exports = { seedInteractions };
