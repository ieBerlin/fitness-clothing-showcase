import { Request, Response } from "express";
import { emailValidator, passwordValidator } from "../../utils/validators";
import bcrypt from "bcrypt";
import { signJwt } from "../../utils/jwt.utils";
import Admin from "../../models/Admin";
import { SuccessResponse } from "../../utils/SuccessResponse";
import { ErrorResponse } from "../../utils/responseInterfaces";
import { ValidationError } from "../../utils/ValidationError";

export default async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const errors: ValidationError[] = [];

  if (!email || typeof email !== "string" || !emailValidator(email)) {
    errors.push({ field: "email", message: "Valid email is required!" });
  }

  if (
    !password ||
    typeof password !== "string" ||
    !passwordValidator(password)
  ) {
    errors.push({
      field: "password",
      message: "Password must be at least 6 characters long!",
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
    const admin = await Admin.findOne({ adminEmail: email });

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
    const successResponse: SuccessResponse = {
      success: true,
      data: { token },
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
