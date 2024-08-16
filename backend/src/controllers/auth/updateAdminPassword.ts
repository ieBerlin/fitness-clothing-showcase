import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Admin from "../../models/Admin";
import { passwordValidator } from "../../utils/validators";
import ValidationError from "../../utils/ValidationError";

export default async function updateAdminPassword(req: Request, res: Response) {
  const { email, oldPassword, newPassword } = req.body;
  const errors: ValidationError[] = [];

  // Validate email
  if (!email || typeof email !== "string") {
    errors.push({ field: "email", message: "Email is required and must be a string." });
  }

  // Validate old password
  if (!oldPassword || typeof oldPassword !== "string") {
    errors.push({ field: "oldPassword", message: "Old password is required and must be a string." });
  }

  // Validate new password
  if (!newPassword || typeof newPassword !== "string" || !passwordValidator(newPassword)) {
    errors.push({ field: "newPassword", message: "New password must meet the required criteria." });
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    // Find the admin
    const admin = await Admin.findOne({ adminEmail: email });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }

    // Check if the old password is correct
    const isOldPasswordValid = await bcrypt.compare(oldPassword, admin.adminPassword);

    if (!isOldPasswordValid) {
      return res.status(403).json({ success: false, message: "Old password is incorrect." });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the admin's password
    admin.adminPassword = hashedNewPassword;
    await admin.save();

    return res.status(200).json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ success: false, message: "An error occurred while updating the password." });
  }
}
