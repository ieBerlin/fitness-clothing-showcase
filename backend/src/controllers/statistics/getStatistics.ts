import { Request, Response } from "express";
import Admin from "../../models/Admin";
import Product from "../../models/Product";
import Traffic from "../../models/Traffic";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";

const getStatistics = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const totalAdmins = await Admin.countDocuments();

    const totalProducts = await Product.countDocuments();

    const totalTraffic = await Traffic.countDocuments({
      timestamp: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const successResponse: SuccessResponse<{
      totalAdmins: number;
      totalProducts: number;
      totalTraffic: number;
    }> = {
      success: true,
      data: {
        totalAdmins,
        totalProducts,
        totalTraffic,
      },
    };

    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error fetching statistics:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "Error fetching statistics" }],
    };

    return res.status(500).json(errorResponse);
  }
};

export default getStatistics;
