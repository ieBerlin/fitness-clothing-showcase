import { Request, Response } from "express";
import Product, { IProduct } from "../../models/Product";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import Availability from "./../../enums/Availability";
import mongoose from "mongoose";

const getProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [{ field: "productId", message: "Product ID is required" }],
      };
      return res.status(404).json(errorResponse);
    }

    const product = await Product.findById(productId);

    if (!product) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [{ field: "productId", message: "Product not found" }],
      };
      return res.status(404).json(errorResponse);
    }

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

    const successResponse: SuccessResponse<IProduct> = {
      success: true,
      data: product,
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
