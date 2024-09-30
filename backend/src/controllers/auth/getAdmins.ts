import { Request, Response } from "express";
import {
  ErrorResponse,
  ItemsResponse,
  SuccessResponse,
} from "../../utils/responseInterfaces";
import Admin, { IAdmin } from "../../models/Admin";

const getAdmins = async (req: Request, res: Response) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const filter: any = {};

    if (search) {
      filter.$or = [{ adminEmail: { $regex: search, $options: "i" } }];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const admins = await Admin.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .select("-adminPassword")
      .sort({ createdAt: -1 });

    const totalAdmins = await Admin.countDocuments(filter);

    const successResponse: SuccessResponse<ItemsResponse<IAdmin>> = {
      success: true,
      data: {
        items: admins,
        totalItems: totalAdmins,
        currentPage: Number(page),
        totalPages: Math.ceil(totalAdmins / Number(limit)),
      },
    };

    res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error fetching admins:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "Error fetching admins" }],
    };

    res.status(500).json(errorResponse);
  }
};

export default getAdmins;
