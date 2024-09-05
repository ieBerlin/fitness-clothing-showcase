import { Document, model, Schema, Types } from "mongoose";
import { IAdmin } from "./Admin";
import { IProduct } from "./Product";
import { ISection } from "./Section";
import ActivityType from "../enums/ActivityType";
import EntityType from "../enums/EntityType";

export interface IActivity extends Document {
  adminId: Types.ObjectId | IAdmin;
  activityType: ActivityType;
  entityType: EntityType;
  entityId: Types.ObjectId | IProduct | ISection | IAdmin;
  timestamp: Date;
}

const ActivitySchema: Schema<IActivity> = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    activityType: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
    },
    entityType: {
      type: String,
      enum: Object.values(EntityType),
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "entityType",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Activity = model<IActivity>("Activity", ActivitySchema, "Activity");
export default Activity;
