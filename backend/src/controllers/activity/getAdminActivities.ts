import { Request, Response } from "express";
import Notification,{ INotification } from "../../models/Notification";
import {
  ErrorResponse,
  ItemsResponse,
  SuccessResponse,
} from "../../utils/responseInterfaces";
import Admin from "../../models/Admin";

const getAllActivities = async (req: Request, res: Response) => {
  try {
    const adminId = await Admin.findOne({ adminEmail: res.locals.admin.email });
    const { page = 1, limit = 10 } = req.query;
    const filter: any = {};

    if (adminId) {
      filter.adminId = adminId;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const activities = await Notification.find(filter)
      .sort({ timestamp: -1 }) // Sort by latest activities first
      .skip(skip)
      .limit(Number(limit));

    const totalActivities = await Notification.countDocuments(filter);

    const successResponse: SuccessResponse<ItemsResponse<INotification>> = {
      success: true,
      data: {
        items: activities,
        totalItems: totalActivities,
        currentPage: Number(page),
        totalPages: Math.ceil(totalActivities / Number(limit)),
      },
    };

    res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error fetching activities:", error);
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "Error fetching activities" }],
    };
    res.status(500).json(errorResponse);
  }
};

export default getAllActivities;
