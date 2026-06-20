import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/authHelpers';
import { getTodayLogs } from '@/actions/logActions';
import TodayTasksClient from '@/components/TodayTasksClient';

export const metadata = {
  title: "Today's Tasks - The Four Pillar System",
};

export default async function TodayTasksPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const logs = await getTodayLogs();

  return <TodayTasksClient initialLogs={logs} />;
}
