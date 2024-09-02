import ActivityType from "../enums/ActivityType";
import EntityType from "../enums/EntityType";

export interface Activity extends Document {
  _id: string;
  adminId: string;
  activityType: ActivityType;
  entityType: EntityType;
  entityId: string;
  timestamp: Date;
}

export default Activity;
