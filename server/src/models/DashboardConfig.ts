import mongoose, { Schema, Document } from 'mongoose';

export interface IDashboardConfig extends Document {
  key: string;
  layout: {
    lg: object[];
    md: object[];
    sm: object[];
  };
  widgets: Record<string, object>;
  savedAt: string | null;
}

const DashboardConfigSchema = new Schema<IDashboardConfig>(
  {
    key: { type: String, default: 'default', unique: true },
    layout: {
      lg: { type: [Schema.Types.Mixed], default: [] },
      md: { type: [Schema.Types.Mixed], default: [] },
      sm: { type: [Schema.Types.Mixed], default: [] },
    },
    widgets: { type: Schema.Types.Mixed, default: {} },
    savedAt: { type: String, default: null },
  },
  { timestamps: false }
);

export default mongoose.model<IDashboardConfig>('DashboardConfig', DashboardConfigSchema);
