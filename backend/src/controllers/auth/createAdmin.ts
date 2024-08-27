import { Request, Response } from "express";
import {
  ErrorCode,
  ErrorSeverity,
  ValidationError,
} from "../../utils/ValidationError";
import { SuccessResponse } from "../../utils/SuccessResponse";
import { emailValidator, passwordValidator } from "../../utils/validators";
import {
  createAdmin as addAdmin,
  AdminData,
  doesAdminExist,
} from "../../services/adminService";

const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const errors: ValidationError[] = [];

    // Validate email
    if (!email || typeof email !== "string" || !emailValidator(email)) {
      errors.push({
        field: "email",
        message: "Invalid email format",
        code: ErrorCode.ValidationError,
        severity: ErrorSeverity.Medium,
      });
    }

    // Validate password
    if (
      !password ||
      typeof password !== "string" ||
      !passwordValidator(password)
    ) {
      errors.push({
        field: "password",
        message: "Invalid password format",
        code: ErrorCode.ValidationError,
        severity: ErrorSeverity.Medium,
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    // Check if admin with the given email already exists
    if (await doesAdminExist(email)) {
      return res.status(400).json({
        success: false,
        errors: [
          {
            field: "email",
            message: "Email already in use",
            code: ErrorCode.ValidationError,
            severity: ErrorSeverity.High,
          },
        ],
      });
    }

    // Create new admin
    const data: AdminData = { email, password };
    await addAdmin(data);

    // Respond with success
    const successResponse: SuccessResponse<{ message: string }> = {
      success: true,
      data: { message: "Admin created successfully" },
    };

    return res.status(201).json(successResponse);
  } catch (error) {
    console.error("Error creating admin:", error);

    return res.status(500).json({
      success: false,
      errors: [
        {
          field: "server",
          message: "An unexpected error occurred while creating the admin.",
          code: ErrorCode.ServerError,
          severity: ErrorSeverity.Critical,
        },
      ],
    });
  }
};

export default createAdmin;
