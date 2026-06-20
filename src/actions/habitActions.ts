'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import { requireSessionUser } from '@/lib/authHelpers';
import MasterHabit, { PillarType } from '@/models/MasterHabit';
import DailyLog from '@/models/DailyLog';
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

export async function getMasterHabits() {
  const user = await requireSessionUser();
  await connectToDatabase();
  
  const habits = await MasterHabit.find({ userId: user.id }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(habits));
}

export async function createHabit(name: string, pillar: PillarType) {
  const user = await requireSessionUser();
  if (!name.trim()) throw new Error('Habit name cannot be empty');

  await connectToDatabase();

  const habit = await MasterHabit.create({
    userId: user.id,
    name: name.trim(),
    pillar,
    active: true,
  });

  // UX Improvement: Create today's log immediately for this habit
  const userTimezone = (user as any).timezone || 'UTC';
  const todayStr = getLocalDateString(userTimezone);

  try {
    await DailyLog.create({
      userId: user.id,
      habitId: habit._id,
      date: todayStr,
      status: 'Pending',
      notes: '',
      completionPercentage: 0,
    });

    // Ensure Today's Snapshot exists
    const existingSnapshot = await DailySnapshot.findOne({
      userId: user.id,
      date: todayStr,
    });
    if (!existingSnapshot) {
      await DailySnapshot.create({
        userId: user.id,
        date: todayStr,
        completionRate: 0,
        pillarScores: { Mental: 0, Spiritual: 0, Emotional: 0, Physical: 0 },
        completedCount: 0,
        missedCount: 0,
      });
    }
  } catch (error) {
    // Ignore duplicate keys or potential race conditions
    console.error('Error creating initial log for new habit:', error);
  }

  revalidatePath('/master-habits');
  revalidatePath('/today');
  revalidatePath('/');
  
  return JSON.parse(JSON.stringify(habit));
}

export async function renameHabit(id: string, newName: string) {
  const user = await requireSessionUser();
  if (!newName.trim()) throw new Error('Habit name cannot be empty');

  await connectToDatabase();

  const habit = await MasterHabit.findOneAndUpdate(
    { _id: id, userId: user.id },
    { name: newName.trim() },
    { returnDocument: 'after' }
  );

  if (!habit) throw new Error('Habit not found');

  revalidatePath('/master-habits');
  revalidatePath('/today');
  revalidatePath('/');

  return JSON.parse(JSON.stringify(habit));
}

export async function toggleHabitStatus(id: string, active: boolean) {
  const user = await requireSessionUser();
  await connectToDatabase();

  const habit = await MasterHabit.findOneAndUpdate(
    { _id: id, userId: user.id },
    { active },
    { returnDocument: 'after' }
  );

  if (!habit) throw new Error('Habit not found');

  revalidatePath('/master-habits');
  revalidatePath('/today');
  revalidatePath('/');

  return JSON.parse(JSON.stringify(habit));
}
