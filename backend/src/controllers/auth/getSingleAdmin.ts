import { Request, Response } from "express";
import Admin, { IAdmin } from "../../models/Admin";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import { isValidObjectId } from "mongoose";

const getSingleAdmin = async (req: Request, res: Response) => {
  try {
    const { adminId } = req.params;
    if (!isValidObjectId(adminId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [{ field: "adminId", message: "Admin ID is required" }],
      };
      return res.status(400).json(errorResponse);
    }

    const admin = await Admin.findById(adminId).select("-adminPassword");

    if (!admin) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [{ field: "adminId", message: "Admin not found" }],
      };
      return res.status(404).json(errorResponse);
    }

    const successResponse: SuccessResponse<IAdmin> = {
      success: true,
      data: admin,
    };

    res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error fetching admin:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "Error fetching admin" }],
    };

    res.status(500).json(errorResponse);
  }
};

export default getSingleAdmin;
