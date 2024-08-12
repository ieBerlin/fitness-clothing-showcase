import bcrypt from "bcrypt";
import Admin from "../models/Admin";
const saltRounds = 10;

export interface AdminData {
  email: string;
  password: string;
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
  const { email, password: plaintextPassword } = adminData;

  try {
    const hashedPassword = await bcrypt.hash(plaintextPassword, saltRounds);
    const existingAdmin = await doesAdminExist(email);
    if (existingAdmin) {
      throw new Error("Admin with this email already exists.");
    }

    // Create the admin
    const newAdmin = await Admin.create({
      adminId: new Date().getTime().toString(),
      adminEmail: email,
      adminPassword: hashedPassword,
    });

    return newAdmin;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw new Error(
      "Error creating admin: " + (error as Error).message ||
        "Something went wrong"
    );
  }
}
