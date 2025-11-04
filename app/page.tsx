"use client";

import { useSession } from "next-auth/react";
import Dashboard from "./components/Dashboard";
import WelcomePage from "./components/WelcomePage";

export default function Home() {
  const { data: session, status } = useSession();

  // Show loading spinner while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show Dashboard if authenticated, Welcome page if not
  return session ? <Dashboard /> : <WelcomePage />;
}
