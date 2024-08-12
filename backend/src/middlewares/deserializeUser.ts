import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt.utils";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken =
    // req.headers.authorization ||
    req.headers["x-access-token"] as string;
  // .replace(/^Bearer\s/, "").trim();
  if (!accessToken) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized User!" });
  }
  const { decoded, isValid, isExpired } = await verifyJwt(accessToken);
  if (!isValid || isExpired) {
    return res
      .status(403)
      .json({ success: false, message: "Unauthorized User!" });
  }

  res.locals.user = decoded;
  next();
};

export default deserializeUser;
