import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/authHelpers';
import { getMasterHabits } from '@/actions/habitActions';
import MasterHabitsClient from '@/components/MasterHabitsClient';

export const metadata = {
  title: 'Master Habits - The Four Pillar System',
};

export default async function MasterHabitsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const habits = await getMasterHabits();

  return <MasterHabitsClient initialHabits={habits} />;
}
