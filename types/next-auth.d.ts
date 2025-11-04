import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "admin" | "user";
      force_password_reset?: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "admin" | "user";
    force_password_reset?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "user";
  }
}
