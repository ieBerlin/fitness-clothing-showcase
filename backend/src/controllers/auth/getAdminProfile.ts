import { Request, Response } from "express";
import Admin, { IAdmin } from "../../models/Admin";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import { AdminData } from "../../services/adminService";

interface SanitizedAdmin extends Omit<AdminData, "adminPassword"> {
  adminId: string;
}

const getAdminProfile = async (req: Request, res: Response) => {
  try {
    // Validate if the email exists
    const adminEmail = res.locals?.admin?.email;
    if (!adminEmail) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [{ field: "email", message: "No admin email provided." }],
      };
      return res.status(400).json(errorResponse);
    }

    const admin = await Admin.findOne({
      adminEmail,
    });

    if (!admin) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "adminId",
            message: "No admin found with the provided email.",
          },
        ],
      };
      return res.status(404).json(errorResponse);
    }

    // Sanitize the admin object by excluding the password
    const sanitizedAdmin: SanitizedAdmin = {
      adminId: admin._id as unknown as string,
      adminEmail: admin.adminEmail,
      adminImage: admin.adminImage,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      lastLoginAt: admin.lastLoginAt,
      fullName: admin.fullName,
      status: admin.status,
      role: admin.role,
    };

    const successResponse: SuccessResponse<SanitizedAdmin> = {
      success: true,
      data: sanitizedAdmin,
    };

    return res.status(200).json(successResponse);
  } catch (error) {
    console.error(
      `Error fetching admin with email ${res.locals?.admin?.email}:`,
      error
    );

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "server",
          message: "An error occurred while fetching the admin profile.",
        },
      ],
    };

    return res.status(500).json(errorResponse);
  }
};

export default getAdminProfile;
