import { Request, Response } from "express";
import Product from "../../models/Product";
import { SuccessResponse } from "../../utils/SuccessResponse";
import { ErrorResponse } from "../../utils/responseInterfaces";

const getTotalProductsCount = async (req: Request, res: Response) => {
  try {
    const totalProductsCount = await Product.countDocuments();
    const successResponse: SuccessResponse = {
      success: true,
      data: { count: totalProductsCount },
    };

    res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error fetching product count:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "Error fetching product count" }],
    };

    res.status(500).json(errorResponse);
  }
};

export default getTotalProductsCount;
