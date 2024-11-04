import { Request, Response } from "express";
import Notification, { INotification } from "../../models/Notification";
import {
  ErrorResponse,
  ItemsResponse,
  SuccessResponse,
} from "../../utils/responseInterfaces";

const getNotifications = async (req: Request, res: Response) => {
  try {
    const { search, page = 1, limit = 10, startDate, endDate } = req.query;
    console.log(req.query);
    const isRead: boolean | null =
      req.query.isRead !== undefined ? req.query.isRead === "true" : null;

    const filter: {
      title?: { $regex: string; $options: string };
      isRead?: boolean;
      createdAt?: { $gte: Date; $lte: Date };
    } = {};
    if (search) {
      filter.title = { $regex: search as string, $options: "i" };
    }

    if (isRead !== null) {
      filter.isRead = isRead;
    }

    if (startDate || endDate) {
      const start = startDate
        ? new Date(startDate as string)
        : new Date("1970-01-01");
      const end = endDate ? new Date(endDate as string) : new Date();

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          errors: [{ field: "date", message: "Invalid date format" }],
        });
      }

      filter.createdAt = { $gte: start, $lte: end };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const totalNotifications = await Notification.countDocuments(filter);

    const successResponse: SuccessResponse<ItemsResponse<INotification>> = {
      success: true,
      data: {
        items: notifications,
        totalItems: totalNotifications,
        currentPage: Number(page),
        totalPages: Math.ceil(totalNotifications / Number(limit)),
      },
    };

    res.status(200).json(successResponse);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "Error fetching notifications" }],
    };

    res.status(500).json(errorResponse);
  }
};

export default getNotifications;
