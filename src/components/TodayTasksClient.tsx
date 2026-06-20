'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store/useStore';
import { updateLogStatus, updateLogNotes } from '@/actions/logActions';
import {
  Brain,
  Compass,
  Heart,
  Dumbbell,
  CheckCircle,
  AlertCircle,
  Circle,
  Smile,
  FileText,
  Save,
  Loader2,
} from 'lucide-react';

interface Habit {
  _id: string;
  name: string;
  pillar: 'Mental' | 'Spiritual' | 'Emotional' | 'Physical';
}

interface Log {
  _id: string;
  habitId: Habit;
  status: 'Pending' | 'Partial' | 'Completed' | 'Missed';
  notes: string;
  completionPercentage: number;
}

export default function TodayTasksClient({ initialLogs }: { initialLogs: Log[] }) {
  const [logs, setLogs] = useState<Log[]>(initialLogs);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [savingNotesId, setSavingNotesId] = useState<string | null>(null);
  const [notesState, setNotesState] = useState<Record<string, string>>({});
  
  const searchQuery = useStore((state) => state.searchQuery);

  // Initialize notesState from logs
  useEffect(() => {
    const notesMap: Record<string, string> = {};
    logs.forEach((log) => {
      notesMap[log._id] = log.notes || '';
    });
    setNotesState(notesMap);
  }, [logs]);

  // Handle status toggle
  const handleStatusChange = async (logId: string, newStatus: 'Pending' | 'Partial' | 'Completed' | 'Missed') => {
    setUpdatingId(logId);
    try {
      const updatedLog = await updateLogStatus(logId, newStatus);
      // Only merge scalar fields — do NOT spread updatedLog directly because
      // the server returns habitId as a raw ObjectId (unpopulated), which would
      // overwrite the rich habit object and cause the task to disappear.
      setLogs((prev) =>
        prev.map((l) =>
          l._id === logId
            ? { ...l, status: updatedLog.status, completionPercentage: updatedLog.completionPercentage }
            : l
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Handle notes update (instant manual save / quick save visual feedback)
  const handleNotesSave = async (logId: string) => {
    const notesText = notesState[logId] || '';
    setSavingNotesId(logId);
    try {
      const updatedLog = await updateLogNotes(logId, notesText);
      // Same as above — only update the notes field to preserve populated habitId.
      setLogs((prev) =>
        prev.map((l) =>
          l._id === logId ? { ...l, notes: updatedLog.notes } : l
        )
      );
    } catch (error) {
      console.error('Error saving notes:', error);
    } finally {
      setSavingNotesId(null);
    }
  };

  // Group logs by Pillar
  const pillars: ('Mental' | 'Spiritual' | 'Emotional' | 'Physical')[] = [
    'Mental',
    'Spiritual',
    'Emotional',
    'Physical',
  ];

  // Filter logs based on search query
  const filteredLogs = logs.filter((log) => {
    const habitName = log.habitId?.name || '';
    const noteText = log.notes || '';
    return (
      habitName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      noteText.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Calculate today's completion rates
  const totalCount = logs.length;
  const completedScore = logs.reduce((acc, log) => acc + log.completionPercentage, 0);
  const overallProgress = totalCount > 0 ? Math.round(completedScore / totalCount) : 0;

  const getPillarIcon = (pillar: string) => {
    switch (pillar) {
      case 'Mental':
        return <Brain size={16} className="text-mental" />;
      case 'Spiritual':
        return <Compass size={16} className="text-spiritual" />;
      case 'Emotional':
        return <Heart size={16} className="text-emotional" />;
      case 'Physical':
        return <Dumbbell size={16} className="text-physical" />;
      default:
        return null;
    }
  };

  const getPillarColorBorder = (pillar: string) => {
    switch (pillar) {
      case 'Mental':
        return 'border-l-4 border-l-mental';
      case 'Spiritual':
        return 'border-l-4 border-l-spiritual';
      case 'Emotional':
        return 'border-l-4 border-l-emotional';
      case 'Physical':
        return 'border-l-4 border-l-physical';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header and Progress Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Today's Tasks</h1>
          <p className="text-muted text-sm">Review and log your performance across the four pillars of life.</p>
        </div>

        {/* Progress Card */}
        <div className="bg-card border border-border rounded-lg px-4 py-3 flex items-center gap-4 shadow-xs min-w-[200px]">
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-muted">Today's Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="w-full bg-hover h-1.5 rounded-full overflow-hidden border border-border">
              <div
                className="bg-accent h-full transition-all duration-300"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="bg-card border border-border rounded-lg p-10 text-center space-y-3">
          <AlertCircle className="mx-auto text-muted" size={32} />
          <h3 className="font-semibold text-foreground text-lg">No habits active for today</h3>
          <p className="text-muted text-sm max-w-sm mx-auto">
            Go to the <span className="font-semibold">Master Habits</span> page to activate or create permanent habits for your pillars.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pillars.map((pillar) => {
            const pillarLogs = filteredLogs.filter((log) => log.habitId?.pillar === pillar);
            if (pillarLogs.length === 0) return null;

            return (
              <div key={pillar} className="space-y-3">
                {/* Pillar Section Title */}
                <h2 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
                  {getPillarIcon(pillar)}
                  {pillar}
                </h2>

                {/* Habits in this Pillar */}
                <div className="grid gap-3">
                  {pillarLogs.map((log) => (
                    <div
                      key={log._id}
                      className={`bg-card border border-border rounded-lg p-4 transition-all duration-200 ${getPillarColorBorder(
                        pillar
                      )} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs`}
                    >
                      {/* Left: Info & Notes */}
                      <div className="flex-1 min-w-0 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground truncate">{log.habitId?.name}</span>
                          {updatingId === log._id && <Loader2 className="animate-spin text-muted" size={14} />}
                        </div>

                        {/* Notes form */}
                        <div className="relative max-w-md">
                          <input
                            type="text"
                            value={notesState[log._id] ?? ''}
                            onChange={(e) =>
                              setNotesState((prev) => ({ ...prev, [log._id]: e.target.value }))
                            }
                            placeholder="Add reflection or notes..."
                            className="w-full text-xs bg-hover border border-border rounded pl-2 pr-8 py-1.5 focus:outline-none focus:border-accent text-foreground placeholder:text-muted"
                          />
                          <button
                            onClick={() => handleNotesSave(log._id)}
                            disabled={savingNotesId === log._id}
                            className="absolute right-2 top-1.5 text-muted hover:text-foreground transition-colors disabled:opacity-50"
                            title="Save Note"
                          >
                            {savingNotesId === log._id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Save size={12} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
                        {[
                          { status: 'Pending', label: 'Pending', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20' },
                          { status: 'Partial', label: 'Partial', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20' },
                          { status: 'Completed', label: 'Completed', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' },
                          { status: 'Missed', label: 'Missed', color: 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' },
                        ].map((btn) => {
                          const isSelected = log.status === btn.status;
                          return (
                            <button
                              key={btn.status}
                              onClick={() => handleStatusChange(log._id, btn.status as any)}
                              className={`px-3 py-1 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                                isSelected
                                  ? btn.color
                                  : 'bg-transparent text-muted border-border hover:bg-hover hover:text-foreground'
                              }`}
                            >
                              {btn.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
