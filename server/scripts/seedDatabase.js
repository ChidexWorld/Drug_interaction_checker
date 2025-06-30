const database = require('../database/connection');

// Sample data for seeding the database
const sampleData = {
    drugs: [
        { generic_name: 'Lisinopril', drug_class: 'ACE Inhibitor', description: 'Used to treat high blood pressure and heart failure' },
        { generic_name: 'Warfarin', drug_class: 'Anticoagulant', description: 'Blood thinner to prevent clots' },
        { generic_name: 'Aspirin', drug_class: 'NSAID', description: 'Pain reliever and blood thinner' },
        { generic_name: 'Metformin', drug_class: 'Antidiabetic', description: 'Used to treat type 2 diabetes' },
        { generic_name: 'Simvastatin', drug_class: 'Statin', description: 'Cholesterol-lowering medication' },
        { generic_name: 'Amlodipine', drug_class: 'Calcium Channel Blocker', description: 'Used to treat high blood pressure' },
        { generic_name: 'Omeprazole', drug_class: 'Proton Pump Inhibitor', description: 'Reduces stomach acid production' },
        { generic_name: 'Atenolol', drug_class: 'Beta Blocker', description: 'Used to treat high blood pressure and heart conditions' },
        { generic_name: 'Furosemide', drug_class: 'Diuretic', description: 'Water pill used to treat fluid retention' },
        { generic_name: 'Digoxin', drug_class: 'Cardiac Glycoside', description: 'Used to treat heart failure and irregular heartbeat' }
    ],

    drugBrands: [
        { drug_name: 'Lisinopril', brand_name: 'Zestril', manufacturer: 'AstraZeneca Nigeria' },
        { drug_name: 'Lisinopril', brand_name: 'Prinivil', manufacturer: 'Merck Nigeria' },
        { drug_name: 'Warfarin', brand_name: 'Coumadin', manufacturer: 'Bristol-Myers Squibb Nigeria' },
        { drug_name: 'Aspirin', brand_name: 'Aspirin', manufacturer: 'Bayer Nigeria' },
        { drug_name: 'Aspirin', brand_name: 'Ecotrin', manufacturer: 'GlaxoSmithKline Nigeria' },
        { drug_name: 'Metformin', brand_name: 'Glucophage', manufacturer: 'Merck Nigeria' },
        { drug_name: 'Simvastatin', brand_name: 'Zocor', manufacturer: 'Merck Nigeria' },
        { drug_name: 'Amlodipine', brand_name: 'Norvasc', manufacturer: 'Pfizer Nigeria' },
        { drug_name: 'Omeprazole', brand_name: 'Prilosec', manufacturer: 'AstraZeneca Nigeria' },
        { drug_name: 'Atenolol', brand_name: 'Tenormin', manufacturer: 'AstraZeneca Nigeria' },
        { drug_name: 'Furosemide', brand_name: 'Lasix', manufacturer: 'Sanofi Nigeria' },
        { drug_name: 'Digoxin', brand_name: 'Lanoxin', manufacturer: 'GlaxoSmithKline Nigeria' }
    ],

    conditions: [
        { name: 'Hypertension', description: 'High blood pressure', severity_level: 2 },
        { name: 'Diabetes', description: 'High blood sugar levels', severity_level: 2 },
        { name: 'Heart Failure', description: 'Heart cannot pump blood effectively', severity_level: 3 },
        { name: 'Kidney Disease', description: 'Impaired kidney function', severity_level: 3 },
        { name: 'Liver Disease', description: 'Impaired liver function', severity_level: 3 },
        { name: 'Asthma', description: 'Respiratory condition causing breathing difficulties', severity_level: 2 },
        { name: 'Pregnancy', description: 'Expecting a baby', severity_level: 3 },
        { name: 'Elderly (65+)', description: 'Advanced age requiring special consideration', severity_level: 2 },
        { name: 'Bleeding Disorder', description: 'Increased risk of bleeding', severity_level: 3 },
        { name: 'Gastric Ulcer', description: 'Stomach ulcer', severity_level: 2 }
    ],

    symptoms: [
        { name: 'Chest Pain', description: 'Pain or discomfort in chest area' },
        { name: 'Shortness of Breath', description: 'Difficulty breathing' },
        { name: 'Dizziness', description: 'Feeling lightheaded or unsteady' },
        { name: 'Fatigue', description: 'Extreme tiredness' },
        { name: 'Swelling', description: 'Fluid retention in legs, ankles, or feet' },
        { name: 'Frequent Urination', description: 'Urinating more often than normal' },
        { name: 'Excessive Thirst', description: 'Increased need to drink fluids' },
        { name: 'Wheezing', description: 'High-pitched breathing sound' },
        { name: 'Cough', description: 'Persistent coughing' },
        { name: 'Nausea', description: 'Feeling sick to stomach' },
        { name: 'Stomach Pain', description: 'Abdominal discomfort' },
        { name: 'Headache', description: 'Head pain' },
        { name: 'Irregular Heartbeat', description: 'Heart rhythm abnormalities' },
        { name: 'Easy Bruising', description: 'Bruising with minimal trauma' },
        { name: 'Excessive Bleeding', description: 'Bleeding that is hard to stop' }
    ]
};

async function seedDatabase() {
    try {
        await database.connect();
        console.log('Starting database seeding...');

        // Insert drugs
        console.log('Inserting drugs...');
        for (const drug of sampleData.drugs) {
            await database.run(
                'INSERT OR IGNORE INTO Drug (generic_name, drug_class, description) VALUES (?, ?, ?)',
                [drug.generic_name, drug.drug_class, drug.description]
            );
        }

        // Insert drug brands
        console.log('Inserting drug brands...');
        for (const brand of sampleData.drugBrands) {
            const drug = await database.get(
                'SELECT id FROM Drug WHERE generic_name = ?',
                [brand.drug_name]
            );
            if (drug) {
                await database.run(
                    'INSERT OR IGNORE INTO Drug_Brand (drug_id, brand_name, manufacturer) VALUES (?, ?, ?)',
                    [drug.id, brand.brand_name, brand.manufacturer]
                );
            }
        }

        // Insert conditions
        console.log('Inserting conditions...');
        for (const condition of sampleData.conditions) {
            await database.run(
                'INSERT OR IGNORE INTO Condition (name, description, severity_level) VALUES (?, ?, ?)',
                [condition.name, condition.description, condition.severity_level]
            );
        }

        // Insert symptoms
        console.log('Inserting symptoms...');
        for (const symptom of sampleData.symptoms) {
            await database.run(
                'INSERT OR IGNORE INTO Symptom (name, description) VALUES (?, ?)',
                [symptom.name, symptom.description]
            );
        }

        console.log('Database seeding completed successfully!');
        
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    } finally {
        await database.close();
    }
}

// Run if called directly
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('Seeding process completed.');
            process.exit(0);
        })
        .catch((err) => {
            console.error('Seeding process failed:', err);
            process.exit(1);
        });
}

module.exports = { seedDatabase };
