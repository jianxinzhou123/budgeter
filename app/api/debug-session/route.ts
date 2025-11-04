import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user data directly from database
    const user = db.prepare("SELECT id, email, name, role, force_password_reset FROM users WHERE LOWER(email) = LOWER(?)").get(session.user.email) as
      | {
          id: number;
          email: string;
          name: string;
          role: string;
          force_password_reset: number;
        }
      | undefined;

    if (!user) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      session: {
        user: session.user,
        expires: session.expires
      },
      database: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        force_password_reset: Boolean(user.force_password_reset)
      }
    });
  } catch (error) {
    console.error("Error in debug API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}