import mongoose, { Schema, Document, Model } from 'mongoose';

export type HabitStatus = 'Pending' | 'Partial' | 'Completed' | 'Missed';

export interface IDailyLog extends Document {
  userId: mongoose.Types.ObjectId | string;
  habitId: mongoose.Types.ObjectId | string;
  date: string; // YYYY-MM-DD format
  status: HabitStatus;
  notes: string;
  completionPercentage: number; // 0, 50, 100, or custom
  createdAt: Date;
  updatedAt: Date;
}

const DailyLogSchema: Schema<IDailyLog> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    habitId: { type: Schema.Types.ObjectId, ref: 'MasterHabit', required: true, index: true },
    date: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ['Pending', 'Partial', 'Completed', 'Missed'],
      default: 'Pending',
      index: true,
    },
    notes: { type: String, default: '' },
    completionPercentage: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound index to guarantee uniqueness of (userId, habitId, date) and optimize searches
DailyLogSchema.index({ userId: 1, habitId: 1, date: 1 }, { unique: true });
DailyLogSchema.index({ userId: 1, date: 1 });

const DailyLog: Model<IDailyLog> =
  mongoose.models.DailyLog || mongoose.model<IDailyLog>('DailyLog', DailyLogSchema);

export default DailyLog;
