import { Request, Response, NextFunction } from "express";
import Admin from "../models/Admin";

const adminAuth = async (_: Request, res: Response, next: NextFunction) => {
  const adminId = res.locals.admin.id;
  try {
    const adminExist = await Admin.findById(adminId);
    if (!adminExist) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized Admin Access!" });
    }
    next();
  } catch (error) {
    // console.error("Error checking admin access:", error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred." });
  }
};

export default adminAuth;
