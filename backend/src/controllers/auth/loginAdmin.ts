import { Request, Response } from "express";
import { emailValidator, passwordValidator } from "../../utils/validators";
import bcrypt from "bcrypt";
import { signJwt } from "../../utils/jwt.utils";
import ValidationError from "../../utils/ValidationError";
import Admin from "../../models/Admin";

export default async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const errors: ValidationError[] = [];

  if (!email || typeof email !== "string" || !emailValidator(email)) {
    errors.push({ field: "email", message: "Valid email is required!" });
  }
  if (
    !password ||
    typeof password !== "string" ||
    !passwordValidator(password)
  ) {
    errors.push({
      field: "password",
      message: "Password must be at least 6 characters long!",
    });
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    const admin = await Admin.findOne({ adminEmail: email });
    if (!admin) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized Request!" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.adminPassword);
    if (!isPasswordValid) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized Request!" });
    }
    const token = signJwt(email);
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Error logging in:", error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred." });
  }
}
