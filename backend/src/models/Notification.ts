import { Document, Schema, model } from "mongoose";
import NotificationTitle from "../enums/NotificationTitle";

export interface INotification extends Document {
  recipientId?: string;
  senderId?: string;
  title: NotificationTitle;
  message: string;
  url?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

const NotificationSchema: Schema = new Schema({
  recipientId: { type: String },
  senderId: { type: String, required: false },
  title: {
    enum: Object.values(NotificationTitle),
    type: String,
    required: true,
  },
  message: { type: String, required: true },
  url: { type: String, required: false },
  isRead: { type: Boolean, default: false, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  updatedAt: { type: Date, required: false },
});

const Notification = model<INotification>(
  "Notification",
  NotificationSchema,
  "Notifications"
);

export default Notification;
