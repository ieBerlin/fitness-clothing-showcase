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
}

export async function verifyJwt(token: string): Promise<VerificationToken> {
  if (!token) {
    return {
      isValid: false,
      isExpired: true,
      decoded: null,
    };
  }
  const decoded = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
  const admin = await Admin.findOne({ adminEmail: decoded.email }).exec();
  if (!admin) {
    return {
      isValid: false,
      isExpired: true,
      decoded: null,
    };
  }

  return {
    isValid: true,
    isExpired: false,
    decoded: { ...decoded, id: admin._id },
  };
}

export function signJwt(email: string): string {
  return jwt.sign(
    { email },
    JWT_SECRET_KEY,
    { expiresIn: "24h" } // Use a more common time format for expiration
  );
}
