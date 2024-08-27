import { Request, Response } from "express";
import Product from "../../models/Product";
import { SuccessResponse } from "../../utils/SuccessResponse";
import { ErrorResponse } from "../../utils/responseInterfaces";

const updateProductPrice = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { price } = req.body;

    if (typeof price !== "number" || price <= 0) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "price",
            message: "Invalid price. Price must be a positive number.",
          },
        ],
      };
      return res.status(400).json(errorResponse);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { price } },
      { new: true }
    );

    if (!updatedProduct) {
      const notFoundResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "productId",
            message: "Product not found.",
          },
        ],
      };
      return res.status(404).json(notFoundResponse);
    }

    const successResponse: SuccessResponse = {
      success: true,
      data: {
        message: "Product price updated successfully.",
        product: updatedProduct,
      },
    };

    res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error updating product price:", error);
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "server",
          message: "Failed to update product price.",
        },
      ],
    };
    res.status(500).json(errorResponse);
  }
};

export default updateProductPrice;
