"use client";

import { useBanCheck } from "@/lib/useBanCheck";

export default function BanCheckWrapper({ children }: { children: React.ReactNode }) {
  const { banInfo, countdown } = useBanCheck();

  // Debug logging
  if (banInfo) {
    console.log("BanCheckWrapper: Ban detected!", { banInfo, countdown });
  }

  return (
    <>
      {children}

      {/* Ban Message Modal */}
      {banInfo && countdown > 0 && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Account Suspended</h2>

              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  {banInfo.bannedUntil
                    ? `Your account is suspended until ${new Date(banInfo.bannedUntil).toLocaleDateString()}.`
                    : "Your account has been permanently suspended."}
                </p>

                {banInfo.reason && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 px-4 py-3 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3 flex flex-col items-start">
                        <p className="text-sm font-medium">Reason for suspension:</p>
                        <p className="text-sm mt-1">{banInfo.reason}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg">
                  <p className="text-sm font-medium">You have been signed out.</p>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  If you believe this is an error, please contact support.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
