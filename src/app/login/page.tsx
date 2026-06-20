'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await signIn('credentials', {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        callbackUrl: '/today',
      });
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    try {
      await signIn('google', { callbackUrl: '/today' });
    } catch (err) {
      console.error('Google login error:', err);
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-foreground select-none">
      {/* Container */}
      <div className="max-w-md w-full border border-border bg-card p-8 rounded-lg shadow-sm space-y-6">
        
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent mb-2">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">The Four Pillar System</h1>
          <p className="text-muted text-xs leading-normal">
            A premium habit operating system to measure and manage your life.
          </p>
        </div>

        {/* Buttons list */}
        <div className="space-y-4 pt-2">
          {/* Google Login button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loadingGoogle || loading}
            className="w-full h-10 px-4 border border-border bg-hover hover:bg-border transition-colors font-semibold rounded text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loadingGoogle ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Credentials Email Login */}
          <form onSubmit={handleCredentialsLogin} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-9 px-3 text-sm bg-hover border border-border rounded focus:outline-none focus:border-accent text-foreground"
                required
                disabled={loading || loadingGoogle}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                Full Name (For signup)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Demo User (optional)"
                className="w-full h-9 px-3 text-sm bg-hover border border-border rounded focus:outline-none focus:border-accent text-foreground"
                disabled={loading || loadingGoogle}
              />
            </div>

            <button
              type="submit"
              disabled={loading || loadingGoogle || !email.trim()}
              className="w-full h-9 bg-accent text-accent-foreground text-sm font-semibold rounded hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                'Sign In / Sign Up'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
