import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils/responseInterfaces";
import Admin from "../models/Admin";

export const managerAuth = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const managerEmail = res.locals?.admin?.email;

  try {
    const manager = await Admin.findOne({ adminEmail: managerEmail });

    if (manager?.role === "manager") {
      return next();
    }

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "authentication",
          message: "Unauthorized: Manager access only",
        },
      ],
    };
    return res.status(403).json(errorResponse);
  } catch (error) {
    console.error("Error in managerAuth middleware:", error);
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "authentication",
          message: "Unauthorized: Manager access only",
        },
      ],
    };
    return res.status(403).json(errorResponse);
  }
};
