import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { initDb } from "@/lib/db";

// Initialize database
initDb();

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name }: RegisterRequest = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = db.prepare("SELECT id FROM users WHERE email = ?").get(email);

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const result = db
      .prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)")
      .run(email, hashedPassword, name, "user");

    const userId = result.lastInsertRowid;

    // Create default categories for the new user
    const insertCategory = db.prepare("INSERT INTO categories (user_id, name, type, budget_limit) VALUES (?, ?, ?, ?)");

    // Default expense categories
    insertCategory.run(userId, "Food", "expense", 600);
    insertCategory.run(userId, "Entertainment", "expense", 200);
    insertCategory.run(userId, "General Expense", "expense", 300);
    insertCategory.run(userId, "Groceries", "expense", 500);
    insertCategory.run(userId, "Utilities", "expense", 200);
    insertCategory.run(userId, "Transportation", "expense", 150);
    insertCategory.run(userId, "Healthcare", "expense", 200);

    // Default income categories
    insertCategory.run(userId, "Salary", "income", 0);
    insertCategory.run(userId, "Freelancing", "income", 0);
    insertCategory.run(userId, "Investment Returns", "income", 0);

    // Default other categories
    insertCategory.run(userId, "Gift", "other", 0);
    insertCategory.run(userId, "Refund", "other", 0);

    return NextResponse.json({ message: "User created successfully", userId }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
