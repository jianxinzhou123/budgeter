"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import ForcePasswordResetModal from "./ForcePasswordResetModal";

interface ForcePasswordResetWrapperProps {
  children: React.ReactNode;
}

export default function ForcePasswordResetWrapper({ children }: ForcePasswordResetWrapperProps) {
  const { data: session, status } = useSession();
  const [showForceReset, setShowForceReset] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Check if user needs to force reset password
      const userWithReset = session.user as { force_password_reset?: boolean };
      console.log("ForcePasswordResetWrapper: Checking user", {
        email: session.user.email,
        force_password_reset: userWithReset.force_password_reset,
        fullUser: userWithReset,
      });

      if (userWithReset.force_password_reset) {
        console.log("ForcePasswordResetWrapper: Setting showForceReset to true");
        setShowForceReset(true);
      } else {
        setShowForceReset(false);
      }
    }
  }, [session, status]);

  // Don't show children if force reset is required
  if (status === "authenticated" && showForceReset) {
    return <ForcePasswordResetModal isOpen={true} userEmail={session?.user?.email || ""} />;
  }

  return <>{children}</>;
}
