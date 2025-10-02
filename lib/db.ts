import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'budgeter.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initDb() {
  // Categories table
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
      budget_limit REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Transactions table
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

  // Insert default categories if none exist
  const count = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  if (count.count === 0) {
    const insert = db.prepare('INSERT INTO categories (name, type, budget_limit) VALUES (?, ?, ?)');

    // Default expense categories
    insert.run('Food', 'expense', 600);
    insert.run('Entertainment', 'expense', 200);
    insert.run('General Expense', 'expense', 300);
    insert.run('Groceries', 'expense', 500);
    insert.run('Utilities', 'expense', 200);
    insert.run('Transportation', 'expense', 150);
    insert.run('Healthcare', 'expense', 200);

    // Default income categories
    insert.run('Salary', 'income', 0);
    insert.run('Freelance', 'income', 0);
  }
}

// Initialize on import
initDb();

export default db;
