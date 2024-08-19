import { Request, Response } from "express";
import Product from "../../models/Product";

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { search, availability, color, page = 1, limit = 10 } = req.query;

    // Create a filter object based on search parameters
    const filter: any = {};

    if (search) {
      filter.productName = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    if (availability) {
      filter.availability = availability;
    }

    if (color) {
      filter.colors = { $elemMatch: { name: color } }; // Match a color in the array of colors
    }

    // Implement pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch products from the database with the applied filter and pagination
    const products = await Product.find(filter)
      .skip(skip)
      .limit(Number(limit));

    const totalProducts = await Product.countDocuments(filter); // Count total products for the filter

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / Number(limit)),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error,
    });
  }
};

export default getAllProducts;
