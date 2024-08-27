import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import { ErrorResponse } from '../utils/responseInterfaces';

const deserializeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization as string;
    const accessToken = authHeader
      ? authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null
      : (req.headers["x-access-token"] as string) || null;

    if (!accessToken) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [{ field: "authorization", message: "Access token is required." }],
      };
      return res.status(403).json(errorResponse);
    }

    const { decoded, isValid, isExpired } = await verifyJwt(accessToken);

    if (!isValid || isExpired) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [{ field: "authorization", message: "Invalid or expired token." }],
      };
      return res.status(403).json(errorResponse);
    }

    res.locals.admin = decoded;
    next();
  } catch (error) {
    console.error("Error verifying JWT:", error);
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "Failed to authenticate token." }],
    };
    return res.status(500).json(errorResponse);
  }
};

export default deserializeAdmin;
