import { Request, Response } from "express";
import Admin from "../../models/Admin";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import ErrorSeverity from "./../../enums/ErrorSeverity";
import ErrorCode from "./../../enums/ErrorCode";

interface MulterRequest extends Request {
  imageName?: string;
}

const updateAdminImage = async (req: MulterRequest, res: Response) => {
  try {
    const imagePath = req.imageName;
    const adminEmail = res.locals.admin.email;

    const admin = await Admin.findOne({ adminEmail });
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
      admin._id,
      { $set: { adminImage: imagePath } },
      { new: true }
    );
    const successResponse: SuccessResponse = {
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
