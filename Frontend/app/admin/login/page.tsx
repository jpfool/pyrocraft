'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Invalid credentials');
      }

      const data = await response.json();
      setAuth(data.access_token, data.user);
      router.push('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-[#08080a] flex items-center justify-center p-8">
      <div className="relative z-10 w-full max-w-[400px] bg-white dark:bg-[#13131a] border border-zinc-200 dark:border-[#2a2820] rounded-lg p-6 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="text-center mb-8">
          <h1 className="font-cinzel text-[1.3rem] sm:text-[1.8rem] tracking-[0.25em] text-gold mb-2">PYROCRAFT Admin</h1>
          <p className="text-zinc-500 dark:text-[#8a8070] text-[0.9rem]">Sign in to manage your store</p>
        </div>

        {error && (
          <div className="bg-red-500/15 border border-red-500 text-red-500 p-3 rounded mb-6 text-[0.85rem] flex items-center gap-2">
            <span className="material-symbols-outlined shrink-0 text-xl">error</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-6">
            <label className="block text-[0.75rem] tracking-[0.1em] uppercase text-gold mb-2 font-medium">Username</label>
            <input
              type="text"
              required
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="Enter username"
              autoComplete="username"
              className="w-full bg-zinc-50 dark:bg-[#0e0e12] border border-zinc-200 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] p-3 font-jost text-[0.9rem] rounded outline-none transition-all duration-300 focus:border-gold focus:ring-2 focus:ring-gold/10 placeholder:text-zinc-400 dark:placeholder:text-[#8a8070]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[0.75rem] tracking-[0.1em] uppercase text-gold mb-2 font-medium">Password</label>
            <input
              type="password"
              required
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="Enter password"
              autoComplete="current-password"
              className="w-full bg-zinc-50 dark:bg-[#0e0e12] border border-zinc-200 dark:border-[#2a2820] text-zinc-900 dark:text-[#f0ead6] p-3 font-jost text-[0.9rem] rounded outline-none transition-all duration-300 focus:border-gold focus:ring-2 focus:ring-gold/10 placeholder:text-zinc-400 dark:placeholder:text-[#8a8070]"
            />
          </div>

          <button type="submit" className="w-full bg-gold text-white dark:text-[#08080a] border-none p-3.5 font-jost text-[0.85rem] tracking-[0.15em] uppercase rounded font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e8c97a] hover:shadow-[0_4px_12px_rgba(201,168,76,0.3)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="border-t border-zinc-200 dark:border-[#2a2820] pt-6">
          <p className="bg-zinc-50 dark:bg-[#0e0e12] border border-gold/50 dark:border-gold/30 p-4 rounded text-sm leading-relaxed text-zinc-900 dark:text-[#f0ead6]">
            <strong className="text-gold block mb-2">Demo Credentials:</strong>
            Username: <code className="bg-white dark:bg-[#08080a] text-gold px-1.5 py-0.5 rounded-sm font-mono text-[0.85rem]">admin</code><br/>
            Password: <code className="bg-white dark:bg-[#08080a] text-gold px-1.5 py-0.5 rounded-sm font-mono text-[0.85rem]">admin123</code>
          </p>
        </div>
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,#c9a84c20_0%,transparent_70%)] opacity-50 z-0 pointer-events-none"></div>
    </div>
  );
}
