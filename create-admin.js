const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");
const path = require("path");

async function createAdminUser() {
  const dbPath = path.join(process.cwd(), "budgeter.db");
  const db = new Database(dbPath);

  const adminEmail = "admin@budgeter.com";
  const adminPassword = "admin123";
  const adminName = "System Administrator";

  try {
    // Check if admin user already exists
    const existingAdmin = db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)").get(adminEmail);

    if (existingAdmin) {
      console.log("Admin user already exists!");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Insert admin user
    const result = db
      .prepare(
        `
      INSERT INTO users (email, password, name, role)
      VALUES (?, ?, ?, ?)
    `
      )
      .run(adminEmail, hashedPassword, adminName, "admin");

    console.log("Admin user created successfully!");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("Please change this password after first login!");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    db.close();
  }
}

createAdminUser();
