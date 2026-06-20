import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/authHelpers';
import { getMasterHabits } from '@/actions/habitActions';
import HistoryClient from '@/components/HistoryClient';

export const metadata = {
  title: 'History - The Four Pillar System',
};

export default async function HistoryPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch list of habits to populate the filter dropdown
  const habits = await getMasterHabits();

  // Pick only necessary details
  const habitOptions = habits.map((h: any) => ({
    _id: h._id.toString(),
    name: h.name,
  }));

  return <HistoryClient habits={habitOptions} />;
}
