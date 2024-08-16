import { Document, model, Schema } from "mongoose";

export interface IAdmin extends Document {
  adminEmail: string;
  adminPassword: string;
  adminImage: string;
}

const AdminSchema: Schema = new Schema({
  adminEmail: { type: String, required: true, unique: true },
  adminPassword: { type: String, required: true },
  adminImage: { type: String },
});

const Admin = model<IAdmin>("Admin", AdminSchema, "Admin");

export default Admin;
