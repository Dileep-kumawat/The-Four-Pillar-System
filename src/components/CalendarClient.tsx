'use client';

import React, { useState, useMemo } from 'react';
import { getLogsForDate } from '@/actions/logActions';
import {
  X,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  FileText,
  CalendarDays,
  Loader2,
} from 'lucide-react';

interface Snapshot {
  date: string;
  completionRate: number;
  completedCount: number;
  missedCount: number;
  pillarScores: {
    Mental: number;
    Spiritual: number;
    Emotional: number;
    Physical: number;
  };
}

interface Log {
  _id: string;
  status: 'Pending' | 'Partial' | 'Completed' | 'Missed';
  notes: string;
  completionPercentage: number;
  habitId: {
    name: string;
    pillar: string;
  };
}

export default function CalendarClient({ snapshots }: { snapshots: Snapshot[] }) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedLogs, setSelectedLogs] = useState<Log[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Map snapshots by date for O(1) grid lookup
  const snapshotMap = useMemo(() => {
    const map = new Map<string, Snapshot>();
    snapshots.forEach((s) => map.set(s.date, s));
    return map;
  }, [snapshots]);

  // Generate 53 weeks of dates ending today
  const gridDates = useMemo(() => {
    const dates: Date[] = [];
    const today = new Date();
    
    // Find the date 364 days ago
    const startDate = new Date();
    startDate.setDate(today.getDate() - 364);

    // Adjust start date to the nearest preceding Sunday
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay);

    // Generate days up to today (or end of current week)
    const current = new Date(startDate);
    
    // Run for 53 full weeks (53 * 7 = 371 days)
    for (let i = 0; i < 371; i++) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  }, []);

  // Map dates into columns of 7 days (weeks) for rendering
  const weeks = useMemo(() => {
    const w: Date[][] = [];
    for (let i = 0; i < gridDates.length; i += 7) {
      w.push(gridDates.slice(i, i + 7));
    }
    return w;
  }, [gridDates]);

  // Handle cell click
  const handleCellClick = async (dateStr: string) => {
    setSelectedDate(dateStr);
    setLoadingLogs(true);
    try {
      const logs = await getLogsForDate(dateStr);
      setSelectedLogs(logs);
    } catch (error) {
      console.error('Error fetching logs for date:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

  // Color selection based on rate
  const getCellColor = (rate: number | undefined) => {
    if (rate === undefined) return 'bg-hover border border-border/40';
    if (rate === 0) return 'bg-card border border-border hover:bg-hover';
    if (rate <= 25) return 'bg-accent/20 hover:bg-accent/30 border border-accent/10';
    if (rate <= 50) return 'bg-accent/40 hover:bg-accent/50 border border-accent/20';
    if (rate <= 75) return 'bg-accent/70 hover:bg-accent/80 border border-accent/30';
    return 'bg-accent text-accent-foreground hover:opacity-90 border border-accent/40';
  };

  // Find info of selected date snapshot
  const selectedSnapshot = selectedDate ? snapshotMap.get(selectedDate) : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted text-sm">Visualize your daily consistency over the past year.</p>
      </div>

      {/* GitHub-style Contribution Grid Wrapper */}
      <div className="bg-card border border-border rounded-lg p-5 shadow-xs overflow-x-auto select-none">
        <div className="min-w-[760px] space-y-4">
          <div className="flex gap-2">
            {/* Weekday labels */}
            <div className="grid grid-rows-7 gap-[3px] text-[10px] text-muted font-semibold pr-2 pt-5 select-none leading-[11px]">
              <div>Sun</div>
              <div></div>
              <div>Tue</div>
              <div></div>
              <div>Thu</div>
              <div></div>
              <div>Sat</div>
            </div>

            {/* Grid Cells grouped by week */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIdx) => {
                // Render month label at top if it is the first week of the month
                const firstDay = week[0];
                const showMonthLabel = firstDay.getDate() <= 7;
                const monthLabel = firstDay.toLocaleDateString('en-US', { month: 'short' });

                return (
                  <div key={weekIdx} className="flex flex-col gap-[3px] relative pt-5">
                    {showMonthLabel && (
                      <span className="absolute top-0 left-0 text-[10px] text-muted font-semibold select-none">
                        {monthLabel}
                      </span>
                    )}
                    {week.map((day) => {
                      const dateStr = day.toISOString().split('T')[0];
                      const snap = snapshotMap.get(dateStr);
                      const rate = snap?.completionRate;

                      return (
                        <button
                          key={dateStr}
                          onClick={() => handleCellClick(dateStr)}
                          className={`w-[11px] h-[11px] rounded-[2px] transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent ${getCellColor(
                            rate
                          )}`}
                          title={`${day.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}: ${rate !== undefined ? `${rate}% completed` : 'No habits tracked'}`}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-2 text-xs text-muted font-mono pr-2">
            <span>Less</span>
            <div className="w-[11px] h-[11px] rounded-[2px] bg-card border border-border" />
            <div className="w-[11px] h-[11px] rounded-[2px] bg-accent/20 border border-accent/10" />
            <div className="w-[11px] h-[11px] rounded-[2px] bg-accent/40 border border-accent/20" />
            <div className="w-[11px] h-[11px] rounded-[2px] bg-accent/70 border border-accent/30" />
            <div className="w-[11px] h-[11px] rounded-[2px] bg-accent border border-accent/40" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Daily Detail Modal */}
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedDate(null)}
          />

          {/* Modal Content */}
          <div className="bg-popover border border-border rounded-lg max-w-lg w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 text-foreground flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="font-semibold flex items-center gap-2">
                <CalendarDays size={18} className="text-accent" />
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-1 hover:bg-hover rounded text-muted hover:text-foreground transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Stats snapshot */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-hover/40 border border-border p-2.5 rounded-lg">
                  <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Score</div>
                  <div className="text-xl font-bold font-mono mt-1 text-accent">
                    {selectedSnapshot ? `${selectedSnapshot.completionRate}%` : '0%'}
                  </div>
                </div>
                <div className="bg-hover/40 border border-border p-2.5 rounded-lg">
                  <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Completed</div>
                  <div className="text-xl font-bold font-mono mt-1 text-emerald-500">
                    {selectedSnapshot ? selectedSnapshot.completedCount : 0}
                  </div>
                </div>
                <div className="bg-hover/40 border border-border p-2.5 rounded-lg">
                  <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Missed</div>
                  <div className="text-xl font-bold font-mono mt-1 text-red-500">
                    {selectedSnapshot ? selectedSnapshot.missedCount : 0}
                  </div>
                </div>
              </div>

              {/* Loader */}
              {loadingLogs ? (
                <div className="py-10 flex flex-col items-center justify-center gap-2 text-muted text-sm font-mono">
                  <Loader2 className="animate-spin text-accent" size={24} />
                  Loading daily logs...
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Habits list */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Habit Overview</h3>
                    {selectedLogs.length === 0 ? (
                      <p className="text-xs text-muted font-mono bg-hover/20 p-3 border border-border rounded-lg text-center">
                        No habits logged on this date.
                      </p>
                    ) : (
                      <div className="divide-y divide-border border border-border rounded-lg overflow-hidden bg-card">
                        {selectedLogs.map((log) => {
                          const isCompleted = log.status === 'Completed';
                          const isPartial = log.status === 'Partial';
                          const isMissed = log.status === 'Missed';

                          return (
                            <div key={log._id} className="p-3 flex items-center justify-between gap-4">
                              <div className="space-y-0.5 min-w-0">
                                <span className="font-semibold text-xs text-foreground block truncate">
                                  {log.habitId?.name}
                                </span>
                                <span className="text-[10px] text-muted font-mono uppercase">
                                  {log.habitId?.pillar}
                                </span>
                              </div>

                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  isCompleted
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                    : isPartial
                                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                    : isMissed
                                    ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                    : 'bg-hover text-muted border-border'
                                }`}
                              >
                                {log.status}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Notes reflections summaries */}
                  {selectedLogs.some((l) => l.notes) && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-muted uppercase tracking-wider">Reflections & Notes</h3>
                      <div className="space-y-2">
                        {selectedLogs
                          .filter((l) => l.notes)
                          .map((log) => (
                            <div key={log._id} className="bg-hover/40 border border-border p-3 rounded-lg text-xs leading-relaxed">
                              <span className="font-bold text-[10px] text-muted block mb-1">
                                {log.habitId?.name.toUpperCase()}
                              </span>
                              <p className="text-foreground">{log.notes}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
