'use client';

import React, { useState } from 'react';
import { useStore } from '@/store/useStore';
import { createHabit, renameHabit, toggleHabitStatus } from '@/actions/habitActions';
import {
  Plus,
  Loader2,
  AlertCircle,
  Archive,
  RefreshCw,
  Edit2,
  Check,
} from 'lucide-react';

interface Habit {
  _id: string;
  name: string;
  pillar: 'Mental' | 'Spiritual' | 'Emotional' | 'Physical';
  active: boolean;
  createdAt: string;
}

export default function MasterHabitsClient({ initialHabits }: { initialHabits: Habit[] }) {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitPillar, setNewHabitPillar] = useState<'Mental' | 'Spiritual' | 'Emotional' | 'Physical'>('Mental');
  
  const [addingHabit, setAddingHabit] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const searchQuery = useStore((state) => state.searchQuery);

  // Filter habits by global search query
  const filteredHabits = habits.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle create habit
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    setAddingHabit(true);

    try {
      const addedHabit = await createHabit(newHabitName, newHabitPillar);
      setHabits((prev) => [addedHabit, ...prev]);
      setNewHabitName('');
    } catch (err) {
      console.error('Failed to create habit:', err);
    } finally {
      setAddingHabit(false);
    }
  };

  // Handle archive / reactivate
  const handleToggleStatus = async (habitId: string, currentStatus: boolean) => {
    setUpdatingId(habitId);
    try {
      const updated = await toggleHabitStatus(habitId, !currentStatus);
      setHabits((prev) => prev.map((h) => (h._id === habitId ? { ...h, active: updated.active } : h)));
    } catch (err) {
      console.error('Failed to toggle status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Start inline rename
  const startEdit = (habitId: string, currentName: string) => {
    setEditingId(habitId);
    setEditingName(currentName);
  };

  // Submit inline rename
  const submitRename = async (habitId: string) => {
    if (!editingName.trim()) return;
    setUpdatingId(habitId);
    try {
      const updated = await renameHabit(habitId, editingName);
      setHabits((prev) => prev.map((h) => (h._id === habitId ? { ...h, name: updated.name } : h)));
      setEditingId(null);
    } catch (err) {
      console.error('Failed to rename:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getPillarColorClass = (pillar: string) => {
    switch (pillar) {
      case 'Mental':
        return 'pillar-tag-mental';
      case 'Spiritual':
        return 'pillar-tag-spiritual';
      case 'Emotional':
        return 'pillar-tag-emotional';
      case 'Physical':
        return 'pillar-tag-physical';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Master Habits</h1>
        <p className="text-muted text-sm">Configure your permanent master habits templates.</p>
      </div>

      {/* Add Habit Inline Form (Notion Bar style) */}
      <form onSubmit={handleCreate} className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-3 shadow-xs items-end">
        <div className="flex-1 w-full space-y-1">
          <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Habit Name</label>
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="e.g. Read 15 pages, Morning Meditation, Run 3k..."
            className="w-full h-9 px-3 text-sm bg-hover border border-border rounded focus:outline-none focus:border-accent text-foreground"
            required
          />
        </div>

        <div className="w-full sm:w-48 space-y-1">
          <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Pillar</label>
          <select
            value={newHabitPillar}
            onChange={(e) => setNewHabitPillar(e.target.value as any)}
            className="w-full h-9 px-3 text-sm bg-hover border border-border rounded focus:outline-none focus:border-accent text-foreground cursor-pointer"
          >
            <option value="Mental">🧠 Mental</option>
            <option value="Spiritual">🧿 Spiritual</option>
            <option value="Emotional">❤️ Emotional</option>
            <option value="Physical">💪 Physical</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={addingHabit || !newHabitName.trim()}
          className="w-full sm:w-auto h-9 px-4 bg-accent text-accent-foreground text-sm font-semibold rounded hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
        >
          {addingHabit ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Plus size={16} />
              Add Habit
            </>
          )}
        </button>
      </form>

      {/* Notion Database Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-hover border-b border-border">
                <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">Name (Double-click to rename)</th>
                <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">Pillar</th>
                <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">Created Date</th>
                <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredHabits.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted font-mono text-xs">
                    No habits found. Use the form above to add a habit template.
                  </td>
                </tr>
              ) : (
                filteredHabits.map((habit) => (
                  <tr key={habit._id} className="hover:bg-hover/50 transition-colors">
                    {/* Habit Name Column (Inline edit) */}
                    <td className="px-4 py-3 font-medium">
                      {editingId === habit._id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') submitRename(habit._id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            className="h-8 px-2 bg-hover border border-accent rounded focus:outline-none text-sm text-foreground w-full max-w-xs"
                            autoFocus
                          />
                          <button
                            onClick={() => submitRename(habit._id)}
                            className="p-1 text-emerald-500 hover:bg-hover rounded"
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      ) : (
                        <div
                          className="flex items-center gap-2 group cursor-pointer"
                          onDoubleClick={() => startEdit(habit._id, habit.name)}
                          title="Double click to rename"
                        >
                          <span className="text-foreground">{habit.name}</span>
                          <Edit2 size={12} className="opacity-0 group-hover:opacity-100 text-muted transition-opacity" />
                        </div>
                      )}
                    </td>

                    {/* Pillar Badge Column */}
                    <td className="px-4 py-3">
                      <span className={`pillar-tag ${getPillarColorClass(habit.pillar)}`}>
                        {habit.pillar === 'Mental' && '🧠 '}
                        {habit.pillar === 'Spiritual' && '🧿 '}
                        {habit.pillar === 'Emotional' && '❤️ '}
                        {habit.pillar === 'Physical' && '💪 '}
                        {habit.pillar}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${
                          habit.active
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}
                      >
                        {habit.active ? 'Active' : 'Archived'}
                      </span>
                    </td>

                    {/* Created Date Column */}
                    <td className="px-4 py-3 text-muted font-mono text-xs">
                      {new Date(habit.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Actions Column */}
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleToggleStatus(habit._id, habit.active)}
                        disabled={updatingId === habit._id}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border cursor-pointer transition-colors ${
                          habit.active
                            ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20'
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        {updatingId === habit._id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : habit.active ? (
                          <>
                            <Archive size={12} />
                            Archive
                          </>
                        ) : (
                          <>
                            <RefreshCw size={12} />
                            Reactivate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
