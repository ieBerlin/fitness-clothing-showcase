import { Document, model, Schema } from "mongoose";

export interface IAdmin extends Document {
  adminEmail: string;
  adminPassword: string;
  adminImage?: string;
  fullName: string;
  role: "admin" | "manager";
  status: "active" | "suspended" | "deleted";
  createdAt: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
}

const AdminSchema: Schema = new Schema({
  adminEmail: { type: String, required: true, unique: true },
  adminPassword: { type: String, required: true },
  adminImage: { type: String },
  fullName: { type: String, required: true },
  role: { type: String, required: true, default: "admin" },
  status: {
    type: String,
    enum: ["active", "suspended", "deleted"],
    default: "active",
  },
  lastLoginAt: { type: Date },
  createdAt: { type: Date },
  updatedAt: { type: Date },
});

const Admin = model<IAdmin>("Admin", AdminSchema, "Admin");

export default Admin;
