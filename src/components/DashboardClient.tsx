'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import {
  TrendingUp,
  Award,
  Zap,
  Activity,
  Brain,
  Compass,
  Heart,
  Dumbbell,
  CheckCircle2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface DashboardClientProps {
  stats: {
    lifeScore: number;
    lifeScoreCategory: 'Elite' | 'Strong' | 'Improving' | 'Needs Attention';
    currentStreak: number;
    longestStreak: number;
    todayProgress: number;
    weeklyProgress: number;
    monthlyProgress: number;
    quarterlyProgress: number;
    yearlyProgress: number;
    pillarScores: {
      Mental: number;
      Spiritual: number;
      Emotional: number;
      Physical: number;
    };
  };
  trendData: Array<{
    date: string;
    completionRate: number;
    Mental: number;
    Spiritual: number;
    Emotional: number;
    Physical: number;
  }>;
}

export default function DashboardClient({ stats, trendData }: DashboardClientProps) {
  const searchQuery = useStore((state) => state.searchQuery);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Helper for Circular Progress Ring
  const ProgressRing = ({ percentage, size = 120, strokeWidth = 10, colorClass = 'text-accent' }: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    colorClass?: string;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            className="text-border"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Active progress circle */}
          <circle
            className={`${colorClass} transition-all duration-500 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-mono">{percentage}%</span>
        </div>
      </div>
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Elite':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Strong':
        return 'text-accent bg-accent/10 border-accent/20';
      case 'Improving':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Needs Attention':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-muted bg-hover border-border';
    }
  };

  const pillarCards = [
    {
      name: 'Mental',
      score: stats.pillarScores.Mental,
      icon: Brain,
      color: 'text-mental',
      bgLight: 'bg-mental/10',
      border: 'border-mental/25',
      desc: 'Focus, reading, learning, mindfulness',
    },
    {
      name: 'Spiritual',
      score: stats.pillarScores.Spiritual,
      icon: Compass,
      color: 'text-spiritual',
      bgLight: 'bg-spiritual/10',
      border: 'border-spiritual/25',
      desc: 'Meditation, nature, alignment, values',
    },
    {
      name: 'Emotional',
      score: stats.pillarScores.Emotional,
      icon: Heart,
      color: 'text-emotional',
      bgLight: 'bg-emotional/10',
      border: 'border-emotional/25',
      desc: 'Relationships, journaling, expression',
    },
    {
      name: 'Physical',
      score: stats.pillarScores.Physical,
      icon: Dumbbell,
      color: 'text-physical',
      bgLight: 'bg-physical/10',
      border: 'border-physical/25',
      desc: 'Workout, diet, sleep, mobility',
    },
  ];

  if (!mounted) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted text-sm">Welcome back to your personal life operating system.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
          <div className="bg-card border border-border rounded-lg h-32" />
          <div className="bg-card border border-border rounded-lg h-32" />
          <div className="bg-card border border-border rounded-lg h-32" />
        </div>
        <div className="bg-card border border-border rounded-lg h-40 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          <div className="bg-card border border-border rounded-lg h-32" />
          <div className="bg-card border border-border rounded-lg h-32" />
          <div className="bg-card border border-border rounded-lg h-32" />
          <div className="bg-card border border-border rounded-lg h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-pulse">
          <div className="bg-card border border-border rounded-lg h-80 lg:col-span-2" />
          <div className="bg-card border border-border rounded-lg h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted text-sm">Welcome back to your personal life operating system.</p>
      </div>

      {/* Grid: Life Score & Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Life Score widget */}
        <div className="bg-card border border-border rounded-lg p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-muted flex items-center gap-1.5">
              <Activity size={16} />
              Overall Life Score
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-mono">{stats.lifeScore}</span>
              <span className="text-xs text-muted">/ 100</span>
            </div>
            <span
              className={`inline-block text-xs px-2 py-0.5 rounded font-semibold border ${getCategoryColor(
                stats.lifeScoreCategory
              )}`}
            >
              {stats.lifeScoreCategory}
            </span>
          </div>
          <ProgressRing percentage={stats.lifeScore} size={90} strokeWidth={8} />
        </div>

        {/* Current Streak */}
        <div className="bg-card border border-border rounded-lg p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-muted flex items-center gap-1.5">
              <Zap size={16} className="text-amber-500 fill-amber-500/10" />
              Current Streak
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-mono text-amber-500">{stats.currentStreak}</span>
              <span className="text-xs text-muted">days</span>
            </div>
            <p className="text-xs text-muted">Keep completing at least 50% of daily habits.</p>
          </div>
          <div className="bg-amber-500/10 p-4 rounded-full text-amber-500 border border-amber-500/20">
            <Zap size={32} className="fill-amber-500/20" />
          </div>
        </div>

        {/* Longest Streak */}
        <div className="bg-card border border-border rounded-lg p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-muted flex items-center gap-1.5">
              <Award size={16} className="text-emerald-500" />
              Longest Streak
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold font-mono text-emerald-500">{stats.longestStreak}</span>
              <span className="text-xs text-muted">days</span>
            </div>
            <p className="text-xs text-muted">Your historic milestone performance.</p>
          </div>
          <div className="bg-emerald-500/10 p-4 rounded-full text-emerald-500 border border-emerald-500/20">
            <Award size={32} />
          </div>
        </div>
      </div>

      {/* Grid: Periodic Progress Bars */}
      <div className="bg-card border border-border rounded-lg p-5 shadow-xs">
        <h2 className="text-sm font-semibold text-muted mb-4 flex items-center gap-1.5">
          <TrendingUp size={16} />
          Periodic Progress Analysis
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
          {[
            { label: 'Today', val: stats.todayProgress, color: 'bg-accent' },
            { label: 'Weekly', val: stats.weeklyProgress, color: 'bg-accent' },
            { label: 'Monthly', val: stats.monthlyProgress, color: 'bg-accent' },
            { label: 'Quarterly', val: stats.quarterlyProgress, color: 'bg-accent' },
            { label: 'Yearly', val: stats.yearlyProgress, color: 'bg-accent' },
          ].map((period) => (
            <div key={period.label} className="flex flex-col items-center text-center space-y-2">
              <span className="text-xs font-semibold text-muted">{period.label}</span>
              <ProgressRing percentage={period.val} size={80} strokeWidth={6} />
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Four Pillars Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pillarCards.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.name} className="bg-card border border-border rounded-lg p-5 shadow-xs flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className={`${p.bgLight} ${p.color} p-1.5 rounded border ${p.border}`}>
                      <Icon size={16} />
                    </div>
                    {p.name}
                  </span>
                  <span className="text-sm font-bold font-mono">{p.score}%</span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed h-8">
                  {p.desc}
                </p>
              </div>
              <div className="w-full bg-hover h-2 rounded mt-4 overflow-hidden border border-border">
                <div
                  className={`h-full transition-all duration-500 ease-out`}
                  style={{
                    width: `${p.score}%`,
                    backgroundColor: `var(--pillar-${p.name.toLowerCase()})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Completion rate trend line */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-xs lg:col-span-2">
          <h2 className="text-sm font-semibold text-muted mb-4">Overall Completion Trend (Past 30 Days)</h2>
          <div className="h-64 w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--muted)" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="var(--muted)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--popover)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                      fontSize: 12,
                      borderRadius: 4,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completionRate"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRate)"
                    name="Completion"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted text-xs font-mono">
                No logs recorded yet. Complete habits to populate charts.
              </div>
            )}
          </div>
        </div>

        {/* Pillars breakdown bar chart */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-xs">
          <h2 className="text-sm font-semibold text-muted mb-4">Pillar Averages Breakdown</h2>
          <div className="h-64 w-full">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Mental', score: stats.pillarScores.Mental, fill: 'var(--pillar-mental)' },
                    { name: 'Spiritual', score: stats.pillarScores.Spiritual, fill: 'var(--pillar-spiritual)' },
                    { name: 'Emotional', score: stats.pillarScores.Emotional, fill: 'var(--pillar-emotional)' },
                    { name: 'Physical', score: stats.pillarScores.Physical, fill: 'var(--pillar-physical)' },
                  ]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="var(--muted)" fontSize={11} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      backgroundColor: 'var(--popover)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                      fontSize: 12,
                      borderRadius: 4,
                    }}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]} name="Score %" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted text-xs font-mono">
                No logs recorded yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
