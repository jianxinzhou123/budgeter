"use client";

import { useTheme } from "@/app/providers/ThemeProvider";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
                    Sam's Budget Tracker
                  </h1>
                  <p className="text-xs text-slate-700 font-semibold">Manage your finances with ease.</p>
                </div>
              </a>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-2">
              <a
                href="/"
                className="px-4 py-2 text-slate-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-lg hover:bg-blue-50 hover:scale-105"
              >
                Dashboard
              </a>
              <a
                href="/transactions"
                className="px-4 py-2 text-slate-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-lg hover:bg-blue-50 hover:scale-105"
              >
                Transactions
              </a>
              <a
                href="/categories"
                className="px-4 py-2 text-slate-700 hover:text-blue-600 font-semibold transition-all duration-300 rounded-lg hover:bg-blue-50 hover:scale-105"
              >
                Categories
              </a>
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
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-gray-700/60 shadow-lg shadow-slate-200/20 dark:shadow-gray-900/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-18">
          {/* Logo and Brand */}
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-4 group relative">
              {/* Interactive Logo Container */}
              <div className="relative">
                {/* Animated background circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500 ease-out"></div>

                {/* Pulsing ring effect */}
                <div className="absolute inset-0 border-2 border-blue-400/30 dark:border-blue-500/40 rounded-full scale-0 group-hover:scale-125 group-hover:border-transparent transition-all duration-700 ease-out"></div>

                {/* Main logo with multiple effects */}
                <div className="text-4xl relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ease-out filter group-hover:brightness-110 group-hover:drop-shadow-lg">
                  💰
                </div>

                {/* Sparkle effects */}
                <div className="absolute -top-1 -right-1 text-yellow-400 text-xs opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300">
                  ✨
                </div>
                <div className="absolute -bottom-1 -left-1 text-blue-400 text-xs opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 delay-150 z-10">
                  ✨
                </div>
              </div>

              <div className="relative">
                {/* Animated text gradient */}
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-indigo-700 dark:group-hover:from-blue-300 dark:group-hover:to-indigo-300 transition-all duration-300 group-hover:scale-105">
                  Sam's Budget Tracker
                </h1>

                {/* Animated underline */}
                <div className="h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                <p className="text-xs text-slate-700 dark:text-gray-400 font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  Manage your finances with ease.
                </p>
              </div>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="/"
              className="px-4 py-2 text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-all duration-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800/50 hover:scale-105"
            >
              Dashboard
            </a>
            <a
              href="/transactions"
              className="px-4 py-2 text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-all duration-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800/50 hover:scale-105"
            >
              Transactions
            </a>
            <a
              href="/categories"
              className="px-4 py-2 text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-all duration-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800/50 hover:scale-105"
            >
              Categories
            </a>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-3 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-700 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-gray-700 dark:hover:to-gray-600 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 group"
            aria-label="Toggle theme"
          >
            {mounted && isDarkMode ? (
              <svg
                className="w-5 h-5 text-amber-500 group-hover:text-amber-400 transition-colors duration-300"
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
                className="w-5 h-5 text-slate-600 group-hover:text-indigo-600 transition-colors duration-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
