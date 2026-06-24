import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/authHelpers';
import { getDashboardStats } from '@/actions/dashboardActions';
import { getAnalyticsData } from '@/actions/analyticsActions';
import DashboardClient from '@/components/DashboardClient';

export const metadata = {
  title: 'Dashboard - The Four Pillar System',
};

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch initial dashboard stats & trendData in parallel
  const [stats, analytics] = await Promise.all([
    getDashboardStats(),
    getAnalyticsData(),
  ]);

  return <DashboardClient stats={stats} trendData={analytics.trendData} />;
}
