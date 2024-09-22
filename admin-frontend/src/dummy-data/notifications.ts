import { Notification } from "../types/notification.types";

const notifications: Notification[] = [
  {
    id: "1",
    title: "System Update",
    description: "Your system will be updated tonight at 11 PM. Please save your work.",
    date: new Date("2024-08-18T10:00:00Z"),
    isRead: false,
  },
  {
    id: "2",
    title: "New Comment",
    description: "John Doe commented on your post.",
    date: new Date("2024-08-17T08:30:00Z"),
    isRead: true,
  },
  {
    id: "3",
    title: "Password Change",
    description: "Your password was changed successfully.",
    date: new Date("2024-08-16T14:45:00Z"),
    isRead: true,
  },
  {
    id: "4",
    title: "New Follower",
    description: "Jane Smith started following you.",
    date: new Date("2024-08-15T12:00:00Z"),
    isRead: false,
  },
  {
    id: "5",
    title: "Monthly Report",
    description: "Your monthly activity report is ready to view.",
    date: new Date("2024-08-14T09:15:00Z"),
    isRead: false,
  },
];

export default notifications;
