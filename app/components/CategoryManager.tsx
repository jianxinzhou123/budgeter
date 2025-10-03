"use client";

import { useState } from "react";
import { Category } from "@/lib/types";

interface CategoryManagerProps {
  categories: Category[];
  onSuccess: () => void;
  onShowToast: (message: string, type: "success" | "error") => void;
}

export default function CategoryManager({ categories, onSuccess, onShowToast }: CategoryManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "expense" as "income" | "expense" | "other",
    budget_limit: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          budget_limit: parseFloat(formData.budget_limit) || 0,
        }),
      });

      if (response.ok) {
        setFormData({ name: "", type: "expense", budget_limit: "" });
        setIsOpen(false);
        onSuccess();
        onShowToast("Category added successfully!", "success");
      } else {
        const error = await response.json();
        onShowToast(error.error || "Failed to add category", "error");
      }
    } catch (error) {
      onShowToast("Failed to add category", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete the category "${name}"? This will also delete all associated transactions.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onSuccess();
        onShowToast("Category deleted successfully!", "success");
      } else {
        onShowToast("Failed to delete category", "error");
      }
    } catch (error) {
      onShowToast("Failed to delete category", "error");
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Manage Categories</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
        >
          {isOpen ? "Cancel" : "+ Add Category"}
        </button>
      </div>

      {isOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-5 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/30 rounded-xl border border-gray-200 dark:border-gray-600 animate-slide-up"
        >
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Category Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as "income" | "expense" | "other" })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white dark:bg-gray-700 dark:text-gray-200"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                Budget Limit {formData.type === "expense" && "(for expense categories)"}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.budget_limit}
                onChange={(e) => setFormData({ ...formData, budget_limit: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                placeholder="0.00"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              {loading ? "Adding..." : "Add Category"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
          Expense Categories
        </h3>
        {categories
          .filter((c) => c.type === "expense")
          .map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-red-50 dark:hover:from-gray-700 dark:hover:to-red-900/30 transition-all duration-200 hover:shadow-md"
            >
              <div>
                <span className="font-medium dark:text-gray-200">{category.name}</span>
                {category.budget_limit > 0 && (
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    (Limit: ${category.budget_limit.toFixed(2)})
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDelete(category.id, category.name)}
                className="text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Delete
              </button>
            </div>
          ))}

        <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3 mt-6">
          Income Categories
        </h3>
        {categories
          .filter((c) => c.type === "income")
          .map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50 dark:hover:from-gray-700 dark:hover:to-green-900/30 transition-all duration-200 hover:shadow-md"
            >
              <span className="font-medium dark:text-gray-200">{category.name}</span>
              <button
                onClick={() => handleDelete(category.id, category.name)}
                className="text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Delete
              </button>
            </div>
          ))}

        <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3 mt-6">
          Other Categories
        </h3>
        {categories
          .filter((c) => c.type === "other")
          .map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-purple-900/30 transition-all duration-200 hover:shadow-md"
            >
              <span className="font-medium dark:text-gray-200">{category.name}</span>
              <button
                onClick={() => handleDelete(category.id, category.name)}
                className="text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
