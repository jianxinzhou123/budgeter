"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function BannedPage() {
  useEffect(() => {
    // Automatically sign out the user when they reach this page
    signOut({ redirect: false }).then(() => {
      // Redirect to home page after sign out
      window.location.href = "/";
    });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account Suspended</h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Unfortunately, your account has been suspended by an administrator. You are being signed out automatically.
          </p>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Please contact us if you believe this is an error.
          </div>
        </div>

        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
      </div>
    </div>
  );
}
