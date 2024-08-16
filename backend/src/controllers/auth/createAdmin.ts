import { Request, Response } from "express";
import ValidationError from "../../utils/ValidationError";
import { emailValidator, passwordValidator } from "../../utils/validators";
import {
  createAdmin as addAdmin,
  AdminData,
  doesAdminExist,
} from "../../services/adminService";

const createAdmin = async (req: Request, res: Response) => {
  try {
    console.log(res.locals.admin)
    const { email, password } = req.body;

    const errors: ValidationError[] = [];

    if (!email || typeof email !== "string" || !emailValidator(email)) {
      errors.push({ field: "email", message: "Invalid email" });
    }

    if (
      !password ||
      typeof password !== "string" ||
      !passwordValidator(password)
    ) {
      errors.push({ field: "password", message: "Invalid password" });
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    if (await doesAdminExist(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    const data: AdminData = {
      email,
      password,
    };

    await addAdmin(data);

    res
      .status(201)
      .json({ success: true, message: "Admin created successfully" });
  } catch (error) {
    // console.error("Error creating admin:", error || "Error creating admin");
    res.status(500).json({ success: false, message: "Error creating admin" });
  }
};

export default createAdmin;
