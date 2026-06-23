'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Brain, 
  Compass, 
  Heart, 
  Dumbbell, 
  ArrowRight, 
  Zap, 
  Award, 
  CheckCircle2, 
  LineChart, 
  Layout, 
  Clock, 
  ShieldCheck, 
  X,
  Menu,
  ChevronRight
} from 'lucide-react';

interface LandingPageClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

export default function LandingPageClient({ user }: LandingPageClientProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'mental' | 'spiritual' | 'emotional' | 'physical'>('mental');
  
  // Interactive Simulator State
  const [simHabits, setSimHabits] = useState({
    mental: false,
    spiritual: false,
    emotional: false,
    physical: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate simulated score
  const tickedCount = Object.values(simHabits).filter(Boolean).length;
  const simScore = 40 + tickedCount * 15; // 40% base, +15% per habit
  
  const getSimCategory = (score: number) => {
    if (score >= 90) return { name: 'Elite', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' };
    if (score >= 70) return { name: 'Strong', color: 'text-accent bg-accent/10 border-accent/20' };
    if (score >= 50) return { name: 'Improving', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' };
    return { name: 'Needs Attention', color: 'text-red-500 bg-red-500/10 border-red-500/20' };
  };

  const simCategory = getSimCategory(simScore);

  const toggleSimHabit = (key: 'mental' | 'spiritual' | 'emotional' | 'physical') => {
    setSimHabits(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Sparkles className="w-12 h-12 text-accent animate-spin" />
          <p className="text-sm font-semibold tracking-wider uppercase text-muted">Loading System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-accent/20 overflow-x-hidden overflow-y-auto h-screen relative">
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(35,131,226,0.08),transparent_50%)] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />

      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/40 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-hover border border-border text-accent">
              <Sparkles size={20} className="text-accent" />
            </div>
            <span className="font-bold text-lg tracking-tight">The Four Pillar System</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
            <a href="#philosophy" className="hover:text-foreground transition-colors">Philosophy</a>
            <a href="#pillars" className="hover:text-foreground transition-colors">Four Pillars</a>
            <a href="#simulator" className="hover:text-foreground transition-colors">Interactive OS</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs font-medium text-muted">
                  Signed in as <span className="text-foreground font-semibold">{user.name}</span>
                </span>
                <Link
                  href="/dashboard"
                  className="h-9 px-4 bg-accent text-accent-foreground text-xs font-semibold rounded-lg hover:opacity-95 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="h-9 px-4 text-xs font-semibold hover:bg-hover border border-transparent rounded-lg transition-colors flex items-center"
                >
                  Log In
                </Link>
                <Link
                  href="/login"
                  className="h-9 px-4 bg-accent text-accent-foreground text-xs font-semibold rounded-lg hover:opacity-95 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Get Started</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center space-y-8 select-none">
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent tracking-wide uppercase">
              <Sparkles size={12} />
              Introducing Personal Habit OS v2.0
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight md:leading-none">
              Systemize Your Habits. <br />
              <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                Balance Your Life.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-muted max-w-2xl mx-auto font-normal leading-relaxed">
              Inspired by Notion's minimalist block design, The Four Pillar System is a premium habit operating system designed to measure and manage your cognitive, mental, emotional, and physical execution.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto h-12 px-8 bg-accent text-accent-foreground text-sm font-semibold rounded-lg hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>Enter Your Dashboard</span>
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full sm:w-auto h-12 px-8 bg-accent text-accent-foreground text-sm font-semibold rounded-lg hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <span>Start Tracking For Free</span>
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="#simulator"
                  className="w-full sm:w-auto h-12 px-8 hover:bg-hover border border-border text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Test Drive Simulator
                </a>
              </>
            )}
          </div>

          {/* Interactive Hero Mockup */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-2xl relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
              
              {/* Fake Window Controls */}
              <div className="h-10 border-b border-border/60 bg-hover/40 px-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 group-hover:bg-red-500/50 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/50 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20 group-hover:bg-emerald-500/50 transition-colors" />
                </div>
                <div className="text-[10px] text-muted font-mono bg-border/40 px-3 py-0.5 rounded">
                  https://fourpillars.io/dashboard
                </div>
                <div className="w-12" />
              </div>

              {/* Mock Dashboard Layout */}
              <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {/* Score Widget */}
                <div className="p-5 border border-border/80 bg-hover/20 rounded-lg flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Life Score Snapshot</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-extrabold font-mono text-accent">86</span>
                      <span className="text-xs text-muted">/ 100</span>
                    </div>
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded font-bold border text-accent bg-accent/10 border-accent/20">
                      STRONG PROGRESS
                    </span>
                  </div>
                  <div className="w-full bg-border h-1.5 rounded overflow-hidden">
                    <div className="h-full bg-accent w-[86%] rounded" />
                  </div>
                </div>

                {/* Habits Completion Checklist */}
                <div className="p-5 border border-border/80 bg-hover/20 rounded-lg space-y-3 md:col-span-2">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Daily Pillar Action Plan</span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-background border border-border/40 rounded">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-mental" />
                        <span className="text-xs font-semibold text-foreground">Mental: Study Technical Design Patterns</span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-background border border-border/40 rounded">
                      <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-spiritual" />
                        <span className="text-xs font-semibold text-foreground">Spiritual: 15-minute Guided Meditation</span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-background border border-border/40 rounded opacity-60">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-physical" />
                        <span className="text-xs font-semibold text-foreground">Physical: Weight training & stretching</span>
                      </div>
                      <div className="w-4 h-4 rounded-full border border-border" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE FOUR PILLARS SECTION */}
        <section id="pillars" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/40 select-none">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">The Core Pillars</h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Real alignment comes from tracking all aspects of existence. We split habits into four core dimensions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mental Card */}
            <div className="p-6 bg-card border border-border rounded-xl transition-all duration-300 hover:border-mental hover:shadow-[0_0_20px_rgba(35,131,226,0.08)] group relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-mental/10 border border-mental/25 flex items-center justify-center text-mental group-hover:scale-105 transition-transform">
                  <Brain size={20} />
                </div>
                <h3 className="text-lg font-bold text-foreground">Mental Pillar</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Focus on intellectual expansion, technical learning, logic and mindfulness. Keep your mind sharp and active.
                </p>
                <div className="border-t border-border/60 pt-3 space-y-1.5">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Recommended Tasks:</span>
                  <ul className="text-xs text-foreground space-y-1 list-disc list-inside">
                    <li>Read 20 pages</li>
                    <li>Code a feature</li>
                    <li>Solve algorithm challenges</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Spiritual Card */}
            <div className="p-6 bg-card border border-border rounded-xl transition-all duration-300 hover:border-spiritual hover:shadow-[0_0_20px_rgba(15,123,108,0.08)] group relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-spiritual/10 border border-spiritual/25 flex items-center justify-center text-spiritual group-hover:scale-105 transition-transform">
                  <Compass size={20} />
                </div>
                <h3 className="text-lg font-bold text-foreground">Spiritual Pillar</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Build presence, define core principles, and reconnect. Dedicate moments for silence, nature walks, and grounding.
                </p>
                <div className="border-t border-border/60 pt-3 space-y-1.5">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Recommended Tasks:</span>
                  <ul className="text-xs text-foreground space-y-1 list-disc list-inside">
                    <li>15m Silent Meditation</li>
                    <li>Journal current thoughts</li>
                    <li>Walk in nature</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Emotional Card */}
            <div className="p-6 bg-card border border-border rounded-xl transition-all duration-300 hover:border-emotional hover:shadow-[0_0_20px_rgba(212,64,42,0.08)] group relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-emotional/10 border border-emotional/25 flex items-center justify-center text-emotional group-hover:scale-105 transition-transform">
                  <Heart size={20} />
                </div>
                <h3 className="text-lg font-bold text-foreground">Emotional Pillar</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Cultivate strong relationships, direct connection, emotional audit, gratitude, and empathy practices.
                </p>
                <div className="border-t border-border/60 pt-3 space-y-1.5">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Recommended Tasks:</span>
                  <ul className="text-xs text-foreground space-y-1 list-disc list-inside">
                    <li>Call family or close friend</li>
                    <li>Write 3 gratitudes</li>
                    <li>Perform act of kindness</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Physical Card */}
            <div className="p-6 bg-card border border-border rounded-xl transition-all duration-300 hover:border-physical hover:shadow-[0_0_20px_rgba(193,136,0,0.08)] group relative overflow-hidden flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-physical/10 border border-physical/25 flex items-center justify-center text-physical group-hover:scale-105 transition-transform">
                  <Dumbbell size={20} />
                </div>
                <h3 className="text-lg font-bold text-foreground">Physical Pillar</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Manage energy levels, physiological recovery, high nutrition, physical workouts, and sleep cycles.
                </p>
                <div className="border-t border-border/60 pt-3 space-y-1.5">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Recommended Tasks:</span>
                  <ul className="text-xs text-foreground space-y-1 list-disc list-inside">
                    <li>30m Cardiovascular Workout</li>
                    <li>Drink 3 liters of water</li>
                    <li>Stretch / Yoga sequence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE SIMULATOR SECTION */}
        <section id="simulator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/40 select-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side text */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-semibold text-accent tracking-wide uppercase">
                Interactive Audit OS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Simulate Your Balanced Life Score
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Standard checklists are binary. You either complete them or fail them. The Four Pillar System measures your execution weight, giving you an organic **Life Score** dynamically updated depending on the category of your habit execution.
              </p>
              <p className="text-xs text-muted leading-relaxed">
                **Interactive Demo:** Click the switches in the mockup panel on the right to complete habits and witness how your score categories shift between *Needs Attention*, *Improving*, *Strong*, and *Elite*.
              </p>
            </div>

            {/* Right side simulator panel */}
            <div className="lg:col-span-7">
              <div className="p-6 sm:p-8 bg-card border border-border rounded-xl shadow-lg relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Circular Score Widget */}
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg width={140} height={140} className="transform -rotate-90">
                      <circle
                        className="text-border"
                        strokeWidth={10}
                        stroke="currentColor"
                        fill="transparent"
                        r={60}
                        cx={70}
                        cy={70}
                      />
                      <circle
                        className="text-accent transition-all duration-500 ease-out"
                        strokeWidth={10}
                        strokeDasharray={2 * Math.PI * 60}
                        strokeDashoffset={2 * Math.PI * 60 - (simScore / 100) * 2 * Math.PI * 60}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={60}
                        cx={70}
                        cy={70}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-extrabold font-mono">{simScore}%</span>
                      <span className="text-[10px] text-muted font-bold tracking-widest uppercase">Score</span>
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <span className="text-xs text-muted block">Current Status</span>
                    <span className={`inline-block text-xs px-2.5 py-0.5 rounded font-bold border transition-colors ${simCategory.color}`}>
                      {simCategory.name}
                    </span>
                  </div>
                </div>

                {/* Habit Checkboxes */}
                <div className="space-y-4 flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider block">Daily Checklist Audit</span>
                  
                  {/* Mental Habit */}
                  <button 
                    onClick={() => toggleSimHabit('mental')}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      simHabits.mental 
                        ? 'border-mental/40 bg-mental/5 text-foreground' 
                        : 'border-border/60 hover:border-border text-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded ${simHabits.mental ? 'bg-mental/10 text-mental' : 'bg-hover text-muted'}`}>
                        <Brain size={16} />
                      </div>
                      <span className="text-xs font-semibold">Mental Habit Completed</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      simHabits.mental ? 'border-mental bg-mental text-white' : 'border-border'
                    }`}>
                      {simHabits.mental && <span className="text-[10px]">✓</span>}
                    </div>
                  </button>

                  {/* Spiritual Habit */}
                  <button 
                    onClick={() => toggleSimHabit('spiritual')}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      simHabits.spiritual 
                        ? 'border-spiritual/40 bg-spiritual/5 text-foreground' 
                        : 'border-border/60 hover:border-border text-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded ${simHabits.spiritual ? 'bg-spiritual/10 text-spiritual' : 'bg-hover text-muted'}`}>
                        <Compass size={16} />
                      </div>
                      <span className="text-xs font-semibold">Spiritual Habit Completed</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      simHabits.spiritual ? 'border-spiritual bg-spiritual text-white' : 'border-border'
                    }`}>
                      {simHabits.spiritual && <span className="text-[10px]">✓</span>}
                    </div>
                  </button>

                  {/* Emotional Habit */}
                  <button 
                    onClick={() => toggleSimHabit('emotional')}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      simHabits.emotional 
                        ? 'border-emotional/40 bg-emotional/5 text-foreground' 
                        : 'border-border/60 hover:border-border text-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded ${simHabits.emotional ? 'bg-emotional/10 text-emotional' : 'bg-hover text-muted'}`}>
                        <Heart size={16} />
                      </div>
                      <span className="text-xs font-semibold">Emotional Habit Completed</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      simHabits.emotional ? 'border-emotional bg-emotional text-white' : 'border-border'
                    }`}>
                      {simHabits.emotional && <span className="text-[10px]">✓</span>}
                    </div>
                  </button>

                  {/* Physical Habit */}
                  <button 
                    onClick={() => toggleSimHabit('physical')}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      simHabits.physical 
                        ? 'border-physical/40 bg-physical/5 text-foreground' 
                        : 'border-border/60 hover:border-border text-muted hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded ${simHabits.physical ? 'bg-physical/10 text-physical' : 'bg-hover text-muted'}`}>
                        <Dumbbell size={16} />
                      </div>
                      <span className="text-xs font-semibold">Physical Habit Completed</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      simHabits.physical ? 'border-physical bg-physical text-white' : 'border-border'
                    }`}>
                      {simHabits.physical && <span className="text-[10px]">✓</span>}
                    </div>
                  </button>

                </div>
              </div>
            </div>

          </div>
        </section>

        {/* PHILOSOPHY / QUOTE SECTION */}
        <section id="philosophy" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/40 select-none">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest block">Philosophical Foundation</span>
            <blockquote className="text-lg sm:text-2xl font-serif italic text-foreground leading-relaxed">
              "No citizen has a right to be an amateur in the matter of physical training. It is a shame for a man to grow old without seeing the beauty and strength of which his body is capable. But even more, the mind, the spirit, and our human connections must be honed with daily intention."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-border" />
              <cite className="text-xs font-mono text-muted uppercase not-italic tracking-wider">Life Balance Thesis</cite>
              <div className="h-px w-8 bg-border" />
            </div>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-border/40 select-none">
          <div className="text-center space-y-3 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Engineered for Daily Tracking</h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Everything you need to build long-term alignment without complex interfaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-5 rounded-xl hover:bg-hover/20 border border-transparent hover:border-border transition-all">
              <div className="p-2 w-10 h-10 rounded-lg bg-accent/10 border border-accent/25 text-accent flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h3 className="text-base font-bold">Automated Daily Tasks</h3>
              <p className="text-xs text-muted leading-relaxed">
                Configure your master habits once. Our automated pipeline generates your daily checklist at midnight based on your timezone.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-xl hover:bg-hover/20 border border-transparent hover:border-border transition-all">
              <div className="p-2 w-10 h-10 rounded-lg bg-accent/10 border border-accent/25 text-accent flex items-center justify-center">
                <LineChart size={20} />
              </div>
              <h3 className="text-base font-bold">Historical Performance Trends</h3>
              <p className="text-xs text-muted leading-relaxed">
                Monitor your habits over 30 days. Visualize which pillars thrive and which require immediate attention with clean responsive charts.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-xl hover:bg-hover/20 border border-transparent hover:border-border transition-all">
              <div className="p-2 w-10 h-10 rounded-lg bg-accent/10 border border-accent/25 text-accent flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold">Frictionless Security</h3>
              <p className="text-xs text-muted leading-relaxed">
                No passwords to remember. Access your personal logs safely using passwordless email verification or quick Google authorization.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="bg-hover/20 border-t border-b border-border/40 py-20 select-none">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight">Ready to Audit Your Life?</h2>
            <p className="text-sm text-muted max-w-md mx-auto">
              Start configuring your custom templates and taking control of your daily performance index today.
            </p>
            <div className="flex justify-center">
              {user ? (
                <Link
                  href="/dashboard"
                  className="h-11 px-8 bg-accent text-accent-foreground text-sm font-semibold rounded-lg hover:opacity-95 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight size={16} />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="h-11 px-8 bg-accent text-accent-foreground text-sm font-semibold rounded-lg hover:opacity-95 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Get Started for Free</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card py-8 select-none text-xs text-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-accent" />
            <span className="font-semibold text-foreground">The Four Pillar System</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <a href="#philosophy" className="hover:text-foreground">Philosophy</a>
            <a href="#pillars" className="hover:text-foreground">Pillars</a>
            <a href="#simulator" className="hover:text-foreground">Simulator</a>
            <a href="#features" className="hover:text-foreground">Features</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
