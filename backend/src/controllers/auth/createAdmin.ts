import { Request, Response } from "express";
import {
  emailValidator,
  isValidName,
  passwordValidator,
} from "../../utils/validators";
import { SuccessResponse } from "./../../utils/responseInterfaces";
import ErrorSeverity from "../../enums/ErrorSeverity";
import ErrorCode from "../../enums/ErrorCode";
import {
  createAdmin as addAdmin,
  AdminData,
  doesAdminExist,
} from "../../services/adminService";
import { ValidationError } from "../../utils/ValidationError";
import { IAdmin } from "../../models/Admin";
const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;

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

    if (!fullName || typeof fullName !== "string" || !isValidName(fullName)) {
      errors.push({
        field: "fullName",
        message: "Invalid full name format",
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
    const data: AdminData = {
      adminEmail: email,
      adminPassword: password,
      fullName: fullName,
    };
    await addAdmin(data);

    const successResponse: SuccessResponse = {
      success: true,
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
