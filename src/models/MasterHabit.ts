import mongoose, { Schema, Document, Model } from 'mongoose';

export type PillarType = 'Mental' | 'Spiritual' | 'Emotional' | 'Physical';

export interface IMasterHabit extends Document {
  userId: mongoose.Types.ObjectId | string;
  name: string;
  pillar: PillarType;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MasterHabitSchema: Schema<IMasterHabit> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    pillar: {
      type: String,
      enum: ['Mental', 'Spiritual', 'Emotional', 'Physical'],
      required: true,
    },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// Compound index to help fetch active habits per user
MasterHabitSchema.index({ userId: 1, active: 1 });

const MasterHabit: Model<IMasterHabit> =
  mongoose.models.MasterHabit || mongoose.model<IMasterHabit>('MasterHabit', MasterHabitSchema);

export default MasterHabit;
