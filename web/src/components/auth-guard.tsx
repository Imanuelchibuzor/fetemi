"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/auth";

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
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-black uppercase tracking-widest text-foreground/40">Verifying Identity...</h2>
      </div>
    );
  }

  return <>{children}</>;
}
