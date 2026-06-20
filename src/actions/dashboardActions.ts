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

// Function to calculate overall user streak (days with completion rate >= 50%)
export async function calculateStreak(userId: string, timezone: string = 'UTC') {
  await connectToDatabase();
  
  // Fetch snapshots sorted by date descending
  const snapshots = await DailySnapshot.find({ userId }).sort({ date: -1 });
  if (snapshots.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const todayStr = getLocalDateString(timezone);
  const yesterdayStr = getLocalDateString(timezone, -1);

  let currentStreak = 0;
  let longestStreak = 0;
  let runningStreak = 0;

  // Create a map of date -> completionRate for fast lookup
  const rates = new Map<string, number>();
  for (const snap of snapshots) {
    rates.set(snap.date, snap.completionRate);
  }

  // Find the list of unique sorted dates in ascending order to find the longest streak
  const sortedDates = snapshots
    .map((s) => s.date)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // Calculate longest streak historically
  let prevDate: Date | null = null;
  for (const dateStr of sortedDates) {
    const rate = rates.get(dateStr) || 0;
    const isSuccessful = rate >= 50;

    if (isSuccessful) {
      const currentDate = new Date(dateStr);
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

  // Calculate current streak (working backwards from today/yesterday)
  let checkDate = new Date(todayStr);
  const todayRate = rates.get(todayStr) ?? -1;
  const yesterdayRate = rates.get(yesterdayStr) ?? -1;

  // If today has logs but completion is < 50%, and yesterday is >= 50%, we keep yesterday's streak alive.
  // If today has no logs (rate is -1) or is < 50%, we check yesterday.
  let startStr = todayStr;
  if (todayRate < 50) {
    if (yesterdayRate >= 50) {
      startStr = yesterdayStr;
    } else {
      startStr = todayStr; // Will break immediately since today's rate < 50%
    }
  }

  checkDate = new Date(startStr);
  while (true) {
    const formattedCheck = checkDate.toISOString().split('T')[0];
    const rate = rates.get(formattedCheck);

    if (rate !== undefined && rate >= 50) {
      currentStreak++;
      // Subtract one day
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { currentStreak, longestStreak };
}

export async function getDashboardStats() {
  const user = await requireSessionUser();
  const userTimezone = (user as any).timezone || 'UTC';
  
  const todayStr = getLocalDateString(userTimezone);

  await connectToDatabase();

  // 1. Calculate streaks
  const { currentStreak, longestStreak } = await calculateStreak(user.id, userTimezone);

  // 2. Fetch all snapshots
  const snapshots = await DailySnapshot.find({ userId: user.id });

  // 3. Compute overall Life Score (overall average completion percentage of all historical snapshots)
  let overallSum = 0;
  let lifeScore = 0;
  if (snapshots.length > 0) {
    snapshots.forEach((snap) => {
      overallSum += snap.completionRate;
    });
    lifeScore = Math.round(overallSum / snapshots.length);
  }

  // Determine Life Score Category
  let lifeScoreCategory: 'Elite' | 'Strong' | 'Improving' | 'Needs Attention' = 'Needs Attention';
  if (lifeScore >= 90) lifeScoreCategory = 'Elite';
  else if (lifeScore >= 75) lifeScoreCategory = 'Strong';
  else if (lifeScore >= 60) lifeScoreCategory = 'Improving';

  // 4. Calculate today's progress
  const todaySnapshot = snapshots.find((s) => s.date === todayStr);
  const todayProgress = todaySnapshot ? todaySnapshot.completionRate : 0;

  // 5. Calculate weekly, monthly, quarterly, yearly progress
  const calculatePeriodProgress = (days: number) => {
    const cutOffDate = new Date();
    cutOffDate.setDate(cutOffDate.getDate() - days);
    
    const filtered = snapshots.filter((s) => new Date(s.date) >= cutOffDate);
    if (filtered.length === 0) return 0;
    
    const sum = filtered.reduce((acc, s) => acc + s.completionRate, 0);
    return Math.round(sum / filtered.length);
  };

  const weeklyProgress = calculatePeriodProgress(7);
  const monthlyProgress = calculatePeriodProgress(30);
  const quarterlyProgress = calculatePeriodProgress(90);
  const yearlyProgress = calculatePeriodProgress(365);

  // 6. Calculate average Four Pillar Scores across all time
  let pillarCounts = { Mental: 0, Spiritual: 0, Emotional: 0, Physical: 0 };
  let pillarSums = { Mental: 0, Spiritual: 0, Emotional: 0, Physical: 0 };

  snapshots.forEach((snap) => {
    if (snap.pillarScores) {
      const scores = snap.pillarScores;
      if (scores.Mental !== undefined) {
        pillarSums.Mental += scores.Mental;
        pillarCounts.Mental++;
      }
      if (scores.Spiritual !== undefined) {
        pillarSums.Spiritual += scores.Spiritual;
        pillarCounts.Spiritual++;
      }
      if (scores.Emotional !== undefined) {
        pillarSums.Emotional += scores.Emotional;
        pillarCounts.Emotional++;
      }
      if (scores.Physical !== undefined) {
        pillarSums.Physical += scores.Physical;
        pillarCounts.Physical++;
      }
    }
  });

  const pillarScores = {
    Mental: pillarCounts.Mental > 0 ? Math.round(pillarSums.Mental / pillarCounts.Mental) : 0,
    Spiritual: pillarCounts.Spiritual > 0 ? Math.round(pillarSums.Spiritual / pillarCounts.Spiritual) : 0,
    Emotional: pillarCounts.Emotional > 0 ? Math.round(pillarSums.Emotional / pillarCounts.Emotional) : 0,
    Physical: pillarCounts.Physical > 0 ? Math.round(pillarSums.Physical / pillarCounts.Physical) : 0,
  };

  return {
    lifeScore,
    lifeScoreCategory,
    currentStreak,
    longestStreak,
    todayProgress,
    weeklyProgress,
    monthlyProgress,
    quarterlyProgress,
    yearlyProgress,
    pillarScores,
  };
}
