const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => { 
    db.run(`DROP TABLE IF EXISTS users`);
 
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            username TEXT NOT NULL,
            email TEXT NOT NULL,
            street TEXT NOT NULL,
            prov TEXT,
            city TEXT NOT NULL,
            phone TEXT NOT NULL
        )
    `);
});

module.exports = db;