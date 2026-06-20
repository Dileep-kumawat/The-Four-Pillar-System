import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/authHelpers';
import { getAnalyticsData } from '@/actions/analyticsActions';
import AnalyticsClient from '@/components/AnalyticsClient';

export const metadata = {
  title: 'Analytics - The Four Pillar System',
};

export default async function AnalyticsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const analytics = await getAnalyticsData();

  return <AnalyticsClient analytics={analytics} />;
}
