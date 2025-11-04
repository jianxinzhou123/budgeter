"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function DebugSession() {
  const { data: session, status } = useSession();
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchDebugData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/debug-session");
      const data = await response.json();
      setDebugData(data);
    } catch (error) {
      console.error("Error fetching debug data:", error);
      setDebugData({ error: "Failed to fetch debug data" });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchDebugData();
    }
  }, [status]);

  if (status === "loading") {
    return <div>Loading session...</div>;
  }

  if (!session) {
    return <div>No session found - please log in</div>;
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Session Debug Info</h2>
      <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(session, null, 2)}
      </pre>

      <div className="mt-4 space-y-2">
        <div>
          <strong>Status:</strong> {status}
        </div>
        <div>
          <strong>User ID:</strong> {session.user?.id || "N/A"}
        </div>
        <div>
          <strong>Email:</strong> {session.user?.email || "N/A"}
        </div>
        <div>
          <strong>Role:</strong> {(session.user as { role?: string })?.role || "N/A"}
        </div>
        <div>
          <strong>Force Password Reset:</strong>{" "}
          {String((session.user as { force_password_reset?: boolean })?.force_password_reset)}
        </div>
      </div>

      <div className="mt-4 space-x-2">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Page
        </button>
        <button
          onClick={fetchDebugData}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Fetch Debug Data"}
        </button>
        <button
          onClick={async () => {
            try {
              const response = await fetch("/api/admin/force-password-reset", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId: parseInt(session?.user?.id || "0"),
                  forceReset: true,
                }),
              });
              if (response.ok) {
                alert("Force reset flag set! Refresh to see changes.");
                fetchDebugData();
              } else {
                alert("Failed to set force reset flag - may need admin rights");
              }
            } catch (error) {
              alert("Error: " + error);
            }
          }}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Test Force Reset (Self)
        </button>
      </div>

      {debugData && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Database vs Session Comparison</h3>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
