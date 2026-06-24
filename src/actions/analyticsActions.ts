'use server';

import { connectToDatabase } from '@/lib/db';
import { requireSessionUser } from '@/lib/authHelpers';
import DailyLog from '@/models/DailyLog';
import MasterHabit from '@/models/MasterHabit';
import DailySnapshot from '@/models/DailySnapshot';

// Helper to get local date (YYYY-MM-DD) based on timezone
function getLocalDateString(timezone: string = 'UTC', daysOffset: number = 0) {
  try {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(d);
  } catch {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  }
}

interface HabitStreakInfo {
  currentStreak: number;
  longestStreak: number;
}

// Calculate streaks for a single habit in-memory using pre-fetched logs
function calculateHabitStreaksFromLogs(habitLogs: any[], timezone: string = 'UTC'): HabitStreakInfo {
  if (habitLogs.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const todayStr = getLocalDateString(timezone);
  const yesterdayStr = getLocalDateString(timezone, -1);

  let currentStreak = 0;
  let longestStreak = 0;
  let runningStreak = 0;

  // Sort logs by date ascending for longest streak calculation
  const sortedLogs = [...habitLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let prevDate: Date | null = null;
  for (const log of sortedLogs) {
    const isCompleted = log.status === 'Completed';

    if (isCompleted) {
      const currentDate = new Date(log.date);
      if (prevDate) {
        const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          runningStreak++;
        } else if (diffDays > 1) {
          runningStreak = 1;
        }
      } else {
        runningStreak = 1;
      }
      prevDate = currentDate;
      if (runningStreak > longestStreak) {
        longestStreak = runningStreak;
      }
    } else {
      runningStreak = 0;
      prevDate = null;
    }
  }

  // Calculate current streak
  const logsMap = new Map<string, string>();
  for (const log of habitLogs) {
    logsMap.set(log.date, log.status);
  }

  const todayStatus = logsMap.get(todayStr);
  const yesterdayStatus = logsMap.get(yesterdayStr);

  let startStr = todayStr;
  if (todayStatus !== 'Completed') {
    if (yesterdayStatus === 'Completed') {
      startStr = yesterdayStr;
    } else {
      startStr = todayStr; // Will break immediately
    }
  }

  const checkDate = new Date(startStr);
  while (true) {
    const formattedCheck = checkDate.toISOString().split('T')[0];
    const status = logsMap.get(formattedCheck);

    if (status === 'Completed') {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { currentStreak, longestStreak };
}

export async function getAnalyticsData() {
  const user = await requireSessionUser();
  const userTimezone = (user as any).timezone || 'UTC';
  
  await connectToDatabase();

  // 1. Fetch habits, logs, and snapshots in parallel
  const [habits, logs, snapshots] = await Promise.all([
    MasterHabit.find({ userId: user.id }),
    DailyLog.find({ userId: user.id }),
    DailySnapshot.find({ userId: user.id }).sort({ date: 1 }),
  ]);

  // 2. Build Leaderboard & Streak analysis per habit
  const leaderboard = [];
  
  for (const habit of habits) {
    const habitLogs = logs.filter((l) => l.habitId.toString() === habit._id.toString());
    const totalLogs = habitLogs.length;
    
    let completionRate = 0;
    if (totalLogs > 0) {
      const completedLogs = habitLogs.filter((l) => l.status === 'Completed').length;
      completionRate = Math.round((completedLogs / totalLogs) * 100);
    }

    const { currentStreak, longestStreak } = calculateHabitStreaksFromLogs(habitLogs, userTimezone);

    leaderboard.push({
      id: habit._id.toString(),
      name: habit.name,
      pillar: habit.pillar,
      active: habit.active,
      completionRate,
      currentStreak,
      longestStreak,
      totalLogs,
    });
  }

  // Sort by highest completion %
  leaderboard.sort((a, b) => b.completionRate - a.completionRate);

  // 3. Missed Analysis
  const missedLogs = logs.filter((l) => l.status === 'Missed');
  
  // A. Most missed habit
  const missedHabitCounts: Record<string, { name: string; count: number }> = {};
  missedLogs.forEach((log) => {
    const habitIdStr = log.habitId.toString();
    const habit = habits.find((h) => h._id.toString() === habitIdStr);
    if (habit) {
      if (!missedHabitCounts[habitIdStr]) {
        missedHabitCounts[habitIdStr] = { name: habit.name, count: 0 };
      }
      missedHabitCounts[habitIdStr].count++;
    }
  });

  const mostMissedHabits = Object.values(missedHabitCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5

  const mostMissedHabit = mostMissedHabits[0]?.name || 'None';

  // B. Most missed pillar
  const missedPillarCounts: Record<string, number> = { Mental: 0, Spiritual: 0, Emotional: 0, Physical: 0 };
  missedLogs.forEach((log) => {
    const habitIdStr = log.habitId.toString();
    const habit = habits.find((h) => h._id.toString() === habitIdStr);
    if (habit && habit.pillar) {
      missedPillarCounts[habit.pillar] = (missedPillarCounts[habit.pillar] || 0) + 1;
    }
  });

  let mostMissedPillar = 'None';
  let maxMissed = -1;
  Object.entries(missedPillarCounts).forEach(([pillar, count]) => {
    if (count > maxMissed && count > 0) {
      maxMissed = count;
      mostMissedPillar = pillar;
    }
  });

  // C. Failure Trends (Weekly/Monthly failure rates)
  const getFailureTrends = () => {
    // Past 30 days daily trend
    const past30Days = [];
    for (let i = 29; i >= 0; i--) {
      const dateStr = getLocalDateString(userTimezone, -i);
      const dayLogs = logs.filter((l) => l.date === dateStr);
      const missed = dayLogs.filter((l) => l.status === 'Missed').length;
      past30Days.push({
        date: dateStr.split('-').slice(1).join('-'), // "MM-DD"
        failures: missed,
        total: dayLogs.length,
      });
    }

    return { past30Days };
  };

  const failureTrends = getFailureTrends();

  // 4. Trend graphs: completion rates over last 30 days
  const trendData = snapshots.slice(-30).map((snap) => ({
    date: snap.date.split('-').slice(1).join('-'), // "MM-DD"
    completionRate: snap.completionRate,
    Mental: snap.pillarScores?.Mental || 0,
    Spiritual: snap.pillarScores?.Spiritual || 0,
    Emotional: snap.pillarScores?.Emotional || 0,
    Physical: snap.pillarScores?.Physical || 0,
  }));

  return {
    leaderboard: JSON.parse(JSON.stringify(leaderboard)),
    mostMissedHabit,
    mostMissedPillar,
    missedPillarCounts,
    mostMissedHabits,
    failureTrends,
    trendData: JSON.parse(JSON.stringify(trendData)),
  };
}
