import { Request, Response } from "express";
import Product from "../../models/Product";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

    const totalProducts = await Product.countDocuments();

    const successResponse: SuccessResponse = {
      success: true,
      data: {},
    };

    res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error fetching products:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "Error fetching products" }],
    };

    res.status(500).json(errorResponse);
  }
};

export default getAllProducts;
