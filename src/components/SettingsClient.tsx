'use client';

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useStore } from '@/store/useStore';
import { updateProfile, deleteAccount } from '@/actions/userActions';
import { getAllHistoryLogsForExport } from '@/actions/historyActions';
import {
  User,
  Settings,
  ShieldAlert,
  Loader2,
  Save,
  Trash2,
  Download,
  AlertOctagon,
  X,
  Sun,
  Moon,
} from 'lucide-react';

export default function SettingsClient() {
  const { data: session, update: updateSession } = useSession();
  
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);

  // Form states
  const [name, setName] = useState(session?.user?.name || '');
  const [timezone, setTimezone] = useState((session?.user as any)?.timezone || 'UTC');
  
  const [updating, setUpdating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Timezones list
  const timezones = [
    { value: 'UTC', label: 'UTC (GMT+0)' },
    { value: 'America/New_York', label: 'US Eastern Time (EST/EDT)' },
    { value: 'America/Chicago', label: 'US Central Time (CST/CDT)' },
    { value: 'America/Denver', label: 'US Mountain Time (MST/MDT)' },
    { value: 'America/Los_Angeles', label: 'US Pacific Time (PST/PDT)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'Asia/Kolkata', label: 'Kolkata (IST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  ];

  // Handle profile save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setUpdating(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await updateProfile(name, timezone);
      if (response.success) {
        // Update client-side next-auth session
        await updateSession({
          name: response.user.name,
          timezone: response.user.timezone,
        });
        setSuccessMsg('Profile settings updated successfully.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  // CSV Data compiler and downloader
  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const allLogs = await getAllHistoryLogsForExport();
      const headers = ['Date', 'Habit Name', 'Pillar', 'Status', 'Score %', 'Notes'];
      const csvRows = allLogs.map((log: any) => [
        log.date,
        `"${(log.habitId?.name || 'Deleted Habit').replace(/"/g, '""')}"`,
        log.habitId?.pillar || 'Unknown',
        log.status,
        log.completionPercentage,
        `"${(log.notes || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent = [headers.join(','), ...csvRows.map((e: any) => e.join(','))].join('\n');
      const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `FourPillar_DataExport_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting logs:', error);
    } finally {
      setExporting(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleting(true);
    try {
      const res = await deleteAccount();
      if (res.success) {
        signOut({ callbackUrl: '/login' });
      }
    } catch (err) {
      console.error('Failed to delete account:', err);
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-10">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted text-sm">Configure your personal preferences, theme, and data integrations.</p>
      </div>

      {/* Main Settings Panel */}
      <div className="bg-card border border-border rounded-lg shadow-xs overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border bg-hover/40">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <User size={16} className="text-accent" />
            Profile Preferences
          </h2>
        </div>

        {/* Profile Settings Form */}
        <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs px-3 py-2 rounded">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-3 py-2 rounded">
              {errorMsg}
            </div>
          )}

          {/* Email (Read-only) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted uppercase tracking-wider block">Email Address</label>
            <input
              type="email"
              value={session?.user?.email || ''}
              className="w-full h-9 px-3 text-sm bg-hover/40 border border-border rounded text-muted cursor-not-allowed outline-none"
              disabled
            />
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted uppercase tracking-wider block">Display Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 text-sm bg-hover border border-border rounded focus:outline-none focus:border-accent text-foreground"
              required
            />
          </div>

          {/* Timezone */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-muted uppercase tracking-wider block">Timezone Configuration</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full h-9 px-3 text-sm bg-hover border border-border rounded focus:outline-none focus:border-accent text-foreground cursor-pointer"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-muted leading-relaxed">
              * Used to generate daily pending task logs at exactly 12:01 AM in your local timezone.
            </p>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="h-9 px-4 bg-accent text-accent-foreground text-sm font-semibold rounded hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1.5 cursor-pointer"
          >
            {updating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Save size={16} />
                Save Preferences
              </>
            )}
          </button>
        </form>
      </div>

      {/* Theme Settings Panel */}
      <div className="bg-card border border-border rounded-lg shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-hover/40">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Settings size={16} className="text-accent" />
            Theme Selection
          </h2>
        </div>
        <div className="p-5 flex gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 p-4 border rounded-lg flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-active border-accent text-foreground font-semibold'
                : 'bg-card border-border text-muted hover:bg-hover'
            }`}
          >
            <Sun size={20} className={theme === 'light' ? 'text-amber-500' : 'text-muted'} />
            <span className="text-xs">Light Mode</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 p-4 border rounded-lg flex flex-col items-center gap-2 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-active border-accent text-foreground font-semibold'
                : 'bg-card border-border text-muted hover:bg-hover'
            }`}
          >
            <Moon size={20} className={theme === 'dark' ? 'text-accent' : 'text-muted'} />
            <span className="text-xs">Dark Mode</span>
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card border border-red-500/30 rounded-lg shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-red-500/20 bg-red-500/5">
          <h2 className="text-sm font-semibold text-red-500 flex items-center gap-2">
            <ShieldAlert size={16} />
            Danger Zone
          </h2>
        </div>

        <div className="p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Export All Data</h3>
              <p className="text-xs text-muted max-w-md">
                Download a full backup of all your historical habits, logs, and stats in CSV format.
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="h-9 px-4 border border-border bg-hover hover:bg-border transition-colors text-xs font-semibold rounded flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Download size={16} />
                  Download Backup
                </>
              )}
            </button>
          </div>

          <div className="border-t border-border pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-red-500">Delete Account</h3>
              <p className="text-xs text-muted max-w-md font-medium">
                Permanently delete your profile, active habits, daily logs, and snapshots. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="h-9 px-4 bg-red-500 text-white text-xs font-semibold rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Dialog */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowDeleteModal(false)} />
          <div className="bg-popover border border-border rounded-lg max-w-md w-full overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-200 text-foreground">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <span className="font-semibold text-red-500 flex items-center gap-2">
                <AlertOctagon size={18} />
                Confirm Account Deletion
              </span>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 hover:bg-hover rounded text-muted hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-xs text-muted leading-relaxed">
                This action is irreversible and will erase all data associated with your account.
              </p>
              
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded text-red-500 text-[11px] font-medium leading-normal">
                To confirm, please type <span className="font-bold underline">DELETE</span> in the input below.
              </div>

              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm..."
                className="w-full h-9 px-3 text-sm bg-hover border border-border rounded focus:outline-none focus:border-red-500 text-foreground"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="h-9 px-4 border border-border rounded text-xs font-semibold hover:bg-hover transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE' || deleting}
                  className="h-9 px-4 bg-red-500 text-white text-xs font-semibold rounded hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {deleting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Confirm Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
