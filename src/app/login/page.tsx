'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Loader2, Sparkles, Brain, Compass, Heart, Activity, Mail, User, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (activeTab === 'signup' && !name.trim()) {
      setError('Please enter your full name to sign up.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        name: activeTab === 'signup' ? name.trim() : '',
        callbackUrl: '/today',
        redirect: true,
      });
      if (result?.error) {
        setError('Authentication failed. Please check your credentials and try again.');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    setError(null);
    try {
      await signIn('google', { callbackUrl: '/today' });
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-background text-foreground select-none overflow-y-auto lg:overflow-hidden">
      
      {/* Left Column: Premium Pillar & Core Philosophy Showcase (Desktop only) */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 bg-zinc-950 p-12 text-zinc-100 flex-col justify-between relative overflow-hidden border-r border-zinc-800/40">
        {/* Ambient Decorative Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(46,170,220,0.12),transparent_60%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[radial-gradient(circle_at_bottom_left,rgba(35,131,226,0.06),transparent_60%)] pointer-events-none" />
        
        {/* Top Branding */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-accent">
            <Sparkles size={20} className="text-[#2eaadc]" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-zinc-100">The Four Pillar System</span>
        </div>

        {/* Core Showcase: The Four Pillars */}
        <div className="my-auto py-12 space-y-8 relative z-10 max-w-lg">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 tracking-wide uppercase">
              Core Philosophy
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              A premium habit operating system to measure and manage your life.
            </h2>
            <p className="text-sm text-zinc-400">
              Stop managing lists. Automate daily task generation, trace historical trends, and audit your execution across four core sectors.
            </p>
          </div>

          {/* Pillars List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Mental Card */}
            <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-[#2eaadc]/40 transition-all group">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-1.5 rounded bg-blue-500/10 text-[#529cca]">
                  <Brain size={16} />
                </div>
                <span className="text-sm font-semibold text-zinc-200">Mental</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Build cognitive focus and clarity. Track reading, coding, studying, or planning.
              </p>
            </div>

            {/* Spiritual Card */}
            <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-[#4dab9a]/40 transition-all group">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-1.5 rounded bg-teal-500/10 text-[#4dab9a]">
                  <Compass size={16} />
                </div>
                <span className="text-sm font-semibold text-zinc-200">Spiritual</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Define purpose and presence. Track meditation, journaling, reflection, or nature.
              </p>
            </div>

            {/* Emotional Card */}
            <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-[#e25553]/40 transition-all group">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-1.5 rounded bg-red-500/10 text-[#e25553]">
                  <Heart size={16} />
                </div>
                <span className="text-sm font-semibold text-zinc-200">Emotional</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cultivate resilience and connection. Track family time, gratitude, and relationships.
              </p>
            </div>

            {/* Physical Card */}
            <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-[#ffc940]/40 transition-all group">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-1.5 rounded bg-yellow-500/10 text-[#ffc940]">
                  <Activity size={16} />
                </div>
                <span className="text-sm font-semibold text-zinc-200">Physical</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Maintain energy and strength. Track workouts, hydration, stretching, or quality sleep.
              </p>
            </div>

          </div>
        </div>

        {/* Live Mock Performance Stat */}
        <div className="relative z-10 p-4 bg-zinc-900/80 border border-zinc-800 rounded-lg max-w-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-zinc-300">Daily Life Score</span>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">STRONG</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-[#2eaadc] w-[82%] rounded-full" />
            </div>
            <span className="text-xs font-bold text-zinc-100">82%</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-2">
            Streak: <span className="text-zinc-300 font-medium">14 days</span> • Daily snapshot updated automatically.
          </p>
        </div>
      </div>

      {/* Right Column: Authentication Card & Form */}
      <div className="col-span-1 lg:col-span-7 xl:col-span-6 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-background">
        <div className="w-full max-w-[400px] space-y-8">
          
          {/* Header & Title */}
          <div className="space-y-2 text-center lg:text-left">
            {/* Mobile-Only Logo */}
            <div className="flex lg:hidden items-center justify-center gap-2.5 mb-6">
              <div className="p-2 rounded-lg bg-accent/10 border border-accent/20 text-accent">
                <Sparkles size={20} />
              </div>
              <span className="font-extrabold text-xl tracking-tight">The Four Pillar System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-xs text-muted leading-relaxed">
              {activeTab === 'login' 
                ? 'Sign in to resume tracking your habits and auditing your daily performance.' 
                : 'Get started with a premium, customized habit template configured for your life.'
              }
            </p>
          </div>

          {/* Toggle Tabs Control */}
          <div className="flex p-1 bg-hover border border-border rounded-lg">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('signup');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-xs leading-normal">
              {error}
            </div>
          )}

          {/* Authentication Actions */}
          <div className="space-y-5">
            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loadingGoogle || loading}
              className="w-full h-11 px-4 border border-border bg-card hover:bg-hover transition-colors font-semibold rounded-lg text-sm flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 shadow-sm"
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

            {/* Separator */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">or sign in with email</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              
              {/* Conditional Name Field for Sign Up */}
              {activeTab === 'signup' && (
                <div className="space-y-1.5">
                  <label htmlFor="name-input" className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-muted pointer-events-none">
                      <User size={15} />
                    </span>
                    <input
                      id="name-input"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Marcus Aurelius"
                      className="w-full h-10 pl-9 pr-3 text-sm bg-hover border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 text-foreground transition-all"
                      required={activeTab === 'signup'}
                      disabled={loading || loadingGoogle}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1.5">
                <label htmlFor="email-input" className="text-[10px] font-bold text-muted uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-muted pointer-events-none">
                    <Mail size={15} />
                  </span>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-10 pl-9 pr-3 text-sm bg-hover border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 text-foreground transition-all"
                    required
                    disabled={loading || loadingGoogle}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || loadingGoogle || !email.trim() || (activeTab === 'signup' && !name.trim())}
                className="w-full h-10 bg-accent text-accent-foreground text-sm font-semibold rounded-lg hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm mt-2"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>{activeTab === 'login' ? 'Log In' : 'Create Account'}</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Frictionless details explanation */}
          <p className="text-[10px] text-muted text-center leading-normal max-w-xs mx-auto">
            No password required. We secure your session with a frictionless secure credentials check or Google sign-in.
          </p>

        </div>
      </div>

    </div>
  );
}
