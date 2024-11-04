import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/Admin";

dotenv.config();

const JWT_SECRET_KEY: Secret = process.env.JWT_SECRET_KEY as Secret;
if (!JWT_SECRET_KEY) {
  throw new Error("JWT_SECRET_KEY is not defined in environment variables");
}

interface VerificationToken {
  isValid: boolean;
  isExpired: boolean;
  decoded: JwtPayload | null;
  adminId: string;
}

class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenError";
  }
}

export async function verifyJwt(token: string): Promise<VerificationToken> {
  try {
    if (!token) {
      throw new TokenError("Token is required");
    }
    const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      throw new TokenError("Token is expired");
    }

    const admin = await Admin.findOne({ adminEmail: decoded.email }).exec();
    if (!admin) {
      throw new TokenError("Invalid token");
    }

    return {
      isValid: true,
      isExpired: false,
      decoded,
      adminId: admin._id as string,
    };
  } catch (error) {
    // console.log(error);
    if (error instanceof jwt.TokenExpiredError) {
      return {
        isValid: false,
        isExpired: true,
        decoded: null,
        adminId: "",
      };
    } else if (error instanceof jwt.JsonWebTokenError) {
      return {
        isValid: false,
        isExpired: false,
        decoded: null,
        adminId: "",
      };
    } else {
      return {
        isValid: false,
        isExpired: false,
        decoded: null,
        adminId: "",
      };
    }
  }
}

export function signJwt(email: string): string {
  return jwt.sign({ email }, JWT_SECRET_KEY, { expiresIn: "1d" });
}
