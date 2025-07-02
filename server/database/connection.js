const mysql = require("mysql2/promise");
require("dotenv").config();

class DatabaseWrapper {
  constructor() {
    this.db = null;
  }

  connect() {
    return mysql
      .createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      })
      .then((connection) => {
        this.db = connection;
        console.log("Connected to MySQL database");
        return this.db;
      })
      .catch((err) => {
        console.error("Error connecting to MySQL database:", err.message);
        throw err;
      });
  }

  close() {
    if (this.db) {
      return this.db.end().then(() => {
        console.log("Database connection closed");
      });
    }
    return Promise.resolve();
  }

  // Helper method to run queries
  run(sql, params = []) {
    return this.db
      .execute(sql, params)
      .then(([result]) => ({
        id: result.insertId,
        changes: result.affectedRows,
      }))
      .catch((err) => Promise.reject(err));
  }

  // Helper method to get single row
  get(sql, params = []) {
    return this.db
      .execute(sql, params)
      .then(([rows]) => (Array.isArray(rows) ? rows[0] : rows))
      .catch((err) => Promise.reject(err));
  }

  // Helper method to get all rows
  all(sql, params = []) {
    return this.db
      .execute(sql, params)
      .then(([rows]) => rows)
      .catch((err) => Promise.reject(err));
  }

  // Execute multiple statements (for schema creation)
  async exec(sql) {
    // Split by semicolon, filter out empty/whitespace-only statements
    const statements = sql
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);
    for (const stmt of statements) {
      try {
        await this.db.query(stmt);
      } catch (err) {
        // Add statement to error for easier debugging
        err.failedStatement = stmt;
        throw err;
      }
    }
    return Promise.resolve();
  }
}

// Singleton instance
const database = new DatabaseWrapper();

module.exports = database;
