'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import {
  TrendingUp,
  Award,
  Zap,
  Flame,
  AlertTriangle,
  Compass,
  Trophy,
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
  Cell,
} from 'recharts';

interface LeaderboardItem {
  id: string;
  name: string;
  pillar: 'Mental' | 'Spiritual' | 'Emotional' | 'Physical';
  active: boolean;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalLogs: number;
}

interface AnalyticsClientProps {
  analytics: {
    leaderboard: LeaderboardItem[];
    mostMissedHabit: string;
    mostMissedPillar: string;
    missedPillarCounts: Record<string, number>;
    mostMissedHabits: Array<{ name: string; count: number }>;
    failureTrends: {
      past30Days: Array<{ date: string; failures: number; total: number }>;
    };
    trendData: Array<{
      date: string;
      completionRate: number;
      Mental: number;
      Spiritual: number;
      Emotional: number;
      Physical: number;
    }>;
  };
}

export default function AnalyticsClient({ analytics }: AnalyticsClientProps) {
  const searchQuery = useStore((state) => state.searchQuery);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Filter leaderboard based on global search query
  const filteredLeaderboard = analytics.leaderboard.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPillarColor = (pillar: string) => {
    switch (pillar) {
      case 'Mental': return 'var(--pillar-mental)';
      case 'Spiritual': return 'var(--pillar-spiritual)';
      case 'Emotional': return 'var(--pillar-emotional)';
      case 'Physical': return 'var(--pillar-physical)';
      default: return 'var(--muted)';
    }
  };

  const missedPillarData = [
    { name: 'Mental', count: analytics.missedPillarCounts.Mental || 0, fill: 'var(--pillar-mental)' },
    { name: 'Spiritual', count: analytics.missedPillarCounts.Spiritual || 0, fill: 'var(--pillar-spiritual)' },
    { name: 'Emotional', count: analytics.missedPillarCounts.Emotional || 0, fill: 'var(--pillar-emotional)' },
    { name: 'Physical', count: analytics.missedPillarCounts.Physical || 0, fill: 'var(--pillar-physical)' },
  ];

  if (!mounted) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted text-sm">Deep-dive insights into streaks, leaderboards, and failures.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          <div className="bg-card border border-border rounded-lg h-28" />
          <div className="bg-card border border-border rounded-lg h-28" />
          <div className="bg-card border border-border rounded-lg h-28" />
          <div className="bg-card border border-border rounded-lg h-28" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="bg-card border border-border rounded-lg h-80 lg:col-span-2" />
          <div className="bg-card border border-border rounded-lg h-80" />
        </div>
        <div className="bg-card border border-border rounded-lg h-80 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted text-sm">Deep-dive insights into streaks, leaderboards, and failures.</p>
      </div>

      {/* Missed Analysis Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Most Missed Habit */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="text-red-500" size={14} />
              Most Missed Habit
            </span>
            <div className="text-2xl font-extrabold truncate max-w-full text-red-500">
              {analytics.mostMissedHabit}
            </div>
            <p className="text-xs text-muted">Habit that failed the most times historically.</p>
          </div>
        </div>

        {/* Most Missed Pillar */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="text-red-500" size={14} />
              Most Missed Pillar
            </span>
            <div className="text-2xl font-extrabold text-red-500">
              {analytics.mostMissedPillar}
            </div>
            <p className="text-xs text-muted">Pillar with the highest count of failures.</p>
          </div>
        </div>

        {/* Total Active Habits */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Compass size={14} />
              Active Habits
            </span>
            <div className="text-3xl font-extrabold font-mono">
              {analytics.leaderboard.filter((h) => h.active).length}
            </div>
            <p className="text-xs text-muted">Habits templates currently active.</p>
          </div>
        </div>

        {/* Peak Streak */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="text-amber-500" size={14} />
              Top Habit Streak
            </span>
            <div className="text-3xl font-extrabold font-mono text-amber-500 flex items-center gap-1">
              {Math.max(...analytics.leaderboard.map((h) => h.longestStreak), 0)}
              <span className="text-xs text-muted">days</span>
            </div>
            <p className="text-xs text-muted">Longest consecutive streak on any single habit.</p>
          </div>
        </div>
      </div>

      {/* Grid: Leaderboard & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Leaderboard Table (2 spans) */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-xs lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-muted flex items-center gap-1.5">
            <Trophy size={16} />
            Habit Consistency Leaderboard
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-hover/50 border-b border-border">
                  <th className="px-3 py-2 font-semibold text-muted text-xs uppercase tracking-wider">Rank</th>
                  <th className="px-3 py-2 font-semibold text-muted text-xs uppercase tracking-wider">Habit</th>
                  <th className="px-3 py-2 font-semibold text-muted text-xs uppercase tracking-wider">Pillar</th>
                  <th className="px-3 py-2 font-semibold text-muted text-xs uppercase tracking-wider">Rate %</th>
                  <th className="px-3 py-2 font-semibold text-muted text-xs uppercase tracking-wider">Current Streak</th>
                  <th className="px-3 py-2 font-semibold text-muted text-xs uppercase tracking-wider">Longest Streak</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLeaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-8 text-center text-muted font-mono text-xs">
                      No habits analyzed yet.
                    </td>
                  </tr>
                ) : (
                  filteredLeaderboard.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-hover/30 transition-colors">
                      <td className="px-3 py-3 font-mono text-xs text-muted">#{idx + 1}</td>
                      <td className="px-3 py-3 font-medium text-foreground truncate max-w-[150px]">{item.name}</td>
                      <td className="px-3 py-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block mr-1.5"
                          style={{ backgroundColor: getPillarColor(item.pillar) }}
                        />
                        <span className="text-xs font-medium">{item.pillar}</span>
                      </td>
                      <td className="px-3 py-3 font-mono font-bold text-xs">{item.completionRate}%</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1 font-mono text-xs text-amber-500 font-bold">
                          <Flame size={14} className="fill-amber-500/10" />
                          {item.currentStreak}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1 font-mono text-xs text-emerald-500 font-bold">
                          <Trophy size={14} />
                          {item.longestStreak}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Missed Pillars Breakdown Bar Chart */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold text-muted flex items-center gap-1.5">
            <AlertTriangle size={16} />
            Missed Count by Pillar
          </h2>
          <div className="h-64 w-full" style={{ minHeight: 256 }}>
            <ResponsiveContainer width="100%" height="100%" debounce={100}>
              <BarChart data={missedPillarData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} />
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
                <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Missed Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Failure Trend Chart */}
      <div className="bg-card border border-border rounded-lg p-5 shadow-xs">
        <h2 className="text-sm font-semibold text-muted mb-4">Habit Failure Trends (Past 30 Days missed logs count)</h2>
        <div className="h-64 w-full" style={{ minHeight: 256 }}>
          <ResponsiveContainer width="100%" height="100%" debounce={100}>
            <AreaChart
              data={analytics.failureTrends.past30Days}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorFailures" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--muted)" fontSize={11} tickLine={false} />
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
                dataKey="failures"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorFailures)"
                name="Missed Habits"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
