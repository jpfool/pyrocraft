'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function ProtectedRoute({
  children,
  redirectTo = '/admin/login'
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const { isAuthenticated, token, isHydrated } = useAuth();

  useEffect(() => {
    // Only check auth once hydration is complete
    if (isHydrated && (!token || !isAuthenticated)) {
      router.push(redirectTo);
    }
  }, [isHydrated, isAuthenticated, token, router, redirectTo]);

  // Show a premium loading state while rehydrating or if not auth'd
  if (!isHydrated || (!token || !isAuthenticated)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-[#08080a] text-gold gap-6">
        <div className="relative">
          <span className="material-symbols-outlined animate-spin text-[4rem] opacity-20">sync</span>
          <span className="material-symbols-outlined absolute inset-0 flex items-center justify-center text-2xl">shield</span>
        </div>
        <div className="text-center">
          <h2 className="font-cinzel text-sm tracking-[0.3em] uppercase mb-2">Synchronizing Vault</h2>
          <p className="text-zinc-400 dark:text-[#8a8070] text-[0.6rem] uppercase tracking-[0.2em] animate-pulse">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
