'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getHistoryLogs, getAllHistoryLogsForExport } from '@/actions/historyActions';
import { useStore } from '@/store/useStore';
import {
  Download,
  Calendar,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react';

interface HabitOption {
  _id: string;
  name: string;
}

interface Log {
  _id: string;
  date: string;
  status: 'Pending' | 'Partial' | 'Completed' | 'Missed';
  notes: string;
  completionPercentage: number;
  habitId: {
    _id: string;
    name: string;
    pillar: 'Mental' | 'Spiritual' | 'Emotional' | 'Physical';
  };
}

export default function HistoryClient({ habits }: { habits: HabitOption[] }) {
  // Local logs state
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [pillar, setPillar] = useState('All');
  const [status, setStatus] = useState('All');
  const [habitId, setHabitId] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('All');
  const [year, setYear] = useState('All');
  const [search, setSearch] = useState('');

  // Exporting state
  const [exporting, setExporting] = useState(false);

  const globalSearchQuery = useStore((state) => state.searchQuery);

  // Sync global search query to local filter search
  useEffect(() => {
    setSearch(globalSearchQuery);
    setCurrentPage(1);
  }, [globalSearchQuery]);

  // Fetch logs based on filters
  const fetchFilteredLogs = useCallback(async (pageToFetch: number) => {
    setLoading(true);
    try {
      const response = await getHistoryLogs({
        page: pageToFetch,
        limit: 15,
        pillar,
        status,
        habitId,
        search,
        startDate,
        endDate,
        month,
        year,
      });

      setLogs(response.logs);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error('Error fetching historical logs:', error);
    } finally {
      setLoading(false);
    }
  }, [pillar, status, habitId, search, startDate, endDate, month, year]);

  // Refetch logs on filter change
  useEffect(() => {
    fetchFilteredLogs(1);
  }, [fetchFilteredLogs]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchFilteredLogs(page);
    }
  };

  // Reset filters helper
  const handleResetFilters = () => {
    setPillar('All');
    setStatus('All');
    setHabitId('All');
    setStartDate('');
    setEndDate('');
    setMonth('All');
    setYear('All');
    setSearch('');
  };

  // CSV Data compiler and downloader
  const handleExportCSV = async (isExcelCompatible: boolean = false) => {
    setExporting(true);
    try {
      const allLogs = await getAllHistoryLogsForExport();
      
      // Header columns
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
      
      // Support Excel character encoding (UTF-8 BOM)
      const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
        type: 'text/csv;charset=utf-8;',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileExtension = isExcelCompatible ? 'xls' : 'csv';
      link.setAttribute('download', `FourPillar_History_${new Date().toISOString().split('T')[0]}.${fileExtension}`);
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting logs:', error);
    } finally {
      setExporting(false);
    }
  };

  const getPillarColorClass = (pillar: string) => {
    switch (pillar) {
      case 'Mental': return 'pillar-tag-mental';
      case 'Spiritual': return 'pillar-tag-spiritual';
      case 'Emotional': return 'pillar-tag-emotional';
      case 'Physical': return 'pillar-tag-physical';
      default: return '';
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">History</h1>
          <p className="text-muted text-sm">Review, filter, and export all historical habit records.</p>
        </div>

        {/* Exports Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleExportCSV(false)}
            disabled={exporting}
            className="h-9 px-3 border border-border bg-card rounded text-xs font-semibold text-foreground hover:bg-hover transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <Download size={14} />
                Export CSV
              </>
            )}
          </button>
          <button
            onClick={() => handleExportCSV(true)}
            disabled={exporting}
            className="h-9 px-3 border border-border bg-card rounded text-xs font-semibold text-foreground hover:bg-hover transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <FileSpreadsheet size={14} />
                Export Excel
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-xs space-y-4">
        <h2 className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
          <Filter size={12} />
          Filter Settings
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {/* Pillar */}
          <div className="space-y-1">
            <span className="text-[10px] text-muted font-bold uppercase">Pillar</span>
            <select
              value={pillar}
              onChange={(e) => setPillar(e.target.value)}
              className="w-full h-8 px-2 text-xs bg-hover border border-border rounded focus:outline-none focus:border-accent text-foreground cursor-pointer"
            >
              <option value="All">All Pillars</option>
              <option value="Mental">🧠 Mental</option>
              <option value="Spiritual">🧭 Spiritual</option>
              <option value="Emotional">❤️ Emotional</option>
              <option value="Physical">💪 Physical</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <span className="text-[10px] text-muted font-bold uppercase">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-8 px-2 text-xs bg-hover border border-border rounded focus:outline-none focus:border-accent text-foreground cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
              <option value="Completed">Completed</option>
              <option value="Missed">Missed</option>
            </select>
          </div>

          {/* Habit */}
          <div className="space-y-1">
            <span className="text-[10px] text-muted font-bold uppercase">Habit</span>
            <select
              value={habitId}
              onChange={(e) => setHabitId(e.target.value)}
              className="w-full h-8 px-2 text-xs bg-hover border border-border rounded focus:outline-none focus:border-accent text-foreground cursor-pointer"
            >
              <option value="All">All Habits</option>
              {habits.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="space-y-1">
            <span className="text-[10px] text-muted font-bold uppercase">Year</span>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full h-8 px-2 text-xs bg-hover border border-border rounded focus:outline-none focus:border-accent text-foreground cursor-pointer"
            >
              <option value="All">All Years</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>

          {/* Month */}
          <div className="space-y-1">
            <span className="text-[10px] text-muted font-bold uppercase">Month</span>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full h-8 px-2 text-xs bg-hover border border-border rounded focus:outline-none focus:border-accent text-foreground cursor-pointer"
            >
              <option value="All">All Months</option>
              {[
                { val: '1', name: 'Jan' },
                { val: '2', name: 'Feb' },
                { val: '3', name: 'Mar' },
                { val: '4', name: 'Apr' },
                { val: '5', name: 'May' },
                { val: '6', name: 'Jun' },
                { val: '7', name: 'Jul' },
                { val: '8', name: 'Aug' },
                { val: '9', name: 'Sep' },
                { val: '10', name: 'Oct' },
                { val: '11', name: 'Nov' },
                { val: '12', name: 'Dec' },
              ].map((m) => (
                <option key={m.val} value={m.val}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="space-y-1">
            <span className="text-[10px] text-muted font-bold uppercase">Start Date</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-8 px-2 text-[10px] bg-hover border border-border rounded focus:outline-none focus:border-accent text-foreground"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <span className="text-[10px] text-muted font-bold uppercase">End Date</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-8 px-2 text-[10px] bg-hover border border-border rounded focus:outline-none focus:border-accent text-foreground"
            />
          </div>

          {/* Search Notes */}
          <div className="space-y-1">
            <span className="text-[10px] text-muted font-bold uppercase">Search Notes</span>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Keywords..."
                className="w-full h-8 pl-6 pr-2 text-xs bg-hover border border-border rounded focus:outline-none focus:border-accent text-foreground"
              />
              <Search className="absolute left-2 top-2.5 text-muted" size={10} />
            </div>
          </div>
        </div>

        {/* Clear filters trigger */}
        <div className="flex justify-end pt-1">
          <button
            onClick={handleResetFilters}
            className="text-[10px] font-semibold text-muted hover:text-foreground transition-colors underline decoration-dotted"
          >
            Reset All Filters
          </button>
        </div>
      </div>

      {/* History Database Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-xs relative">
        {loading && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-xs flex items-center justify-center z-10">
            <Loader2 className="animate-spin text-accent" size={24} />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-hover/80 border-b border-border">
                <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">Habit</th>
                <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">Pillar</th>
                <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">Score %</th>
                <th className="px-4 py-3 font-semibold text-muted text-xs uppercase tracking-wider">Notes & reflections</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted font-mono text-xs">
                    No historical logs match your filters. Adjust settings or run cron to generate records.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-hover/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-muted">{log.date}</td>
                    <td className="px-4 py-3 font-medium text-foreground truncate max-w-[160px]">
                      {log.habitId?.name || 'Deleted Habit'}
                    </td>
                    <td className="px-4 py-3">
                      {log.habitId?.pillar ? (
                        <span className={`pillar-tag ${getPillarColorClass(log.habitId.pillar)}`}>
                          {log.habitId.pillar}
                        </span>
                      ) : (
                        <span className="text-xs text-muted">Unknown</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded font-bold border ${
                          log.status === 'Completed'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                            : log.status === 'Partial'
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            : log.status === 'Missed'
                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                            : 'bg-hover text-muted border-border'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-xs">{log.completionPercentage}%</td>
                    <td className="px-4 py-3 text-xs text-muted max-w-sm truncate" title={log.notes}>
                      {log.notes || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border flex items-center justify-between bg-card text-muted">
            <span className="text-xs font-mono">
              Showing page {currentPage} of {totalPages} ({totalCount} total entries)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="h-8 w-8 rounded border border-border flex items-center justify-center hover:bg-hover hover:text-foreground cursor-pointer disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="h-8 w-8 rounded border border-border flex items-center justify-center hover:bg-hover hover:text-foreground cursor-pointer disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
