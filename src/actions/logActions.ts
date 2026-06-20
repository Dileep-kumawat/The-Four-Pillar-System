'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import { requireSessionUser } from '@/lib/authHelpers';
import DailyLog, { HabitStatus } from '@/models/DailyLog';
import MasterHabit from '@/models/MasterHabit';
import DailySnapshot from '@/models/DailySnapshot';

// Helper to get local date (YYYY-MM-DD) based on timezone
function getLocalDateString(timezone: string = 'UTC') {
  try {
    const d = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(d);
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

// Function to update daily snapshot data for a given user and date
export async function updateDailySnapshot(userId: string, date: string) {
  await connectToDatabase();

  // Find all logs for the user on this date
  const logs = await DailyLog.find({ userId, date }).populate({
    path: 'habitId',
    model: MasterHabit,
  });

  if (logs.length === 0) {
    await DailySnapshot.deleteOne({ userId, date });
    return;
  }

  let completedCount = 0;
  let missedCount = 0;
  let totalScore = 0;

  const pillarSums: Record<string, { sum: number; count: number }> = {
    Mental: { sum: 0, count: 0 },
    Spiritual: { sum: 0, count: 0 },
    Emotional: { sum: 0, count: 0 },
    Physical: { sum: 0, count: 0 },
  };

  for (const log of logs) {
    const status = log.status;
    const score = log.completionPercentage;
    const habit = log.habitId as any;

    if (status === 'Completed') completedCount++;
    if (status === 'Missed') missedCount++;
    
    totalScore += score;

    if (habit && habit.pillar) {
      const pillar = habit.pillar;
      if (pillarSums[pillar]) {
        pillarSums[pillar].sum += score;
        pillarSums[pillar].count++;
      }
    }
  }

  const completionRate = Math.round(totalScore / logs.length);
  const pillarScores = {
    Mental: pillarSums.Mental.count > 0 ? Math.round(pillarSums.Mental.sum / pillarSums.Mental.count) : 0,
    Spiritual: pillarSums.Spiritual.count > 0 ? Math.round(pillarSums.Spiritual.sum / pillarSums.Spiritual.count) : 0,
    Emotional: pillarSums.Emotional.count > 0 ? Math.round(pillarSums.Emotional.sum / pillarSums.Emotional.count) : 0,
    Physical: pillarSums.Physical.count > 0 ? Math.round(pillarSums.Physical.sum / pillarSums.Physical.count) : 0,
  };

  await DailySnapshot.findOneAndUpdate(
    { userId, date },
    {
      completionRate,
      pillarScores,
      completedCount,
      missedCount,
    },
    { upsert: true, returnDocument: 'after' }
  );
}

export async function getTodayLogs() {
  const user = await requireSessionUser();
  const userTimezone = (user as any).timezone || 'UTC';
  const todayStr = getLocalDateString(userTimezone);

  await connectToDatabase();

  // 1. Fetch current logs for today
  let logs = await DailyLog.find({ userId: user.id, date: todayStr })
    .populate({
      path: 'habitId',
      model: MasterHabit,
    });

  // 2. Cold Start: If no logs exist, generate them automatically (acting like cron just ran)
  if (logs.length === 0) {
    const activeHabits = await MasterHabit.find({ userId: user.id, active: true });
    
    if (activeHabits.length > 0) {
      const logsToInsert = activeHabits.map((habit) => ({
        userId: user.id,
        habitId: habit._id,
        date: todayStr,
        status: 'Pending',
        notes: '',
        completionPercentage: 0,
      }));

      await DailyLog.insertMany(logsToInsert);
      await updateDailySnapshot(user.id, todayStr);

      // Fetch them again with population
      logs = await DailyLog.find({ userId: user.id, date: todayStr })
        .populate({
          path: 'habitId',
          model: MasterHabit,
        });
    }
  }

  return JSON.parse(JSON.stringify(logs));
}

export async function updateLogStatus(logId: string, status: HabitStatus) {
  const user = await requireSessionUser();
  await connectToDatabase();

  // Determine completion percentage based on status
  let completionPercentage = 0;
  if (status === 'Completed') completionPercentage = 100;
  if (status === 'Partial') completionPercentage = 50;
  if (status === 'Missed') completionPercentage = 0;
  if (status === 'Pending') completionPercentage = 0;

  const log = await DailyLog.findOneAndUpdate(
    { _id: logId, userId: user.id },
    { status, completionPercentage },
    { returnDocument: 'after' }
  );

  if (!log) throw new Error('Daily log not found');

  // Update snapshot for the date
  await updateDailySnapshot(user.id, log.date);

  revalidatePath('/today');
  revalidatePath('/');
  revalidatePath('/calendar');
  revalidatePath('/analytics');
  revalidatePath('/history');

  return JSON.parse(JSON.stringify(log));
}

export async function updateLogNotes(logId: string, notes: string) {
  const user = await requireSessionUser();
  await connectToDatabase();

  const log = await DailyLog.findOneAndUpdate(
    { _id: logId, userId: user.id },
    { notes },
    { returnDocument: 'after' }
  );

  if (!log) throw new Error('Daily log not found');

  revalidatePath('/today');
  revalidatePath('/calendar');
  revalidatePath('/history');

  return JSON.parse(JSON.stringify(log));
}

export async function getLogsForDate(date: string) {
  const user = await requireSessionUser();
  await connectToDatabase();

  const logs = await DailyLog.find({ userId: user.id, date })
    .populate({
      path: 'habitId',
      model: MasterHabit,
    });

  return JSON.parse(JSON.stringify(logs));
}
