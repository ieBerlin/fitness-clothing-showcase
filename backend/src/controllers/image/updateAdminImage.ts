import { Request, Response } from "express";
import Admin from "../../models/Admin";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import mongoose from "mongoose";
import ErrorSeverity from './../../enums/ErrorSeverity';
import ErrorCode from './../../enums/ErrorCode';

interface MulterRequest extends Request {
  imageName?: string;
}

const updateAdminImage = async (req: MulterRequest, res: Response) => {
  try {
    const imagePath = req.imageName;
    const { adminId } = req.params;

    if (!adminId || !imagePath) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "adminId or imagePath",
            message: "Admin ID and image path are required",
            code: ErrorCode.ValidationError,
            severity: ErrorSeverity.Medium,
          },
        ],
      };
      return res.status(400).json(errorResponse);
    }

    // Validate adminId
    if (!mongoose.isValidObjectId(adminId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "adminId",
            message: "Invalid Admin ID",
            code: ErrorCode.ValidationError,
            severity: ErrorSeverity.Medium,
          },
        ],
      };
      return res.status(400).json(errorResponse);
    }

    // Check if the admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "adminId",
            message: "Admin not found",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.High,
          },
        ],
      };
      return res.status(404).json(errorResponse);
    }

    // Update the admin's image
    await Admin.findByIdAndUpdate(
      adminId,
      { $set: { adminImage: imagePath } },
      { new: true }
    );

    const successResponse: SuccessResponse<{ message: string }> = {
      success: true,
    };

    res.status(200).json(successResponse);
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

export default updateAdminImage;
