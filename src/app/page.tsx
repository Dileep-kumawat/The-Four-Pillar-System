import { getSessionUser } from '@/lib/authHelpers';
import LandingPageClient from '@/components/LandingPageClient';

export const metadata = {
  title: 'The Four Pillar System - Systemize Your Habits',
  description: 'A premium habit operating system designed around four core pillars of human execution: Mental, Spiritual, Emotional, and Physical.',
};

export default async function LandingPage() {
  const user = await getSessionUser();

  // Convert the user to a plain object or match the expected props interface
  const serializedUser = user 
    ? {
        name: user.name,
        email: user.email,
        image: user.image,
      } 
    : null;

  return <LandingPageClient user={serializedUser} />;
}
