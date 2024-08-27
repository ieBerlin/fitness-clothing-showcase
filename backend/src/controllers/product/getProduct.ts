import { Request, Response } from "express";
import Product from "../../models/Product";
import { Availability } from "../../config/product-attributes";
import { SuccessResponse } from "../../utils/SuccessResponse";
import { ErrorResponse } from "../../utils/responseInterfaces";

const getProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [{ field: "productId", message: "Product ID is required" }],
      };
      return res.status(400).json(errorResponse);
    }

    const product = await Product.findById(productId);

    if (!product) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [{ field: "productId", message: "Product not found" }],
      };
      return res.status(404).json(errorResponse);
    }

    // Check product availability and update size availability accordingly
    if (["IN_STOCK", "DISCOUNTED"].includes(product.availability)) {
      product.colors.forEach((color) => {
        color.availableSizes = color.availableSizes.map((size) => {
          if (
            [
              "UNAVAILABLE",
              "OUT_OF_STOCK",
              "COMING_SOON",
              "OUT_OF_SEASON",
            ].includes(size.sizeAvailability)
          ) {
            return { ...size, sizeAvailability: Availability.UNAVAILABLE };
          }
          return size;
        });
      });
    }

    if (
      ["UNAVAILABLE", "OUT_OF_STOCK", "COMING_SOON", "OUT_OF_SEASON"].includes(
        product.availability
      )
    ) {
      product.colors.forEach((color) => {
        color.availableSizes = color.availableSizes.map((size) => ({
          ...size,
          sizeAvailability: Availability.UNAVAILABLE,
        }));
      });
    }

    const successResponse: SuccessResponse = {
      success: true,
      data: { product },
    };

    res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error fetching product:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "Error fetching product" }],
    };

    res.status(500).json(errorResponse);
  }
};

export default getProduct;
