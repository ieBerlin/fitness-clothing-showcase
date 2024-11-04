import Admin from "../models/Admin";
import { createAdmin } from "../services/adminService";
import { isValidEmail, isValidPassword } from "./validators";

async function addManager(): Promise<void> {
  const email = process.env.MANAGER_EMAIL;
  const password = process.env.MANAGER_PASSWORD;
  const fullname = process.env.MANAGER_FULLNAME || "Manager";
  if (!email || !password) {
    throw new Error("Manager credentials (email and/or password) are missing.");
  }

  if (!isValidEmail(email)) {
    throw new Error("The provided email address is invalid.");
  }

  if (!isValidPassword(password)) {
    throw new Error(
      "The provided password does not meet the required criteria."
    );
  }

  const existingManager = await Admin.findOne({ adminEmail: email });
  if (existingManager) {
    console.log("Manager already exists.");
    return;
  }
  await createAdmin({
    adminEmail: email,
    adminPassword: password,
    fullName: fullname,
    status: "active",
    role: "manager",
    createdAt: new Date(),
    lastLoginAt: new Date(),
  });

  console.log("Admin successfully added.");
}

export default addManager;
