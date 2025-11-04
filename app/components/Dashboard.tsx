"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import BudgetSummary from "./BudgetSummary";
import Toast from "./Toast";
import { BudgetSummary as BudgetSummaryType } from "@/lib/types";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [summary, setSummary] = useState<BudgetSummaryType>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    categoryBreakdown: [],
  });
  const [selectedMonth, setSelectedMonth] = useState(1); // Initialize with static value
  const [selectedYear, setSelectedYear] = useState(2025); // Initialize with static value
  const [showAllTime, setShowAllTime] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Set current date after mounting to prevent hydration mismatch
  useEffect(() => {
    const now = new Date();
    setSelectedMonth(now.getMonth() + 1);
    setSelectedYear(now.getFullYear());
  }, []);

  const fetchData = useCallback(async () => {
    // Only fetch data if user is authenticated
    if (status !== "authenticated" || !session) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const params = showAllTime ? "" : `?month=${selectedMonth}&year=${selectedYear}`;

      const summaryRes = await fetch(`/api/summary${params}`);

      if (summaryRes.ok) {
        setSummary(await summaryRes.json());
      } else if (summaryRes.status === 401) {
        // Session might not be fully established yet, retry after a short delay
        setTimeout(() => fetchData(), 1000);
        return;
      }
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear, showAllTime, status, session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Refresh data when session becomes available (with small delay to ensure session is fully established)
  useEffect(() => {
    if (status === "authenticated" && session) {
      // Add a small delay to ensure the session is fully established on the server
      const timeoutId = setTimeout(() => {
        fetchData();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [status, session, fetchData]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Financial Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">
            Track your income, expenses, and financial goals
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Filter Options</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="showAllTime"
                checked={showAllTime}
                onChange={(e) => setShowAllTime(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="showAllTime" className="text-gray-700 dark:text-gray-300 font-medium">
                Show All Time
              </label>
            </div>

            {!showAllTime && (
              <>
                <div className="flex items-center gap-2">
                  <label htmlFor="month" className="text-gray-700 dark:text-gray-300 font-medium">
                    Month:
                  </label>
                  <select
                    id="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="year" className="text-gray-700 dark:text-gray-300 font-medium">
                    Year:
                  </label>
                  <select
                    id="year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </>
              )}
            </button>
          </div>
        </div>

        {/* Budget Summary */}
        <BudgetSummary summary={summary} onLimitUpdate={fetchData} />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
