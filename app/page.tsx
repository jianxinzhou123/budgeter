"use client";

import { useState, useEffect } from "react";
import BudgetSummary from "./components/BudgetSummary";
import Toast from "./components/Toast";
import { BudgetSummary as BudgetSummaryType } from "@/lib/types";

export default function Home() {
  const [summary, setSummary] = useState<BudgetSummaryType>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    categoryBreakdown: [],
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAllTime, setShowAllTime] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      let params = showAllTime ? "" : `?month=${selectedMonth}&year=${selectedYear}`;

      const summaryRes = await fetch(`/api/summary${params}`);

      if (summaryRes.ok) setSummary(await summaryRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear, showAllTime]);

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
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
            Dashboard
          </h1>
          <p className="text-slate-800 dark:text-gray-400 mt-4 text-xl font-semibold">
            Manage your finances with ease and clarity
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Date Filter */}
        <div className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-200/60 dark:border-gray-700 mb-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allTime"
                checked={showAllTime}
                onChange={(e) => setShowAllTime(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="allTime" className="text-sm font-bold text-slate-800 dark:text-gray-300">
                Show All Time
              </label>
            </div>

            {!showAllTime && (
              <>
                <div>
                  <label className="text-sm font-medium mr-2 dark:text-gray-300">Month:</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mr-2 dark:text-gray-300">Year:</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="relative">
            <BudgetSummary summary={summary} onLimitUpdate={fetchData} />
          </div>
        )}

        {/* Toast Notifications */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}
