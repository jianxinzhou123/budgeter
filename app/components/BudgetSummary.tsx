"use client";

import { BudgetSummary as BudgetSummaryType } from "@/lib/types";
import { useState } from "react";

interface BudgetSummaryProps {
  summary: BudgetSummaryType;
  onLimitUpdate?: () => void;
}

export default function BudgetSummary({ summary, onLimitUpdate }: BudgetSummaryProps) {
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [newLimit, setNewLimit] = useState<string>("");

  const handleEditClick = (categoryId: number, currentLimit: number) => {
    setEditingCategory(categoryId);
    setNewLimit(currentLimit.toString());
  };

  const handleSaveLimit = async (
    categoryId: number,
    categoryName: string,
    categoryType: "income" | "expense" | "other"
  ) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: categoryName,
          type: categoryType,
          budget_limit: parseFloat(newLimit) || 0,
        }),
      });

      if (response.ok) {
        setEditingCategory(null);
        onLimitUpdate?.();
      }
    } catch (error) {
      console.error("Failed to update budget limit:", error);
    }
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setNewLimit("");
  };

  return (
    <div className="space-y-6">
      {/* Overall Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-green-900/30 dark:to-emerald-900/30 p-8 rounded-2xl shadow-xl border border-emerald-100/60 dark:border-green-800 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/10 dark:from-green-500/10 dark:to-emerald-500/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                Total Income
              </h3>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
              ${summary.totalIncome.toFixed(2)}
            </p>
            <div className="w-full h-1 bg-emerald-200 dark:bg-emerald-800 rounded-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-green-500 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-br from-rose-50 via-red-50 to-pink-50 dark:from-red-900/30 dark:to-rose-900/30 p-8 rounded-2xl shadow-xl border border-rose-100/60 dark:border-red-800 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-red-500/10 dark:from-red-500/10 dark:to-rose-500/20"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider">
                Total Expenses
              </h3>
              <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-4xl font-bold text-rose-600 dark:text-rose-400 mb-2 group-hover:text-rose-700 dark:group-hover:text-rose-300 transition-colors">
              ${summary.totalExpenses.toFixed(2)}
            </p>
            <div className="w-full h-1 bg-rose-200 dark:bg-rose-800 rounded-full overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-rose-400 to-red-500 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div
          className={`relative p-8 rounded-2xl shadow-xl border hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] group overflow-hidden ${
            summary.balance >= 0
              ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-100/60 dark:border-blue-800"
              : "bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-orange-900/30 dark:to-amber-900/30 border-amber-100/60 dark:border-orange-800"
          }`}
        >
          <div
            className={`absolute inset-0 ${
              summary.balance >= 0
                ? "bg-gradient-to-br from-blue-500/5 to-indigo-500/10 dark:from-blue-500/10 dark:to-indigo-500/20"
                : "bg-gradient-to-br from-amber-500/5 to-orange-500/10 dark:from-amber-500/10 dark:to-orange-500/20"
            }`}
          ></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3
                className={`text-sm font-bold uppercase tracking-wider ${
                  summary.balance >= 0 ? "text-blue-700 dark:text-blue-300" : "text-amber-700 dark:text-amber-300"
                }`}
              >
                Balance
              </h3>
              <div
                className={`w-3 h-3 rounded-full animate-pulse ${
                  summary.balance >= 0 ? "bg-blue-500" : "bg-amber-500"
                }`}
              ></div>
            </div>
            <p
              className={`text-4xl font-bold mb-2 transition-colors ${
                summary.balance >= 0
                  ? "text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300"
                  : "text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300"
              }`}
            >
              ${summary.balance.toFixed(2)}
            </p>
            <div
              className={`w-full h-1 rounded-full overflow-hidden ${
                summary.balance >= 0 ? "bg-blue-200 dark:bg-blue-800" : "bg-amber-200 dark:bg-amber-800"
              }`}
            >
              <div
                className={`w-full h-full animate-pulse ${
                  summary.balance >= 0
                    ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                    : "bg-gradient-to-r from-amber-400 to-orange-500"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white/95 dark:bg-gray-800/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-slate-200/60 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
          <h3 className="text-2xl font-bold text-slate-800 dark:text-gray-200">Category Breakdown</h3>
        </div>

        <div className="space-y-4">
          {summary.categoryBreakdown.map((cat) => {
            const percentage = cat.budget_limit > 0 ? (cat.total / cat.budget_limit) * 100 : 0;
            const isOverBudget = cat.type === "expense" && percentage > 100;

            return (
              <div key={cat.category_id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium dark:text-gray-300">{cat.category_name}</span>
                  <div className="flex items-center gap-2">
                    {editingCategory === cat.category_id ? (
                      <>
                        <span
                          className={`font-bold ${
                            cat.type === "other"
                              ? "text-orange-600 dark:text-orange-400"
                              : cat.type === "income"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          ${cat.total.toFixed(2)} / $
                        </span>
                        <input
                          type="number"
                          value={newLimit}
                          onChange={(e) => setNewLimit(e.target.value)}
                          className="w-24 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 text-sm"
                          step="0.01"
                          min="0"
                        />
                        <button
                          onClick={() => handleSaveLimit(cat.category_id, cat.category_name, cat.type)}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <span
                          className={`font-bold ${
                            cat.type === "other"
                              ? "text-orange-600 dark:text-orange-400"
                              : cat.type === "income"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          ${cat.total.toFixed(2)}
                          {cat.budget_limit > 0 && ` / $${cat.budget_limit.toFixed(2)}`}
                        </span>
                        {cat.type === "expense" && (
                          <button
                            onClick={() => handleEditClick(cat.category_id, cat.budget_limit)}
                            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                          >
                            Set New Limit
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {cat.type === "expense" && cat.budget_limit > 0 && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                        isOverBudget
                          ? "bg-gradient-to-r from-red-400 to-red-500"
                          : "bg-gradient-to-r from-blue-500 to-red-400"
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                )}

                {isOverBudget && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    Over budget by ${(cat.total - cat.budget_limit).toFixed(2)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
