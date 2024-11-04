import { Request, Response, NextFunction } from "express";
import Admin from "../models/Admin";
import { ErrorResponse } from "../utils/responseInterfaces";

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  const adminEmail = res.locals.admin.email;

  try {
    const adminExist = await Admin.findOne({ adminEmail });

    if (!adminExist) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          { field: "authorization", message: "Unauthorized Admin Access!" },
        ],
      };
      return res.status(403).json(errorResponse);
    }

    if (adminExist.status !== "active") {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          { field: "authorization", message: "Admin access is not active." },
        ],
      };
      return res.status(403).json(errorResponse);
    }

    next();
  } catch (error) {
    console.error("Error checking admin access:", error);
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "An error occurred." }],
    };
    return res.status(500).json(errorResponse);
  }
};

export default adminAuth;
