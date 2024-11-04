import Notification, { INotification } from "../models/Notification";

export async function createNotification(
  input: INotification
): Promise<INotification> {
  try {
    const notification = new Notification(input);
    const savedNotification = await notification.save();
    return savedNotification;
  } catch (error) {
    throw new Error(`Error creating notification: ${error}`);
  }
}
