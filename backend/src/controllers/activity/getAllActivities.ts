import { Request, Response } from "express";
import Activity, { IActivity } from "../../models/Activity";
import {
  ErrorResponse,
  ItemsResponse,
  SuccessResponse,
} from "../../utils/responseInterfaces";

const getAllActivities = async (req: Request, res: Response) => {
  try {
    const {
      adminId,
      activityType,
      entityType,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;
    const filter: any = {};
    if (adminId) {
      filter.adminId = adminId;
    }

    if (activityType) {
      const activityTypesArray = Array.isArray(activityType)
        ? activityType
        : [activityType];
      filter.activityType = { $in: activityTypesArray };
    }

    if (entityType) {
      const entityTypesArray = Array.isArray(entityType)
        ? entityType
        : [entityType];
      filter.entityType = { $in: entityTypesArray };
    }
    if (startDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        filter.timestamp = { $gte: start, $lte: end };
      } else if (!isNaN(start.getTime())) {
        filter.timestamp = { $gte: start };
      } else {
        return res.status(400).json({
          success: false,
          errors: [{ field: "date", message: "Invalid date format" }],
        });
      }
    }

    const skip = (Number(page) - 1) * Number(limit);

    const activities = await Activity.find(filter)
      .sort({ timestamp: -1 }) // Sort by latest activities first
      .skip(skip)
      .limit(Number(limit));

    const totalActivities = await Activity.countDocuments(filter);

    const successResponse: SuccessResponse<ItemsResponse<IActivity>> = {
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
