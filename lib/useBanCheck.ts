"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState, useCallback, useRef } from "react";

interface BanStatus {
  isBanned: boolean;
  reason: string | null;
  bannedUntil: string | null;
}

const CHECK_INTERVAL = 1 * 60 * 1000; // 1 minute
const MIN_CHECK_INTERVAL = 1 * 60 * 1000; // Minimum 1 minute between checks

export function useBanCheck() {
  const { data: session, status } = useSession();
  const [checking, setChecking] = useState(false);
  const [banInfo, setBanInfo] = useState<BanStatus | null>(null);
  const [countdown, setCountdown] = useState<number>(0);
  const lastCheckRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

  const checkBanStatus = useCallback(async () => {
    if (status !== "authenticated" || !session || checking) return;

    const now = Date.now();
    // Don't check if we've checked recently
    if (now - lastCheckRef.current < MIN_CHECK_INTERVAL) {
      return;
    }

    setChecking(true);
    lastCheckRef.current = now;

    try {
      const response = await fetch("/api/auth/ban-status");

      if (response.ok) {
        const banStatus: BanStatus = await response.json();

        if (banStatus.isBanned) {
          // User is banned, immediately invalidate session but show message for 60 seconds before redirect
          console.log("User ban detected, invalidating session and showing ban message...");

          // Immediately invalidate the session (but don't redirect yet)
          signOut({ redirect: false });

          setBanInfo(banStatus);
          setCountdown(10);

          // Start countdown for redirect only
          countdownIntervalRef.current = setInterval(() => {
            setCountdown((prev) => {
              console.log(`Ban countdown: ${prev}`);
              if (prev <= 1) {
                // Time's up, redirect to home page
                console.log("Ban countdown finished, redirecting to home page...");
                if (countdownIntervalRef.current) {
                  clearInterval(countdownIntervalRef.current);
                  countdownIntervalRef.current = null;
                }
                // Use multiple methods to ensure redirect happens
                try {
                  window.location.replace("/");
                } catch (e) {
                  console.error("window.location.replace failed, trying href:", e);
                  window.location.href = "/";
                }
                // Fallback with setTimeout
                setTimeout(() => {
                  console.log("Fallback redirect executing...");
                  window.location.href = "/";
                }, 500);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error checking ban status:", error);
    } finally {
      setChecking(false);
    }
  }, [session, status, checking]);

  useEffect(() => {
    if (status !== "authenticated" || !session) {
      hasInitializedRef.current = false;
      return;
    }

    // Prevent multiple initializations
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    // Initial check (only if we haven't checked recently)
    const now = Date.now();
    if (now - lastCheckRef.current >= MIN_CHECK_INTERVAL) {
      checkBanStatus();
    }

    // Set up interval for periodic checks
    intervalRef.current = setInterval(() => {
      checkBanStatus();
    }, CHECK_INTERVAL);

    return () => {
      // Clean up intervals
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
      hasInitializedRef.current = false;
    };
  }, [session, status, checkBanStatus]);

  // Handle page visibility changes (when user comes back to tab)
  useEffect(() => {
    if (status !== "authenticated" || !session) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, check if we need to verify ban status
        const now = Date.now();
        if (now - lastCheckRef.current >= MIN_CHECK_INTERVAL) {
          setTimeout(checkBanStatus, 1000); // Small delay to avoid rapid calls
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [session, status, checkBanStatus]);

  return { checking, banInfo, countdown };
}
