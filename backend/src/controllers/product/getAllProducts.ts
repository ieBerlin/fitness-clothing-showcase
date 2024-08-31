import { Request, Response } from "express";
import Product from "../../models/Product";
import { ErrorResponse,SuccessResponse } from "../../utils/responseInterfaces";

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { search, availability, color, page = 1, limit = 10 } = req.query;

    const filter: any = {};

    if (search) {
      filter.productName = { $regex: search, $options: "i" };
    }

    if (availability) {
      filter.availability = availability;
    }

    if (color) {
      filter.colors = { $elemMatch: { name: color } };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter).skip(skip).limit(Number(limit));

    const totalProducts = await Product.countDocuments(filter);

    const successResponse: SuccessResponse = {
      success: true,
      data: {
        products,
        totalProducts,
        currentPage: Number(page),
        totalPages: Math.ceil(totalProducts / Number(limit)),
      },
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
