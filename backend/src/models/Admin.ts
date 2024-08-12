import { Document, model, Schema } from "mongoose";

interface IAdmin extends Document {
  adminId: string;
  adminEmail: string;
  adminPassword: string;
}

const AdminSchema: Schema = new Schema({
  adminId: { type: String, required: true, unique: true },
  adminEmail: { type: String, required: true, unique: true },
  adminPassword: { type: String, required: true },
});

const Admin = model<IAdmin>("Admin", AdminSchema, "Admin");

export default Admin;
