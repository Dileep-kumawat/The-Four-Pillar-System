'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db';
import { requireSessionUser } from '@/lib/authHelpers';
import User from '@/models/User';
import MasterHabit from '@/models/MasterHabit';
import DailyLog from '@/models/DailyLog';
import DailySnapshot from '@/models/DailySnapshot';

export async function updateProfile(name: string, timezone: string) {
  const sessionUser = await requireSessionUser();
  if (!name.trim()) throw new Error('Name cannot be empty');

  await connectToDatabase();

  const user = await User.findByIdAndUpdate(
    sessionUser.id,
    { name: name.trim(), timezone },
    { returnDocument: 'after' }
  );

  if (!user) throw new Error('User not found');

  revalidatePath('/settings');
  revalidatePath('/');
  revalidatePath('/today');

  return {
    success: true,
    user: {
      name: user.name,
      email: user.email,
      timezone: user.timezone,
    },
  };
}

export async function deleteAccount() {
  const sessionUser = await requireSessionUser();
  await connectToDatabase();

  const userId = sessionUser.id;

  // Delete all user related records
  await DailyLog.deleteMany({ userId });
  await DailySnapshot.deleteMany({ userId });
  await MasterHabit.deleteMany({ userId });
  await User.findByIdAndDelete(userId);

  return { success: true };
}
