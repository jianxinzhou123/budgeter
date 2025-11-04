const Database = require("better-sqlite3");
const path = require("path");

function migrateBanColumns() {
  try {
    const dbPath = path.join(process.cwd(), "budgeter.db");
    const db = new Database(dbPath);

    console.log("Starting migration to add ban columns...");

    // Check if columns already exist
    const tableInfo = db.pragma("table_info(users)");
    const columnNames = tableInfo.map((col) => col.name);

    if (columnNames.includes("is_banned")) {
      console.log("Ban columns already exist. Migration not needed.");
      db.close();
      return;
    }

    // Add the new columns
    db.exec(`
      ALTER TABLE users ADD COLUMN is_banned BOOLEAN DEFAULT 0;
    `);

    db.exec(`
      ALTER TABLE users ADD COLUMN ban_reason TEXT;
    `);

    db.exec(`
      ALTER TABLE users ADD COLUMN banned_until DATETIME;
    `);

    db.exec(`
      ALTER TABLE users ADD COLUMN banned_by INTEGER REFERENCES users(id);
    `);

    console.log("✅ Successfully added ban columns to users table:");
    console.log("  - is_banned (BOOLEAN)");
    console.log("  - ban_reason (TEXT)");
    console.log("  - banned_until (DATETIME)");
    console.log("  - banned_by (INTEGER)");

    db.close();
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateBanColumns();
