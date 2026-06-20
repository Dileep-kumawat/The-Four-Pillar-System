import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/authHelpers';
import { connectToDatabase } from '@/lib/db';
import DailySnapshot from '@/models/DailySnapshot';
import CalendarClient from '@/components/CalendarClient';

export const metadata = {
  title: 'Calendar - The Four Pillar System',
};

export default async function CalendarPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  await connectToDatabase();

  // Fetch all historical daily snapshots of the user
  const snapshots = await DailySnapshot.find({ userId: user.id })
    .sort({ date: 1 });

  return <CalendarClient snapshots={JSON.parse(JSON.stringify(snapshots))} />;
}
