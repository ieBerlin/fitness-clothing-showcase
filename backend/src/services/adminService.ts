import bcrypt from "bcrypt";
import Admin from "../models/Admin";
const saltRounds = 10;

export interface AdminData {
  adminEmail: string;
  adminPassword: string;
  adminImage?: string;
  fullName: string;
  role?: "admin" | "manager";
  status?: "active" | "suspended" | "deleted";
  createdAt?: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
}

export async function doesAdminExist(email: string): Promise<boolean> {
  try {
    const admin = await Admin.findOne({ adminEmail: email }).exec();
    return !!admin;
  } catch (error) {
    console.error("Error checking admin existence:", error);
    throw new Error("Unable to check admin existence. Please try again later.");
  }
}

// Promise<Admin>
export async function createAdmin(adminData: AdminData) {
  const { adminEmail: email, adminPassword: plaintextPassword } = adminData;

  try {
    const hashedPassword = await hashPassword(plaintextPassword);
    const existingAdmin = await doesAdminExist(email);
    if (existingAdmin) {
      throw new Error("Admin with this email already exists.");
    }
    return await Admin.create({
      adminEmail: email,
      adminPassword: hashedPassword,
    });
    // const newAdmin = await Admin.create({
    //   adminEmail: email,
    //   adminPassword: hashedPassword,
    // });

    // return newAdmin;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw new Error("Error occured");
  }
}
export default async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}
