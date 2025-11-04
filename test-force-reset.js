import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "budgeter.db");
const db = new Database(dbPath);

console.log("Testing Force Password Reset Feature...\n");

// Check if the column exists
try {
  const users = db.prepare("SELECT id, email, name, force_password_reset FROM users LIMIT 5").all();

  console.log("📋 Current users in database:");
  users.forEach((user) => {
    console.log(
      `- ID: ${user.id}, Email: ${user.email}, Name: ${user.name}, Force Reset: ${
        user.force_password_reset ? "YES" : "NO"
      }`
    );
  });

  if (users.length > 0) {
    const testUser = users.find((u) => u.id !== 1); // Don't use admin user
    if (testUser) {
      console.log(`\n🔧 Setting force_password_reset to 1 for user: ${testUser.email}`);
      db.prepare("UPDATE users SET force_password_reset = 1 WHERE id = ?").run(testUser.id);

      // Verify the update
      const updatedUser = db.prepare("SELECT id, email, force_password_reset FROM users WHERE id = ?").get(testUser.id);
      console.log(
        `✅ Updated user: ${updatedUser.email}, Force Reset: ${updatedUser.force_password_reset ? "YES" : "NO"}`
      );

      console.log(`\n📱 Now login with this user to test the force password reset modal!`);
      console.log(`Email: ${testUser.email}`);
    } else {
      console.log("\n⚠️  No non-admin users found to test with");
    }
  } else {
    console.log("\n⚠️  No users found in database");
  }
} catch (error) {
  console.error("❌ Error:", error.message);
  if (error.message.includes("no such column")) {
    console.log("\n🔧 The force_password_reset column doesn't exist. Running migration...");
    try {
      db.exec("ALTER TABLE users ADD COLUMN force_password_reset BOOLEAN DEFAULT 0");
      console.log("✅ Migration successful! Re-run this script to test.");
    } catch (migrationError) {
      console.error("❌ Migration failed:", migrationError.message);
    }
  }
}

db.close();
console.log("\n🏁 Test script completed.");
