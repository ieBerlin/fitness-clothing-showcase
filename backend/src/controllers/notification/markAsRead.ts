import { Request, Response } from "express";
import Notification from "../../models/Notification";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";

const markAsRead = async (req: Request, res: Response) => {
  try {
    const { notificationIds } = req.body;

    if (
      !notificationIds ||
      !Array.isArray(notificationIds) ||
      notificationIds.length === 0
    ) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "notificationIds",
            message: "No notification IDs provided or invalid format.",
          },
        ],
      };
      return res.status(400).json(errorResponse);
    }

    const result = await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { $set: { isRead: true } }
    );

    if (result.modifiedCount === 0) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          { field: "server", message: "No notifications were marked as read." },
        ],
      };
      return res.status(404).json(errorResponse);
    }

    const successResponse: SuccessResponse<null> = {
      success: true,
    };

    res.status(200).json(successResponse);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        { field: "server", message: "Error marking notifications as read." },
      ],
    };

    res.status(500).json(errorResponse);
  }
};

export default markAsRead;
