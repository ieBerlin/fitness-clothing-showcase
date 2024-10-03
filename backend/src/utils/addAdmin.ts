import Admin from "../models/Admin";
import hashPassword, { createAdmin } from "../services/adminService";
import { emailValidator, passwordValidator } from "./validators";
import bcrypt from "bcrypt";

async function addAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const fullname = process.env.ADMIN_FULLNAME || "Manager";
  if (!email || !password) {
    throw new Error("Admin credentials (email and/or password) are missing.");
  }

  if (!emailValidator(email)) {
    throw new Error("The provided email address is invalid.");
  }

  if (!passwordValidator(password)) {
    throw new Error(
      "The provided password does not meet the required criteria."
    );
  }

  const existingAdmin = await Admin.findOne({ adminEmail: email });
  if (existingAdmin) {
    console.log("Admin already exists.");
    return;
  }
  await createAdmin({
    adminEmail: email,
    adminPassword: password,
    fullName: fullname,
    status: "active",
    role: "manager",
  });

  console.log("Admin successfully added.");
}

export default addAdmin;
