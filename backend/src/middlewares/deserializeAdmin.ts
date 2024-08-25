import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt.utils";

const deserializeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the token from the Authorization header or x-access-token header
    const authHeader = req.headers.authorization as string;
    const accessToken = authHeader
      ? authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null
      : (req.headers["x-access-token"] as string) || null;

    if (!accessToken) {
      return res
        .status(403)
        .json({ success: false, message: "Access token is required." });
    }

    // Verify the token
    const { decoded, isValid, isExpired } = await verifyJwt(accessToken);
    // Check if the token is valid and not expired
    if (!isValid || isExpired) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired token." });
    }

    res.locals.admin = decoded;
    next();
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return res
      .status(403)
      .json({ success: false, message: "Failed to authenticate token." });
  }
};

export default deserializeAdmin;
