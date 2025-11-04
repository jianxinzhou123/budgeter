const Database = require("better-sqlite3");
const path = require("path");

function migrateDatabase() {
  try {
    const dbPath = path.join(process.cwd(), "budgeter.db");
    const db = new Database(dbPath);

    console.log("Starting database migration...");

    // Check if columns already exist
    const tableInfo = db.pragma("table_info(users)");
    const columnNames = tableInfo.map((col) => col.name);

    const columnsToAdd = [
      { name: "is_banned", definition: "BOOLEAN DEFAULT 0" },
      { name: "ban_reason", definition: "TEXT" },
      { name: "banned_until", definition: "DATETIME" },
      { name: "banned_by", definition: "INTEGER REFERENCES users(id)" },
    ];

    let addedColumns = 0;

    for (const column of columnsToAdd) {
      if (!columnNames.includes(column.name)) {
        console.log(`Adding column: ${column.name}`);
        db.exec(`ALTER TABLE users ADD COLUMN ${column.name} ${column.definition}`);
        addedColumns++;
      } else {
        console.log(`Column ${column.name} already exists`);
      }
    }

    if (addedColumns > 0) {
      console.log(`Migration completed! Added ${addedColumns} new columns.`);
    } else {
      console.log("No migration needed - all columns already exist.");
    }

    db.close();
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateDatabase();
