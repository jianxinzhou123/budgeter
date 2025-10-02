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

  const handleSaveLimit = async (categoryId: number, categoryName: string, categoryType: "income" | "expense") => {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-6 rounded-xl shadow-lg border border-green-100 dark:border-green-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            Total Income
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
            ${summary.totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 p-6 rounded-xl shadow-lg border border-red-100 dark:border-red-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
            Total Expenses
          </h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">${summary.totalExpenses.toFixed(2)}</p>
        </div>

        <div
          className={`p-6 rounded-xl shadow-lg border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
            summary.balance >= 0
              ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-100 dark:border-blue-800"
              : "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-100 dark:border-orange-800"
          }`}
        >
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">Balance</h3>
          <p
            className={`text-3xl font-bold mt-2 ${
              summary.balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"
            }`}
          >
            ${summary.balance.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Category Breakdown</h3>

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
                            cat.type === "income"
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
                            cat.type === "income"
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
