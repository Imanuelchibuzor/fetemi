"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/auth";
import Loader from "./ui/loader";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check authentication on mount and route changes
    const checkAuth = () => {
      if (!auth.isAuthenticated()) {
        setAuthorized(false);
        // Redirect to /auth, saving the current path for post-login redirect
        router.push(`/auth?callbackUrl=${encodeURIComponent(pathname)}`);
      } else {
        setAuthorized(true);
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Optionally show a loading state while checking auth
  if (!authorized) {
    return <Loader text="Verifying Identity..." />;
  }

  return <>{children}</>;
}
