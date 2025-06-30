const database = require('../database/connection');
const fs = require('fs');
const path = require('path');

// Schema file path
const schemaPath = path.join(__dirname, '../database/schema.sql');

// Initialize database
async function initDatabase() {
    try {
        await database.connect();
        console.log('Connected to SQLite database.');

        // Read and execute schema
        const schema = fs.readFileSync(schemaPath, 'utf8');

        await database.exec(schema);
        console.log('Database tables created successfully.');

        await database.close();
        console.log('Database connection closed.');
    } catch (err) {
        console.error('Error initializing database:', err.message);
        throw err;
    }
}

// Run if called directly
if (require.main === module) {
    initDatabase()
        .then(() => {
            console.log('Database initialization completed successfully.');
            process.exit(0);
        })
        .catch((err) => {
            console.error('Database initialization failed:', err);
            process.exit(1);
        });
}

module.exports = { initDatabase };
