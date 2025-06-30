let Database;
try {
    Database = require('better-sqlite3');
} catch (err) {
    console.warn('better-sqlite3 not available, using mock database');
    Database = null;
}
const path = require('path');

class DatabaseWrapper {
    constructor() {
        this.db = null;
        this.dbPath = path.join(__dirname, 'precious.db');
    }

    connect() {
        try {
            if (!Database) {
                // Use mock database if better-sqlite3 is not available
                const mockDb = require('./mockData');
                return mockDb.connect().then(() => {
                    this.db = mockDb;
                    return this.db;
                });
            }

            this.db = new Database(this.dbPath);
            console.log('Connected to SQLite database');
            // Enable foreign keys
            this.db.pragma('foreign_keys = ON');
            return Promise.resolve(this.db);
        } catch (err) {
            console.error('Error connecting to database:', err.message);
            // Fallback to mock database
            console.log('Falling back to mock database...');
            const mockDb = require('./mockData');
            return mockDb.connect().then(() => {
                this.db = mockDb;
                return this.db;
            });
        }
    }

    close() {
        try {
            if (this.db) {
                this.db.close();
                console.log('Database connection closed');
            }
            return Promise.resolve();
        } catch (err) {
            console.error('Error closing database:', err.message);
            return Promise.reject(err);
        }
    }

    // Helper method to run queries
    run(sql, params = []) {
        try {
            if (this.db.run && typeof this.db.run === 'function') {
                // Mock database
                return this.db.run(sql, params);
            }
            // Real database
            const result = this.db.prepare(sql).run(params);
            return Promise.resolve({
                id: result.lastInsertRowid,
                changes: result.changes
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    // Helper method to get single row
    get(sql, params = []) {
        try {
            if (this.db.get && typeof this.db.get === 'function') {
                // Mock database
                return this.db.get(sql, params);
            }
            // Real database
            const result = this.db.prepare(sql).get(params);
            return Promise.resolve(result);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    // Helper method to get all rows
    all(sql, params = []) {
        try {
            if (this.db.all && typeof this.db.all === 'function') {
                // Mock database
                return this.db.all(sql, params);
            }
            // Real database
            const result = this.db.prepare(sql).all(params);
            return Promise.resolve(result);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    // Execute multiple statements (for schema creation)
    exec(sql) {
        try {
            if (this.db.exec && typeof this.db.exec === 'function') {
                // Mock database
                return this.db.exec(sql);
            }
            // Real database
            this.db.exec(sql);
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    }

    // Transaction support
    beginTransaction() {
        return this.run('BEGIN TRANSACTION');
    }

    commit() {
        return this.run('COMMIT');
    }

    rollback() {
        return this.run('ROLLBACK');
    }
}

// Singleton instance
const database = new DatabaseWrapper();

module.exports = database;
