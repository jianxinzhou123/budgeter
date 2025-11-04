"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  name: string;
  role: "admin" | "user";
  is_banned: number;
  ban_reason: string | null;
  banned_until: string | null;
  force_password_reset: number;
  created_at: string;
  transaction_count: number;
  category_count: number;
  total_income: number;
  total_expenses: number;
}

interface UserDetails {
  user: User;
  transactions: Array<{
    id: number;
    amount: number;
    description: string;
    date: string;
    category_name: string;
    category_type: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    type: string;
    budget_limit: number;
    transaction_count: number;
    total_spent: number;
  }>;
}

export default function AdminPanel() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banData, setBanData] = useState({
    userId: 0,
    reason: "",
    bannedUntil: "",
    permanent: false,
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "admin") {
      router.push("/");
      return;
    }

    fetchUsers();
  }, [session, status, router]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleBanUser = (userId: number) => {
    setBanData({ userId, reason: "", bannedUntil: "", permanent: false });
    setBanModalOpen(true);
  };

  const submitBan = async () => {
    try {
      const response = await fetch(`/api/admin/users/${banData.userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ban",
          reason: banData.reason,
          bannedUntil: banData.permanent ? null : banData.bannedUntil,
        }),
      });

      if (response.ok) {
        setBanModalOpen(false);
        setBanData({ userId: 0, reason: "", bannedUntil: "", permanent: false });
        fetchUsers();
        if (selectedUser && selectedUser.user.id === banData.userId) {
          fetchUserDetails(banData.userId);
        }
      }
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  const unbanUser = async (userId: number) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "unban" }),
      });

      if (response.ok) {
        fetchUsers();
        if (selectedUser && selectedUser.user.id === userId) {
          fetchUserDetails(userId);
        }
      }
    } catch (error) {
      console.error("Error unbanning user:", error);
    }
  };

  const toggleForcePasswordReset = async (userId: number, forceReset: boolean) => {
    try {
      const response = await fetch("/api/admin/force-password-reset", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, forceReset }),
      });

      if (response.ok) {
        fetchUsers();
        if (selectedUser && selectedUser.user.id === userId) {
          fetchUserDetails(userId);
        }
      }
    } catch (error) {
      console.error("Error updating force password reset:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="admin-panel min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Manage users and monitor system activity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Users List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Users ({users.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                              <span className="text-sm">{user.role.toUpperCase()}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div>
                            <div>{user.transaction_count} transactions</div>
                            <div>{user.category_count} categories</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ${user.total_income.toFixed(2)} in • ${user.total_expenses.toFixed(2)} out
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            {user.is_banned ? (
                              <div>
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                  Banned
                                </span>
                                {user.banned_until && (
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Until: {new Date(user.banned_until).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Active
                              </span>
                            )}
                            {user.force_password_reset ? (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                Must Reset Password
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => fetchUserDetails(user.id)}
                              className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              View
                            </button>
                            {user.role !== "admin" && (
                              <>
                                {user.is_banned ? (
                                  <button
                                    onClick={() => unbanUser(user.id)}
                                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                  >
                                    Unban
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleBanUser(user.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    Ban
                                  </button>
                                )}
                                {user.force_password_reset ? (
                                  <button
                                    onClick={() => toggleForcePasswordReset(user.id, false)}
                                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300"
                                    title="Remove password reset requirement"
                                  >
                                    Clear Reset
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => toggleForcePasswordReset(user.id, true)}
                                    className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                                    title="Force user to reset password on next login"
                                  >
                                    Force Reset
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="lg:col-span-1">
            {selectedUser ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedUser.user.name} Details
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* User Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      User Information
                    </h4>
                    <div className="space-y-2 text-sm text-gray-900 dark:text-white">
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>{" "}
                        {selectedUser.user.email}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Role:</span>{" "}
                        {selectedUser.user.role}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Joined:</span>{" "}
                        {new Date(selectedUser.user.created_at).toLocaleDateString()}
                      </div>
                      {selectedUser.user.is_banned && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                          <div className="text-red-800 dark:text-red-200 font-medium">Banned</div>
                          <div className="text-red-600 dark:text-red-300 text-xs mt-1">
                            Reason: {selectedUser.user.ban_reason}
                          </div>
                          {selectedUser.user.banned_until && (
                            <div className="text-red-600 dark:text-red-300 text-xs">
                              Until: {new Date(selectedUser.user.banned_until).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Categories ({selectedUser.categories.length})
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedUser.categories.map((category) => (
                        <div key={category.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">{category.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {category.transaction_count} transactions • ${category.total_spent.toFixed(2)} spent
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Transactions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Recent Transactions
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedUser.transactions.slice(0, 10).map((transaction) => (
                        <div key={transaction.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {transaction.description || "No description"}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {transaction.category_name} • {new Date(transaction.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div
                              className={`font-medium ${
                                transaction.amount >= 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              ${Math.abs(transaction.amount).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
                <div className="text-gray-500 dark:text-gray-400">Select a user to view their details</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ban Modal */}
      {banModalOpen && (
        <div className="fixed inset-0 modal-backdrop bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="modal-content bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ban User</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for ban *
                </label>
                <textarea
                  value={banData.reason}
                  onChange={(e) => setBanData({ ...banData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter reason for banning this user..."
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={banData.permanent}
                    onChange={(e) => setBanData({ ...banData, permanent: e.target.checked })}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Permanent ban</span>
                </label>
              </div>

              {!banData.permanent && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ban until (optional)
                  </label>
                  <input
                    type="date"
                    value={banData.bannedUntil}
                    onChange={(e) => setBanData({ ...banData, bannedUntil: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setBanModalOpen(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={submitBan}
                disabled={!banData.reason}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Ban User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
