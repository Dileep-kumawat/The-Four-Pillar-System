import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPillarScores {
  Mental: number;
  Spiritual: number;
  Emotional: number;
  Physical: number;
}

export interface IDailySnapshot extends Document {
  userId: mongoose.Types.ObjectId | string;
  date: string; // YYYY-MM-DD format
  completionRate: number;
  pillarScores: IPillarScores;
  completedCount: number;
  missedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const DailySnapshotSchema: Schema<IDailySnapshot> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true, index: true },
    completionRate: { type: Number, default: 0 },
    pillarScores: {
      Mental: { type: Number, default: 0 },
      Spiritual: { type: Number, default: 0 },
      Emotional: { type: Number, default: 0 },
      Physical: { type: Number, default: 0 },
    },
    completedCount: { type: Number, default: 0 },
    missedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

DailySnapshotSchema.index({ userId: 1, date: 1 }, { unique: true });

const DailySnapshot: Model<IDailySnapshot> =
  mongoose.models.DailySnapshot || mongoose.model<IDailySnapshot>('DailySnapshot', DailySnapshotSchema);

export default DailySnapshot;
