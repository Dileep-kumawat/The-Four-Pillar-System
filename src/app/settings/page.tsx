import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/authHelpers';
import SettingsClient from '@/components/SettingsClient';

export const metadata = {
  title: 'Settings - The Four Pillar System',
};

export default async function SettingsPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  return <SettingsClient />;
}
