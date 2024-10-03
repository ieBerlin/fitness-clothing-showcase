import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import Admin from "../../models/Admin";
import { SuccessResponse } from "../../utils/responseInterfaces";
import ErrorSeverity from "./../../enums/ErrorSeverity";
import ErrorCode from "./../../enums/ErrorCode";
const deleteAdminImage = async (req: Request, res: Response) => {
  try {
    const adminEmail = res.locals.admin.email;
    const admin = await Admin.findOne({ adminEmail });
    if (!admin) {
      return res.status(404).json({
        success: false,
        errors: [
          {
            field: "adminId",
            message: "Admin not found.",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.High,
          },
        ],
      });
    }
    if (!admin.adminImage) {
      return res.status(404).json({
        success: false,
        errors: [
          {
            field: "adminImage",
            message: "Admin Image not found.",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.High,
          },
        ],
      });
    }

    const imagePath = path.join(
      __dirname,
      "../../../public/uploads/admin",
      admin.adminImage
    );

    // Attempt to delete the image file
    try {
      await fs.unlink(imagePath);
    } catch (fileError) {
      console.error("Error deleting image file:", fileError);
      return res.status(500).json({
        success: false,
        errors: [
          {
            field: "file",
            message: "Failed to delete image file.",
            code: ErrorCode.ServerError,
            severity: ErrorSeverity.Critical,
          },
        ],
      });
    }

    admin.adminImage = "";
    await admin.save();

    const successResponse: SuccessResponse = {
      success: true,
    };

    return res.status(200).json(successResponse);
  } catch (dbError) {
    console.error("Error deleting admin image:", dbError);
    return res.status(500).json({
      success: false,
      errors: [
        {
          field: "server",
          message: "Failed to delete admin image.",
          code: ErrorCode.ServerError,
          severity: ErrorSeverity.Critical,
        },
      ],
    });
  }
};

export default deleteAdminImage;
