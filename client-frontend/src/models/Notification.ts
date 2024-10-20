import NotificationType from "../enums/NotificationType";

interface Notification {
  _id: string;
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  url?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
export default Notification;
