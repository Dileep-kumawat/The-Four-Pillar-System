'use server';

import { connectToDatabase } from '@/lib/db';
import { requireSessionUser } from '@/lib/authHelpers';
import DailyLog from '@/models/DailyLog';
import MasterHabit from '@/models/MasterHabit';

interface GetHistoryLogsParams {
  page?: number;
  limit?: number;
  pillar?: string;
  status?: string;
  habitId?: string;
  search?: string;
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  month?: string;     // 1-12
  year?: string;      // YYYY
}

export async function getHistoryLogs(params: GetHistoryLogsParams) {
  const user = await requireSessionUser();
  await connectToDatabase();

  const {
    page = 1,
    limit = 20,
    pillar,
    status,
    habitId,
    search,
    startDate,
    endDate,
    month,
    year,
  } = params;

  // Build query
  const query: any = { userId: user.id };

  if (status && status !== 'All') {
    query.status = status;
  }

  if (habitId && habitId !== 'All') {
    query.habitId = habitId;
  }

  // Filter by date range
  if (startDate || endDate) {
    query.date = {};
    if (startDate) {
      query.date.$gte = startDate;
    }
    if (endDate) {
      query.date.$lte = endDate;
    }
  }

  // Filter by month/year (if specific date range is not defined)
  if (!startDate && !endDate) {
    if (year && year !== 'All') {
      if (month && month !== 'All') {
        const paddedMonth = month.padStart(2, '0');
        query.date = new RegExp(`^${year}-${paddedMonth}-`);
      } else {
        query.date = new RegExp(`^${year}-`);
      }
    } else if (month && month !== 'All') {
      const paddedMonth = month.padStart(2, '0');
      query.date = new RegExp(`-\\b${paddedMonth}-\\b`); // match -MM-
    }
  }

  // Filter by search text (needs population search or search notes)
  if (search && search.trim()) {
    query.notes = { $regex: search.trim(), $options: 'i' };
  }

  // 1. Fetch habits of the user to perform client-side matching or pillar filtering
  const habits = await MasterHabit.find({ userId: user.id });
  const habitsMap = new Map(habits.map((h) => [h._id.toString(), h]));

  // If search matches a habit name, we can also include those logs
  let searchHabitIds: string[] = [];
  if (search && search.trim()) {
    searchHabitIds = habits
      .filter((h) => h.name.toLowerCase().includes(search.toLowerCase().trim()))
      .map((h) => h._id.toString());
  }

  // If a specific pillar filter is selected, we filter by habits belonging to that pillar
  if (pillar && pillar !== 'All') {
    const pillarHabitIds = habits
      .filter((h) => h.pillar === pillar)
      .map((h) => h._id.toString());
    
    if (query.habitId) {
      // If user selected a specific habit AND a pillar, check if the habit belongs to that pillar
      if (!pillarHabitIds.includes(query.habitId.toString())) {
        // Mismatch, return empty
        return { logs: [], totalPages: 0, currentPage: 1, totalCount: 0 };
      }
    } else {
      query.habitId = { $in: pillarHabitIds };
    }
  }

  // If searching by habit name or notes
  if (search && search.trim()) {
    const originalHabitId = query.habitId;
    if (originalHabitId) {
      // Habit is already filtered
      if (typeof originalHabitId === 'string' && searchHabitIds.includes(originalHabitId)) {
        // Keep it
      } else if (typeof originalHabitId === 'object' && originalHabitId.$in) {
        // Intersect
        const intersection = originalHabitId.$in.filter((x: string) => searchHabitIds.includes(x));
        query.$or = [
          { habitId: { $in: intersection } },
          { notes: { $regex: search.trim(), $options: 'i' } }
        ];
        delete query.notes;
        delete query.habitId;
      } else {
        query.$or = [
          { habitId: originalHabitId },
          { notes: { $regex: search.trim(), $options: 'i' } }
        ];
        delete query.notes;
        delete query.habitId;
      }
    } else {
      query.$or = [
        { habitId: { $in: searchHabitIds } },
        { notes: { $regex: search.trim(), $options: 'i' } }
      ];
      delete query.notes;
    }
  }

  // Count total matches
  const totalCount = await DailyLog.countDocuments(query);
  const totalPages = Math.ceil(totalCount / limit);

  // Fetch paginated logs
  const logs = await DailyLog.find(query)
    .sort({ date: -1, createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: 'habitId',
      model: MasterHabit,
    });

  return {
    logs: JSON.parse(JSON.stringify(logs)),
    totalPages,
    currentPage: page,
    totalCount,
  };
}

export async function getAllHistoryLogsForExport() {
  const user = await requireSessionUser();
  await connectToDatabase();

  const logs = await DailyLog.find({ userId: user.id })
    .sort({ date: -1 })
    .populate({
      path: 'habitId',
      model: MasterHabit,
    });

  return JSON.parse(JSON.stringify(logs));
}
