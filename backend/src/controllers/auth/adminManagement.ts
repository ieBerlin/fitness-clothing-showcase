import { Request, Response } from "express";
import { isValidName } from "../../utils/validators";
import Admin, { IAdmin } from "../../models/Admin";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import { ValidationError } from "../../utils/ValidationError";
import { isValidObjectId } from "mongoose";
import { createNotification } from "../../utils/createNotification";
import NotificationTitle from "../../enums/NotificationTitle";
import { INotification } from "../../models/Notification";
import getNotificationMessage from "../../utils/getNotificationMessage";
async function handleAdminUpdateNotifications(
  previousRole: string,
  newRole: string,
  previousStatus: string,
  newStatus: string,
  senderId: string,
  data: IAdmin
) {
  console.log({
    previousRole,
    newRole,
    previousStatus,
    newStatus,
    senderId,
    data,
  });
  if (previousRole !== newRole) {
    if (newRole === "admin") {
      await createNotification({
        senderId,
        title: NotificationTitle.DOWNGRADE_ADMIN_BY_MANAGER,
        message: getNotificationMessage(
          NotificationTitle.DOWNGRADE_ADMIN_BY_MANAGER,
          data
        ),
        isRead: false,
        createdAt: new Date(),
      } as INotification);
    } else if (newRole === "manager") {
      await createNotification({
        senderId,
        title: NotificationTitle.UPGRADE_ADMIN_BY_MANAGER,
        message: getNotificationMessage(
          NotificationTitle.UPGRADE_ADMIN_BY_MANAGER,
          data
        ),
        isRead: false,
        createdAt: new Date(),
      } as INotification);
    
    }
  }

  if (previousStatus !== newStatus) {
    if (newStatus === "suspended") {
      await createNotification({
        senderId,
        title: NotificationTitle.SUSPEND_ADMIN_BY_MANAGER,
        message: getNotificationMessage(
          NotificationTitle.SUSPEND_ADMIN_BY_MANAGER,
          data
        ),
        isRead: false,
        createdAt: new Date(),
      } as INotification);
    } else if (newStatus === "deleted") {
      await createNotification({
        senderId,
        title: NotificationTitle.DELETE_ADMIN_BY_MANAGER,
        message: getNotificationMessage(
          NotificationTitle.DELETE_ADMIN_BY_MANAGER,
          data
        ),
        isRead: false,
        createdAt: new Date(),
      } as INotification);
    } else if (newStatus === "active") {
      await createNotification({
        senderId,
        title: NotificationTitle.ACTIVE_ADMIN_BY_MANAGER,
        message: getNotificationMessage(
          NotificationTitle.ACTIVE_ADMIN_BY_MANAGER,
          data
        ),
        isRead: false,
        createdAt: new Date(),
      } as INotification);
    }
  }
}

export default async function updateProfile(req: Request, res: Response) {
  try {
    const { fullName, role, status } = req.body;
    const { adminId } = req.params;

    const errors: ValidationError[] = [];
    if (!isValidObjectId(adminId)) {
      errors.push({ field: "adminId", message: "Admin ID is required" });
    }
    if (!isValidName(fullName)) {
      errors.push({
        field: "fullName",
        message: "Full Name must be at least 8 characters long!",
      });
    }
    if (role && role !== "manager" && role !== "admin") {
      errors.push({
        field: "role",
        message: "Invalid role",
      });
    }

    if (
      status &&
      status !== "active" &&
      status !== "suspended" &&
      status !== "deleted"
    ) {
      errors.push({
        field: "status",
        message: "Invalid status",
      });
    }

    if (errors.length > 0) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors,
      };
      return res.status(400).json(errorResponse);
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        errors: [{ field: "adminId", message: "Admin not found" }],
      });
    }
    const previousRole = admin.role;
    const previousStatus = admin.status;
    await Admin.findByIdAndUpdate(
      adminId,
      { fullName, status, role, updatedAt: new Date() },
      { new: true }
    );
    const senderId = res.locals.admin.adminId;
    await handleAdminUpdateNotifications(
      previousRole,
      role,
      previousStatus,
      status,
      senderId,
      admin
    );

    const successResponse: SuccessResponse = {
      success: true,
    };
    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error updating profile:", error);
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "An error occurred." }],
    };
    return res.status(500).json(errorResponse);
  }
}
