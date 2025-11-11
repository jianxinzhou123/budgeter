"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function WelcomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Dynamic Animated Background Elements with Blue/Purple Theme */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-500/20 dark:to-purple-500/20 animate-pulse"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/25 via-indigo-500/20 to-transparent rounded-full blur-3xl animate-pulse duration-4000"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-purple-500/25 via-violet-500/20 to-transparent rounded-full blur-3xl animate-pulse duration-6000"></div>
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-gradient-to-l from-indigo-500/25 via-blue-500/15 to-transparent rounded-full blur-2xl animate-bounce duration-5000"></div>
        <div className="absolute bottom-1/3 left-0 w-64 h-64 bg-gradient-to-r from-violet-500/25 via-purple-500/15 to-transparent rounded-full blur-2xl animate-pulse duration-3000"></div>

        <div className="relative mt-7 max-w-7xl mx-auto px-6 pt-20 pb-32">
          <div className="text-center">
            {/* Professional Rich Animation Logo */}
            <div className="mb-12 flex justify-center">
              <div className="relative group cursor-pointer">
                {/* Premium Glass Morphism Container */}
                <div className="relative backdrop-blur-md bg-gradient-to-br from-white/30 via-white/20 to-white/10 dark:from-gray-900/30 dark:via-gray-800/20 dark:to-gray-700/10 rounded-3xl p-12 border border-white/40 dark:border-gray-600/40 shadow-2xl group-hover:shadow-blue-500/20 dark:group-hover:shadow-blue-400/30 transition-all duration-700">
                  {/* Dynamic Multi-Layer Ambient Glow */}
                  <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/15 via-purple-500/20 to-indigo-500/15 dark:from-blue-400/20 dark:via-purple-400/25 dark:to-indigo-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse"></div>
                  <div
                    className="absolute -inset-6 bg-gradient-to-l from-purple-500/10 via-blue-500/15 to-violet-500/10 dark:from-purple-400/15 dark:via-blue-400/20 dark:to-violet-400/15 rounded-full blur-xl opacity-0 group-hover:opacity-80 transition-opacity duration-1200 delay-200 animate-pulse"
                    style={{ animationDelay: "1s", animationDuration: "3s" }}
                  ></div>
                  <div
                    className="absolute -inset-10 bg-gradient-to-br from-indigo-500/8 via-purple-500/12 to-blue-500/8 dark:from-indigo-400/12 dark:via-purple-400/16 dark:to-blue-400/12 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-1500 delay-400 animate-pulse"
                    style={{ animationDelay: "2s", animationDuration: "4s" }}
                  ></div>

                  {/* Dynamic Pulsating Rings with Blue/Purple Theme */}
                  <div
                    className="absolute inset-6 border border-blue-300/40 dark:border-blue-400/40 rounded-full scale-100 group-hover:scale-110 transition-all duration-1000 ease-out animate-pulse"
                    style={{ animationDuration: "2s" }}
                  ></div>
                  <div
                    className="absolute inset-8 border border-purple-300/35 dark:border-purple-400/35 rounded-full scale-100 group-hover:scale-105 transition-all duration-800 ease-out delay-100 animate-pulse"
                    style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
                  ></div>
                  <div
                    className="absolute inset-10 border border-indigo-300/30 dark:border-indigo-400/30 rounded-full scale-100 group-hover:scale-103 transition-all duration-600 ease-out delay-200 animate-pulse"
                    style={{ animationDelay: "1s", animationDuration: "3s" }}
                  ></div>

                  {/* Dynamic Breathing Animation Background */}
                  <div
                    className="absolute inset-4 bg-gradient-to-br from-blue-50/60 via-purple-50/40 to-indigo-50/60 dark:from-blue-900/25 dark:via-purple-900/20 dark:to-indigo-900/25 rounded-2xl opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"
                    style={{ animationDuration: "2s" }}
                  ></div>
                  <div
                    className="absolute inset-5 bg-gradient-to-tl from-purple-50/40 via-blue-50/30 to-violet-50/40 dark:from-purple-900/20 dark:via-blue-900/15 dark:to-violet-900/20 rounded-xl opacity-0 group-hover:opacity-80 animate-pulse transition-opacity duration-700 delay-300"
                    style={{ animationDelay: "1s", animationDuration: "3s" }}
                  ></div>

                  {/* Professional Money Symbol */}
                  <div className="text-7xl relative z-10 group-hover:scale-110 transition-all duration-700 ease-out filter drop-shadow-xl">
                    💰
                  </div>

                  {/* Dynamic Blue/Purple Particle System */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-0 group-hover:opacity-80 transition-all duration-700 delay-200 animate-bounce"></div>
                  <div className="absolute top-6 left-4 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-700 delay-400 animate-pulse"></div>
                  <div className="absolute bottom-4 left-6 w-2 h-2 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-70 transition-all duration-700 delay-600 animate-ping"></div>
                  <div className="absolute bottom-6 right-5 w-1 h-1 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-50 transition-all duration-700 delay-800 animate-bounce"></div>
                  <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-900 delay-300 animate-pulse"></div>
                  <div className="absolute bottom-8 left-8 w-1 h-1 bg-gradient-to-r from-purple-300 to-indigo-300 rounded-full opacity-0 group-hover:opacity-40 transition-all duration-800 delay-500 animate-ping"></div>

                  {/* Dynamic Blue/Purple Corner Accents */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-blue-400/50 dark:border-blue-300/50 rounded-tl-xl opacity-0 group-hover:opacity-70 transition-all duration-600 delay-300 animate-pulse"></div>
                  <div
                    className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-purple-400/50 dark:border-purple-300/50 rounded-tr-xl opacity-0 group-hover:opacity-70 transition-all duration-600 delay-500 animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-indigo-400/50 dark:border-indigo-300/50 rounded-bl-xl opacity-0 group-hover:opacity-70 transition-all duration-600 delay-700 animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                  <div
                    className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-violet-400/50 dark:border-violet-300/50 rounded-br-xl opacity-0 group-hover:opacity-70 transition-all duration-600 delay-900 animate-pulse"
                    style={{ animationDelay: "1.5s" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Dynamic Blue/Purple Hero Title */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-500 cursor-default">
                Sam&apos;s Budget
              </span>
              <br />
              <span className="inline-block bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-500 delay-100 cursor-default animate-pulse">
                Tracker
              </span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Take control of your financial future with our elegant and powerful budgeting platform. Track expenses,
              manage categories, and achieve your financial goals with this simple free-to-use tool.
            </p>

            {/* Dynamic Blue/Purple CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/auth/register"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-lg rounded-xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 border border-blue-500 overflow-hidden"
              >
                {/* Animated Background Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>

                <span className="relative flex items-center gap-3">
                  Use For Free
                  <svg
                    className="w-5 h-5 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/auth/login"
                className="group relative px-8 py-4 border-2 border-purple-300 dark:border-gray-600 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 text-gray-600 dark:text-gray-300 hover:border-purple-500 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 font-semibold text-lg rounded-xl transition-all duration-500 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 dark:hover:bg-gradient-to-r dark:hover:from-gray-700 dark:hover:to-gray-600 transform hover:scale-105 hover:rotate-1 shadow-lg hover:shadow-xl hover:shadow-purple-500/20"
              >
                <span className="relative flex items-center text-white gap-2">Sign In</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                Start Budgeting For Free
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with modern technology and designed for simplicity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - Enhanced Animation */}
            <div className="group p-8 bg-gradient-to-br from-white to-emerald-50/30 dark:from-gray-800 dark:to-emerald-900/20 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600">
              <div className="relative">
                <div className="text-5xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                  📊
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                Smart Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                Visualize your spending patterns with beautiful charts and insights that help you make informed
                financial decisions.
              </p>
            </div>

            {/* Feature 2 - Enhanced Animation */}
            <div className="group p-8 bg-gradient-to-br from-white to-cyan-50/30 dark:from-gray-800 dark:to-cyan-900/20 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 transform hover:-translate-y-4 hover:-rotate-1 border border-gray-100 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600">
              <div className="relative">
                <div className="text-5xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                  🎯
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                Goal Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                Set budgets for different categories and track your progress.
              </p>
            </div>

            {/* Feature 3 - Enhanced Animation */}
            <div className="group p-8 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/20 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600">
              <div className="relative">
                <div className="text-5xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                  🔒
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                Secure & Private
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                Your financial data is protected with industry-standard encryption and modern security practices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic CTA Section */}
      <div className="relative py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/30 rounded-full animate-bounce delay-0"></div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white/20 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/25 rounded-full animate-bounce delay-2000"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/15 rounded-full animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-pulse">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of users who have taken control of their financial future. Sign up today and start your
            budgeting journey!
          </p>
          <Link
            href="/auth/register"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-lg rounded-xl transition-all duration-500 transform hover:scale-110 hover:-rotate-2 shadow-xl hover:shadow-2xl hover:shadow-white/30 overflow-hidden"
          >
            {/* Animated Background Shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-200/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>

            <span className="relative">Start Your Journey</span>
            <svg
              className="relative w-5 h-5 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
