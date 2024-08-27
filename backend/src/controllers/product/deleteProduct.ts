import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../../models/Product";
import Section from "../../models/Section";
import { SuccessResponse } from "../../utils/SuccessResponse";
import { ErrorResponse } from "../../utils/responseInterfaces";
import { ErrorCode, ErrorSeverity } from "../../utils/ValidationError";

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "productId",
            message: "Invalid product ID",
            code: ErrorCode.ValidationError,
            severity: ErrorSeverity.High,
          },
        ],
      };
      return res.status(400).json(errorResponse);
    }

    // Find and delete the product
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      const notFoundResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "productId",
            message: "Product not found",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.High,
          },
        ],
      };
      return res.status(404).json(notFoundResponse);
    }

    // Update sections to remove the product
    const sections = await Section.find({ items: productId });
    for (const section of sections) {
      section.items = section.items.filter(
        (item) => item.toString() !== productId
      );
      await section.save(); // Save the updated section
    }

    const successResponse: SuccessResponse<{ message: string }> = {
      success: true,
      data: { message: "Product deleted successfully" },
    };

    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error deleting product:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "server",
          message: "An unexpected error occurred while deleting the product.",
          code: ErrorCode.ServerError,
          severity: ErrorSeverity.Critical,
        },
      ],
    };

    return res.status(500).json(errorResponse);
  }
};

export default deleteProduct;
