import { Notification } from "../types/notification.type";

const notifications: Notification[] = [
  new Notification(
    "1", // Unique identifier
    "System Update",
    "Your system will be updated tonight at 11 PM. Please save your work.",
    new Date("2024-08-18T10:00:00Z"),
    false
  ),
  new Notification(
    "2",
    "New Comment",
    "John Doe commented on your post.",
    new Date("2024-08-17T08:30:00Z"),
    true
  ),
  new Notification(
    "3",
    "Password Change",
    "Your password was changed successfully.",
    new Date("2024-08-16T14:45:00Z"),
    true
  ),
  new Notification(
    "4",
    "New Follower",
    "Jane Smith started following you.",
    new Date("2024-08-15T12:00:00Z"),
    false
  ),
  new Notification(
    "5",
    "Monthly Report",
    "Your monthly activity report is ready to view.",
    new Date("2024-08-14T09:15:00Z"),
    false
  ),
];

export default notifications;
