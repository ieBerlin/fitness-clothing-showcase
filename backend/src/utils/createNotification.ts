import Notification, { INotification } from "../models/Notification";
import NotificationType from "../enums/NotificationType";

interface CreateNotificationInput {
  recipientId: string;
  senderId?: string;
  type: NotificationType;
  title: string;
  message: string;
  url?: string;
}

export async function createNotification(
  input: INotification
): Promise<INotification> {
  const { recipientId, senderId, type, title, message, url } = input;

  try {
    const notification = new Notification({
      recipientId,
      senderId,
      type,
      title,
      message,
      url,
      isRead: false,
      createdAt: new Date(),
    });

    const savedNotification = await notification.save();
    return savedNotification;
  } catch (error) {
    throw new Error(`Error creating notification: ${error}`);
  }
}
