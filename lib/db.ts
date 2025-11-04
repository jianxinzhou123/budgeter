import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "budgeter.db");
const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize database schema
export function initDb() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'user')),
      is_banned BOOLEAN DEFAULT 0,
      ban_reason TEXT,
      banned_until DATETIME,
      banned_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (banned_by) REFERENCES users(id)
    )
  `);

  // Sessions table for NextAuth
  db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      providerAccountId TEXT NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at INTEGER,
      token_type TEXT,
      scope TEXT,
      id_token TEXT,
      session_state TEXT,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionToken TEXT NOT NULL UNIQUE,
      userId INTEGER NOT NULL,
      expires DATETIME NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS verification_tokens (
      identifier TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires DATETIME NOT NULL,
      PRIMARY KEY (identifier, token)
    )
  `);

  // Categories table (user-specific)
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('income', 'expense', 'other')),
      budget_limit REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, name)
    )
  `);

  // Transactions table (user-specific)
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);

  // Note: Default categories are now created per-user when they register
}

// Create default categories for a new user
export function createDefaultCategories(userId: number) {
  const insert = db.prepare("INSERT INTO categories (user_id, name, type, budget_limit) VALUES (?, ?, ?, ?)");

  // Default expense categories
  insert.run(userId, "Food", "expense", 600);
  insert.run(userId, "Entertainment", "expense", 200);
  insert.run(userId, "General Expense", "expense", 300);
  insert.run(userId, "Groceries", "expense", 500);
  insert.run(userId, "Utilities", "expense", 200);
  insert.run(userId, "Transportation", "expense", 150);
  insert.run(userId, "Healthcare", "expense", 200);

  // Default income categories
  insert.run(userId, "Salary", "income", 0);
  insert.run(userId, "Freelance", "income", 0);
}

// Initialize on import
initDb();

export default db;
