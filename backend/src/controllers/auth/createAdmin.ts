import { Request, Response } from "express";
import {
  isValidEmail,
  isValidName,
  isValidPassword,
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
import { createNotification } from "../../utils/createNotification";
import NotificationTitle from "../../enums/NotificationTitle";
import getNotificationMessage from "../../utils/getNotificationMessage";
import { IAdmin } from "../../models/Admin";
import { INotification } from "../../models/Notification";
const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName, status, role } = req.body;
    const errors: ValidationError[] = [];
    if (!isValidEmail(email)) {
      errors.push({
        field: "email",
        message: "Invalid email format",
        code: ErrorCode.ValidationError,
        severity: ErrorSeverity.Medium,
      });
    }

    if (!isValidPassword(password)) {
      errors.push({
        field: "password",
        message: "Invalid password format",
        code: ErrorCode.ValidationError,
        severity: ErrorSeverity.Medium,
      });
    }

    if (!isValidName(fullName)) {
      errors.push({
        field: "fullName",
        message: "Invalid full name format",
        code: ErrorCode.ValidationError,
        severity: ErrorSeverity.Medium,
      });
    }

    if (!role || (role !== "admin" && role !== "manager")) {
      errors.push({
        field: "role",
        message: "Role is required and must be either 'admin' or 'manager'",
        code: ErrorCode.ValidationError,
        severity: ErrorSeverity.Medium,
      });
    }

    if (
      !status ||
      (status !== "active" && status !== "suspended" && status !== "deleted")
    ) {
      errors.push({
        field: "status",
        message:
          "Status is required and must be either 'active', 'suspended', or 'deleted'",
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

    const data: AdminData = {
      adminEmail: email,
      adminPassword: password,
      fullName,
      createdAt: new Date(),
      status,
      role,
    };
    const newAdmin = await addAdmin(data);

    const successResponse: SuccessResponse = {
      success: true,
    };
    const senderId = res.locals.admin.adminId;

    await createNotification({
      senderId,
      title: NotificationTitle.ADD_ADMIN_BY_MANAGER,
      message: getNotificationMessage(NotificationTitle.ADD_ADMIN_BY_MANAGER, {
        _id: newAdmin._id,
        fullName,
        role,
        status,
      } as IAdmin),
      isRead: false,
      createdAt: new Date(),
    } as INotification);

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
