import { Request, Response } from "express";
import Activity, { IActivity } from "../../models/Activity";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import mongoose from "mongoose";
import ErrorSeverity from './../../enums/ErrorSeverity';
import ErrorCode from './../../enums/ErrorCode';

const getSingleActivity = async (req: Request, res: Response) => {
  try {
    const { activityId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(activityId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "activityId",
            message: "Invalid activity ID",
            code: ErrorCode.ValidationError,
            severity: ErrorSeverity.Medium,
          },
        ],
      };
      return res.status(400).json(errorResponse);
    }

    const activity = await Activity.findById(activityId);

    if (!activity) {
      const notFoundResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "activityId",
            message: "Activity not found",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.Medium,
          },
        ],
      };
      return res.status(404).json(notFoundResponse);
    }

    const successResponse: SuccessResponse<IActivity> = {
      success: true,
      data: activity,
    };

    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error fetching activity:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "server",
          message: "Error fetching activity",
          code: ErrorCode.ServerError,
          severity: ErrorSeverity.Critical,
        },
      ],
    };

    return res.status(500).json(errorResponse);
  }
};

export default getSingleActivity;
