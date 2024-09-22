import ActivityType from "../enums/ActivityType";
import EntityType from "../enums/EntityType";
import Availability from "../enums/Availability";
import Activity from "../models/Activity";

const dummyAdminId = "64e4b239fc13ae1c34000001";
const dummyProductId = "64e4b239fc13ae1c34000002";
const dummySectionId = "64e4b239fc13ae1c34000003";

// Dummy Data for Activities
const activities: Activity[] = [
  {
    _id: "64e4b239fc13ae1c34000001",
    adminId: dummyAdminId,
    activityType: ActivityType.PRODUCT_ADDED,
    entityType: EntityType.PRODUCT,
    entityId: dummyProductId,
    timestamp: new Date("2024-01-01T10:00:00Z"),
  },
  {
    _id: "64e4b239fc13ae1c34000001",

    adminId: dummyAdminId,
    activityType: ActivityType.PRODUCT_UPDATED,
    entityType: EntityType.PRODUCT,
    entityId: dummyProductId,
    timestamp: new Date("2024-02-01T12:00:00Z"),
  },
  {
    _id: "64e4b239fc13ae1c34000001",

    adminId: dummyAdminId,
    activityType: ActivityType.PRODUCT_ADDED_TO_SECTION,
    entityType: EntityType.SECTION,
    entityId: dummySectionId,
    timestamp: new Date("2024-02-15T15:30:00Z"),
  },
  {
    _id: "64e4b239fc13ae1c34000001",

    adminId: dummyAdminId,
    activityType: ActivityType.ADMIN_CREATED,
    entityType: EntityType.ADMIN,
    entityId: dummyAdminId,
    timestamp: new Date("2024-03-01T09:45:00Z"),
  },
  {
    _id: "64e4b239fc13ae1c34000001",

    adminId: dummyAdminId,
    activityType: ActivityType.PRODUCT_REMOVED_FROM_SECTION,
    entityType: EntityType.SECTION,
    entityId: dummySectionId,
    timestamp: new Date("2024-03-05T11:00:00Z"),
  },
];

// Dummy Data for Products with Availability
export const products = [
  {
    _id: dummyProductId,
    name: "Winter Jacket",
    availability: Availability.IN_STOCK,
    price: 99.99,
  },
  {
    _id: "64e4b239fc13ae1c34000004",
    name: "Summer T-Shirt",
    availability: Availability.OUT_OF_STOCK,
    price: 19.99,
  },
  {
    _id: "64e4b239fc13ae1c34000005",
    name: "Autumn Sweater",
    availability: Availability.DISCOUNTED,
    price: 49.99,
  },
];

export default activities;
