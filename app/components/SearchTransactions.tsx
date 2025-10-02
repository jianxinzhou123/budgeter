"use client";

import { useState } from "react";
import { Category } from "@/lib/types";

interface SearchTransactionsProps {
  categories: Category[];
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
}

export interface SearchFilters {
  description?: string;
  categoryId?: number;
  amountOperator?: "greater" | "less" | "equal";
  amount?: number;
}

export default function SearchTransactions({ categories, onSearch, onReset }: SearchTransactionsProps) {
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [amountOperator, setAmountOperator] = useState<"greater" | "less" | "equal">("equal");
  const [amount, setAmount] = useState<number | "">("");

  const handleSearch = () => {
    const filters: SearchFilters = {};

    if (description.trim()) {
      filters.description = description.trim();
    }

    if (categoryId !== "") {
      filters.categoryId = Number(categoryId);
    }

    if (amount !== "") {
      filters.amountOperator = amountOperator;
      filters.amount = Number(amount);
    }

    onSearch(filters);
  };

  const handleReset = () => {
    setDescription("");
    setCategoryId("");
    setAmount("");
    setAmountOperator("equal");
    onReset();
  };

  const hasFilters = description || categoryId !== "" || amount !== "";

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Search Transactions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Description Search */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Search by name..."
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.type})
              </option>
            ))}
          </select>
        </div>

        {/* Amount Operator */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Amount
          </label>
          <select
            value={amountOperator}
            onChange={(e) => setAmountOperator(e.target.value as "greater" | "less" | "equal")}
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="equal">Equal to</option>
            <option value="greater">Greater than</option>
            <option value="less">Less than</option>
          </select>
        </div>

        {/* Amount Value */}
        <div>
          <label className="block text-sm font-medium mb-1 dark:text-gray-300">
            Value
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
            placeholder="Amount..."
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-sm"
        >
          Search
        </button>
        {hasFilters && (
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors shadow-sm"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
