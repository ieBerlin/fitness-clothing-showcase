import { Request, Response } from "express";
import {
  ErrorResponse,
  ItemsResponse,
  SuccessResponse,
} from "../../utils/responseInterfaces";
import Notification, { INotification } from "../../models/Notification";

const getAllActivities = async (req: Request, res: Response) => {
  try {
    const {
      activityType,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const filter: any = {};

    if (activityType) {
      const activityTypesArray = Array.isArray(activityType)
        ? activityType
        : [activityType];
      filter.title = { $in: activityTypesArray };
    }

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate as string) : undefined;
      const end = endDate ? new Date(endDate as string) : undefined;

      if ((start && isNaN(start.getTime())) || (end && isNaN(end.getTime()))) {
        return res.status(400).json({
          success: false,
          errors: [{ field: "date", message: "Invalid date format" }],
        });
      }

      if (start) {
        filter.createdAt = { ...filter.createdAt, $gte: start };
      }
      if (end) {
        filter.createdAt = { ...filter.createdAt, $lte: end };
      }
    }


    const skip = (Number(page) - 1) * Number(limit);
    const activities = await Notification.find(filter)
    .sort({ createdAt: -1 })
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
