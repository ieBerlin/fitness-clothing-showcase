import { Request, Response } from "express";
import { isValidEmail, isValidPassword } from "../../utils/validators";
import bcrypt from "bcrypt";
import { signJwt } from "../../utils/jwt.utils";
import Admin from "../../models/Admin";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import { ValidationError } from "../../utils/ValidationError";

export default async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const errors: ValidationError[] = [];

  if (!isValidEmail(email)) {
    errors.push({ field: "email", message: "Valid email is required!" });
  }

  if (!isValidPassword(password)) {
    errors.push({
      field: "password",
      message: "Valid password is required!",
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
      adminEmail: { $regex: new RegExp(`^${email}$`, "i") },
    });

    if (!admin) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [{ field: "authentication", message: "Unauthorized Request!" }],
      };
      return res.status(403).json(errorResponse);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.adminPassword);

    if (!isPasswordValid) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [{ field: "authentication", message: "Unauthorized Request!" }],
      };
      return res.status(403).json(errorResponse);
    }

    const token = signJwt(email);
    if (admin.status !== "active") {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "authentication",
            message: `Your account has been ${admin.status}. Please contact support.`,
          },
        ],
      };
      return res.status(401).json(errorResponse);
    }
    const successResponse: SuccessResponse<{ token: string; status: string }> =
      {
        success: true,
        data: {
          token,
          status: admin.status,
        },
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
