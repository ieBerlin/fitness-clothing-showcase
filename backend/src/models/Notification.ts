import { Document, Schema, model } from "mongoose";
import NotificationType from "../enums/NotificationType";

export interface INotification extends Document {
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

const NotificationSchema: Schema = new Schema({
  recipientId: { type: String, required: true },
  senderId: { type: String, required: false },
  type: {
    type: String,
    enum: Object.values(NotificationType),
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  url: { type: String, required: false },
  isRead: { type: Boolean, default: false, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, required: false },
});

const Notification = model<INotification>("Notification", NotificationSchema, "Notifications");

export default Notification;
