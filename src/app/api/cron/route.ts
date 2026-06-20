import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import MasterHabit from '@/models/MasterHabit';
import DailyLog from '@/models/DailyLog';
import DailySnapshot from '@/models/DailySnapshot';

// Helper to get date string in a specific timezone (YYYY-MM-DD)
function getLocalDateString(timezone: string = 'UTC') {
  try {
    const d = new Date();
    // Use Intl to format the date in the specified timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(d); // Output: YYYY-MM-DD
  } catch (error) {
    console.error(`Error formatting timezone "${timezone}":`, error);
    // Fallback to UTC
    const d = new Date();
    return d.toISOString().split('T')[0];
  }
}

export async function GET(req: NextRequest) {
  return handleCron(req);
}

export async function POST(req: NextRequest) {
  return handleCron(req);
}

async function handleCron(req: NextRequest) {
  // Security Check: Verify Vercel Cron Secret (bypass in local development if CRON_SECRET is not defined)
  const authHeader = req.headers.get('authorization');
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (process.env.NODE_ENV === 'production' && process.env.CRON_SECRET && authHeader !== expectedAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    // 1. Fetch all users
    const users = await User.find({});
    let totalLogsCreated = 0;
    let totalSnapshotsCreated = 0;

    for (const user of users) {
      const userTimezone = user.timezone || 'UTC';
      const userLocalDate = getLocalDateString(userTimezone);

      // 2. Fetch all active master habits for this user
      const activeHabits = await MasterHabit.find({ userId: user._id, active: true });

      if (activeHabits.length === 0) continue;

      // 3. For each active master habit, create a Pending DailyLog if it does not exist
      const logsToInsert = [];
      for (const habit of activeHabits) {
        // Query to check if log exists
        const existingLog = await DailyLog.findOne({
          userId: user._id,
          habitId: habit._id,
          date: userLocalDate,
        });

        if (!existingLog) {
          logsToInsert.push({
            userId: user._id,
            habitId: habit._id,
            date: userLocalDate,
            status: 'Pending',
            notes: '',
            completionPercentage: 0,
          });
        }
      }

      if (logsToInsert.length > 0) {
        await DailyLog.insertMany(logsToInsert);
        totalLogsCreated += logsToInsert.length;
      }

      // 4. Ensure a DailySnapshot exists for this date and user
      const existingSnapshot = await DailySnapshot.findOne({
        userId: user._id,
        date: userLocalDate,
      });

      if (!existingSnapshot) {
        await DailySnapshot.create({
          userId: user._id,
          date: userLocalDate,
          completionRate: 0,
          pillarScores: {
            Mental: 0,
            Spiritual: 0,
            Emotional: 0,
            Physical: 0,
          },
          completedCount: 0,
          missedCount: 0,
        });
        totalSnapshotsCreated++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated logs and snapshots successfully`,
      details: {
        logsCreated: totalLogsCreated,
        snapshotsCreated: totalSnapshotsCreated,
      },
    });
  } catch (error: any) {
    console.error('Cron Execution Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
