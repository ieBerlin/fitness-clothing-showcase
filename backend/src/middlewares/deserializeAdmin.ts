import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt.utils";
import { ErrorResponse } from "../utils/responseInterfaces";

const deserializeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("authHeader")
    const authHeader = req.headers.authorization as string;
    console.log(authHeader)
    const accessToken = authHeader
      ? authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null
      : (req.headers["x-access-token"] as string) || null;
    if (!accessToken) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          { field: "authorization", message: "Access token is required." },
        ],
      };
      return res.status(403).json(errorResponse);
    }

    const { decoded, isExpired, isValid } = await verifyJwt(accessToken);
    if (!isValid || isExpired) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "authorization",
            message: isExpired ? "Token has expired." : "Invalid token.",
          },
        ],
      };
      return res.status(403).json(errorResponse);
    }
    res.locals.admin = decoded;
    next();
  } catch (error) {
    console.log(error);
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "Failed to authenticate token." }],
    };
    return res.status(500).json(errorResponse);
  }
};

export default deserializeAdmin;
