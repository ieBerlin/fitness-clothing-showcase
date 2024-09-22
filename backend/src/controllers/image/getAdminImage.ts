import { Request, Response } from "express";
import Admin from "../../models/Admin";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import ErrorSeverity from "../../enums/ErrorSeverity";
import ErrorCode from "../../enums/ErrorCode";

const getAdminImage = async (_: Request, res: Response) => {
  try {
    const adminEmail = res.locals.admin.email;

    const admin = await Admin.findOne({ adminEmail });
    if (!admin) {
      return res.status(404).json({
        success: false,
        errors: [
          {
            field: "admin",
            message: "Admin not found",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.High,
          },
        ],
      });
    }
    const successResponse: SuccessResponse<string> = {
      success: true,
      data: admin.adminImage,
    };

    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error updating admin image:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "server",
          message: "Failed to update admin image",
          code: ErrorCode.ServerError,
          severity: ErrorSeverity.Critical,
        },
      ],
    };

    res.status(500).json(errorResponse);
  }
};

export default getAdminImage;
