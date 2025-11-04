/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useTheme } from "@/app/providers/ThemeProvider";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ChangePasswordModal from "./ChangePasswordModal";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only calculate isDarkMode after mounting to prevent hydration mismatch
  const isDarkMode = mounted ? theme === "dark" : false;

  // Don't render theme-dependent UI until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-lg shadow-slate-200/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-18">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-4 group">
                <div className="text-4xl group-hover:scale-110 transition-transform duration-300">💰</div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-700 transition-all duration-300">
                    {`Sam's Budget Tracker`}
                  </h1>
                  <p className="text-xs text-slate-700 font-semibold">Manage your finances with ease.</p>
                </div>
              </a>
            </div>

            {/* Navigation Links Placeholder */}
            <div className="hidden md:flex items-center gap-2">
              <div className="h-8 w-20 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-8 w-24 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-100 rounded animate-pulse"></div>
            </div>

            {/* Dark Mode Toggle Placeholder */}
            <button className="p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 transform hover:scale-110">
              <div className="w-5 h-5 bg-gray-400 rounded"></div>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-gray-700/60 shadow-lg shadow-slate-200/20 dark:shadow-slate-800/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-3 group relative">
              {/* Professional Logo */}
              <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 shadow-sm group-hover:shadow-md group-hover:from-blue-700 group-hover:to-purple-700 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 transition-all duration-300 flex items-center justify-center">
                <div className="text-lg text-white group-hover:scale-110 transition-transform duration-300">💰</div>
              </div>

              <div className="relative">
                {/* Animated text gradient */}
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-indigo-700 dark:group-hover:from-blue-300 dark:group-hover:via-purple-300 dark:group-hover:to-indigo-300 transition-all duration-300 group-hover:scale-105">
                  {`Sam's Budget Tracker`}
                </h1>

                {/* Animated underline */}
                <div className="h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                <p className="text-xs text-slate-700 dark:text-gray-400 font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  Manage your finances with ease.
                </p>
              </div>
            </a>
          </div>

          {/* Right side container */}
          <div className="hidden md:flex items-center gap-6">
            {session ? (
              <>
                {/* Navigation Links - More compact */}
                <nav className="flex items-center gap-1">
                  <a
                    href="/"
                    className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-md hover:bg-slate-100 dark:hover:bg-gray-800/50"
                  >
                    Dashboard
                  </a>
                  <a
                    href="/transactions"
                    className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-md hover:bg-slate-100 dark:hover:bg-gray-800/50"
                  >
                    Transactions
                  </a>
                  <a
                    href="/categories"
                    className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded-md hover:bg-slate-100 dark:hover:bg-gray-800/50"
                  >
                    Categories
                  </a>
                  {session.user?.role === "admin" && (
                    <a
                      href="/admin"
                      className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800"
                    >
                      Admin Panel
                    </a>
                  )}
                </nav>

                {/* User Profile Section with Dropdown */}
                <div className="relative pl-6 border-l border-slate-200 dark:border-gray-700 group">
                  {/* User Avatar & Info - Hoverable */}
                  <div className="flex items-center gap-2 cursor-pointer py-2 px-3 rounded-lg transition-all duration-200 hover:bg-slate-100 dark:hover:bg-gray-700">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {(session.user?.name || session.user?.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-sm font-medium text-slate-700 dark:text-gray-300">
                        {session.user?.name || "User"}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-gray-400">{session.user?.email}</div>
                    </div>
                    {/* Dropdown arrow */}
                    <svg
                      className="w-4 h-4 text-slate-500 dark:text-gray-400 transition-transform group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {/* User info in dropdown for smaller screens */}
                      <div className="lg:hidden px-4 py-2 border-b border-slate-200 dark:border-gray-700">
                        <div className="text-sm font-medium text-slate-700 dark:text-gray-300">
                          {session.user?.name || "User"}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-gray-400">{session.user?.email}</div>
                      </div>

                      {/* Change Password Button */}
                      <button
                        onClick={() => setChangePasswordModalOpen(true)}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-gray-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-gray-700 dark:hover:text-blue-400 transition-all duration-200 flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V11a2 2 0 012-2m0 0V9a2 2 0 012-2m0 0V7a2 2 0 012-2m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m6 0h.01"
                          />
                        </svg>
                        Change Password
                      </button>

                      {/* Sign Out Button */}
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-gray-200 hover:bg-red-50 hover:text-red-700 dark:hover:bg-gray-700 dark:hover:text-red-400 transition-all duration-200 flex items-center gap-2 border-t border-slate-200 dark:border-gray-700 mt-1 pt-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Auth buttons for unauthenticated users */
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-slate-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-all duration-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800/50"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold transition-all duration-300 rounded-lg hover:scale-105 shadow-lg hover:shadow-xl border border-blue-500"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-3 rounded-xl bg-gradient-to-r from-slate-600 to-slate-700 dark:from-gray-700 dark:to-gray-600 hover:from-slate-700 hover:to-slate-800 dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group border border-slate-500 dark:border-gray-600"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg
                  className="w-6 h-6 text-amber-400 group-hover:text-amber-300 transition-colors duration-300 drop-shadow-sm"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-slate-100 dark:text-slate-200 group-hover:text-white dark:group-hover:text-slate-100 transition-colors duration-300 drop-shadow-lg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}

              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 to-purple-400/10 group-hover:from-blue-400/20 group-hover:to-purple-400/20 transition-all duration-300"></div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            <div className="px-6 py-4 space-y-3">
              {session ? (
                <>
                  {/* Mobile Navigation Links */}
                  <div className="space-y-2">
                    <a
                      href="/"
                      className="block px-3 py-2 text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-md hover:bg-slate-50 dark:hover:bg-gray-800/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </a>
                    <a
                      href="/transactions"
                      className="block px-3 py-2 text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-md hover:bg-slate-50 dark:hover:bg-gray-800/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Transactions
                    </a>
                    <a
                      href="/categories"
                      className="block px-3 py-2 text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-md hover:bg-slate-50 dark:hover:bg-gray-800/50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Categories
                    </a>
                    {session.user?.role === "admin" && (
                      <a
                        href="/admin"
                        className="block px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Panel
                      </a>
                    )}
                  </div>

                  {/* Mobile User Info */}
                  <div className="pt-3 border-t border-slate-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {(session.user?.name || session.user?.email || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-700 dark:text-gray-300">
                          {session.user?.name || "User"}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-gray-400">{session.user?.email}</div>
                      </div>
                    </div>

                    {/* Mobile Change Password Button */}
                    <button
                      onClick={() => {
                        setChangePasswordModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="group w-full mt-2 px-3 py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700 hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 text-slate-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg border border-slate-200/60 dark:border-gray-600/60 hover:border-blue-200 dark:hover:border-blue-700/50 transition-all duration-300"
                    >
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 transition-transform group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V11a2 2 0 012-2m0 0V9a2 2 0 012-2m0 0V7a2 2 0 012-2m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2m6 0h.01"
                          />
                        </svg>
                        Change Password
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="group w-full mt-2 px-3 py-2.5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-700 hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/30 dark:hover:to-red-800/30 text-slate-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 font-medium rounded-lg border border-slate-200/60 dark:border-gray-600/60 hover:border-red-200 dark:hover:border-red-700/50 transition-all duration-300"
                    >
                      <span className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 transition-transform group-hover:scale-110"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign Out
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                /* Mobile auth buttons */
                <div className="space-y-3">
                  <Link
                    href="/auth/login"
                    className="block w-full px-4 py-2 text-center text-slate-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-semibold rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block w-full px-4 py-2 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal isOpen={changePasswordModalOpen} onClose={() => setChangePasswordModalOpen(false)} />
    </nav>
  );
}
