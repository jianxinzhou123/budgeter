"use client";

import { TransactionWithCategory } from "@/lib/types";

interface TransactionListProps {
  transactions: TransactionWithCategory[];
  onDelete: (id: number) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Recent Transactions</h2>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💰</div>
          <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Add your first transaction to get started</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 dark:hover:from-gray-700 dark:hover:to-blue-900/30 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-medium dark:text-gray-200">{transaction.category_name}</div>
                    <span
                      className={`text-lg font-bold ${
                        transaction.category_type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.category_type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {transaction.description && (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.description}</p>
                  </>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
