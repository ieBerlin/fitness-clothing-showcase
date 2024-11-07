import ActivityType from "../enums/ActivityType";

export interface Activity {
  _id: string;
  adminId: string;
  activityType: ActivityType;
  entityId: string;
  timestamp: Date;
}

export default Activity;
