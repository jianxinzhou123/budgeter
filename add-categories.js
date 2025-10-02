const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'budgeter.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    budget_limit REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
  )
`);

// Add the new categories
const insert = db.prepare('INSERT OR IGNORE INTO categories (name, type, budget_limit) VALUES (?, ?, ?)');

// Add the three new categories
insert.run('Food', 'expense', 600);
insert.run('Entertainment', 'expense', 200);
insert.run('General Expense', 'expense', 300);

// Also add other default categories if they don't exist
insert.run('Groceries', 'expense', 500);
insert.run('Utilities', 'expense', 200);
insert.run('Transportation', 'expense', 150);
insert.run('Healthcare', 'expense', 200);
insert.run('Salary', 'income', 0);
insert.run('Freelance', 'income', 0);

console.log('✓ Categories added successfully!');

// Show all categories
const categories = db.prepare('SELECT * FROM categories ORDER BY type, name').all();
console.log('\nAll categories:');
categories.forEach(cat => {
  console.log(`- ${cat.name} (${cat.type}): $${cat.budget_limit}`);
});

db.close();
