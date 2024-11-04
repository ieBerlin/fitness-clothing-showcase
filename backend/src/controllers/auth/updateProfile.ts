import { Request, Response } from "express";
import { isValidName } from "../../utils/validators";
import Admin from "../../models/Admin";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import { ValidationError } from "../../utils/ValidationError";

export default async function updateProfile(req: Request, res: Response) {
  const { fullName } = req.body;
  const errors: ValidationError[] = [];

  if (!isValidName(fullName)) {
    errors.push({
      field: "fullName",
      message: "Full Name must be at least 8 characters long!",
    });
  }

  if (errors.length > 0) {
    const errorResponse: ErrorResponse = {
      success: false,
      errors,
    };
    return res.status(400).json(errorResponse);
  }

  try {
    const admin = await Admin.findOne({
      adminEmail: { $regex: new RegExp(`^${res.locals.admin.email}$`, "i") },
    });

    if (!admin) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [{ field: "authentication", message: "Unauthorized Request!" }],
      };
      return res.status(403).json(errorResponse);
    }

    await Admin.findOneAndUpdate(
      { adminEmail: res.locals.admin.email },
      { fullName, lastLoginAt: new Date(), updatedAt: new Date() },
      { new: true }
    );

    const successResponse: SuccessResponse = {
      success: true,
    };
    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error logging in:", error);
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "An error occurred." }],
    };
    return res.status(500).json(errorResponse);
  }
}
