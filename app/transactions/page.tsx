"use client";

import { useState, useEffect } from "react";
import AddTransactionForm from "../components/AddTransactionForm";
import TransactionList from "../components/TransactionList";
import SearchTransactions, { SearchFilters } from "../components/SearchTransactions";
import Toast from "../components/Toast";
import { Category, TransactionWithCategory } from "@/lib/types";

export default function TransactionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<TransactionWithCategory[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAllTime, setShowAllTime] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      let params = showAllTime ? "" : `?month=${selectedMonth}&year=${selectedYear}`;

      // Add search filters to params
      if (searchFilters) {
        const searchParams = new URLSearchParams(params.replace('?', ''));
        if (searchFilters.description) searchParams.set('description', searchFilters.description);
        if (searchFilters.categoryId) searchParams.set('categoryId', searchFilters.categoryId.toString());
        if (searchFilters.amount !== undefined && searchFilters.amountOperator) {
          searchParams.set('amount', searchFilters.amount.toString());
          searchParams.set('amountOperator', searchFilters.amountOperator);
        }
        params = `?${searchParams.toString()}`;
      }

      const [categoriesRes, transactionsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch(`/api/transactions${params}`),
      ]);

      if (categoriesRes.ok) setCategories(await categoriesRes.json());
      if (transactionsRes.ok) setTransactions(await transactionsRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear, showAllTime, searchFilters]);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  };

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const handleResetSearch = () => {
    setSearchFilters(null);
  };

  const handleDeleteAll = async () => {
    if (transactions.length === 0) {
      showToast("No transactions to delete", "info");
      return;
    }

    const filterDescription = showAllTime
      ? "all transactions"
      : `all transactions in ${months[selectedMonth - 1]} ${selectedYear}`;

    if (!confirm(`Are you sure you want to delete ${filterDescription}? This action cannot be undone.`)) return;

    try {
      let params = showAllTime ? "" : `?month=${selectedMonth}&year=${selectedYear}`;

      // Add search filters to params
      if (searchFilters) {
        const searchParams = new URLSearchParams(params.replace('?', ''));
        if (searchFilters.description) searchParams.set('description', searchFilters.description);
        if (searchFilters.categoryId) searchParams.set('categoryId', searchFilters.categoryId.toString());
        if (searchFilters.amount !== undefined && searchFilters.amountOperator) {
          searchParams.set('amount', searchFilters.amount.toString());
          searchParams.set('amountOperator', searchFilters.amountOperator);
        }
        params = `?${searchParams.toString()}`;
      }

      const response = await fetch(`/api/transactions${params}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const result = await response.json();
        fetchData();
        showToast(`Successfully deleted ${result.deletedCount} transaction(s)!`, "success");
      } else {
        showToast("Failed to delete transactions", "error");
      }
    } catch (error) {
      console.error("Failed to delete transactions:", error);
      showToast("Failed to delete transactions", "error");
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchData();
        showToast("Transaction deleted successfully!", "success");
      } else {
        showToast("Failed to delete transaction", "error");
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      showToast("Failed to delete transaction", "error");
    }
  };

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
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Transactions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg">Manage and track your transactions</p>
        </div>

        {/* Search Transactions */}
        <SearchTransactions categories={categories} onSearch={handleSearch} onReset={handleResetSearch} />

        {/* Date Filter */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-5 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mb-6 mt-6">
          <div className="flex flex-wrap items-center gap-4 justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allTime"
                  checked={showAllTime}
                  onChange={(e) => setShowAllTime(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="allTime" className="text-sm font-medium dark:text-gray-300">
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

            {transactions.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Delete All
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AddTransactionForm categories={categories} onSuccess={fetchData} onShowToast={showToast} />
            <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
          </div>
        )}

        {/* Toast Notifications */}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
}
