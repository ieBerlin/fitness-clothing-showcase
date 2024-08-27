import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Admin from "../../models/Admin";
import { passwordValidator } from "../../utils/validators";
import { ValidationError } from "../../utils/ValidationError";
import { SuccessResponse } from "../../utils/SuccessResponse";
import { ErrorResponse } from "../../utils/responseInterfaces";

export default async function updateAdminPassword(req: Request, res: Response) {
  const { email, oldPassword, newPassword } = req.body;
  const errors: ValidationError[] = [];

  if (!email || typeof email !== "string") {
    errors.push({ field: "email", message: "Email is required and must be a string." });
  }

  if (!oldPassword || typeof oldPassword !== "string") {
    errors.push({ field: "oldPassword", message: "Old password is required and must be a string." });
  }

  if (!newPassword || typeof newPassword !== "string" || !passwordValidator(newPassword)) {
    errors.push({ field: "newPassword", message: "New password must meet the required criteria." });
  }

  if (errors.length > 0) {
    const errorResponse: ErrorResponse = {
      success: false,
      errors,
    };
    return res.status(400).json(errorResponse);
  }

  try {
    const admin = await Admin.findOne({ adminEmail: email });

    if (!admin) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [{ field: "email", message: "Admin not found." }],
      };
      return res.status(404).json(errorResponse);
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, admin.adminPassword);

    if (!isOldPasswordValid) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [{ field: "oldPassword", message: "Old password is incorrect." }],
      };
      return res.status(403).json(errorResponse);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    admin.adminPassword = hashedNewPassword;
    await admin.save();

    const successResponse: SuccessResponse = {
      success: true,
      data: { message: "Password updated successfully." },
    };
    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error updating password:", error);
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "An error occurred while updating the password." }],
    };
    return res.status(500).json(errorResponse);
  }
}
