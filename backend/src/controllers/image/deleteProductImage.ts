import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import Product from "../../models/Product";
import { IImage } from "../../models/Image";
import { ErrorCode, ErrorSeverity, ValidationError } from "../../utils/ValidationError";
import { SuccessResponse } from "../../utils/SuccessResponse";

const deleteProductImage = async (req: Request, res: Response) => {
  const { imageId } = req.params;

  try {
    const product = await Product.findOne({ "images.pathname": imageId });
    if (!product) {
      return res.status(404).json({
        success: false,
        errors: [
          {
            field: "imageId",
            message: "Product not found.",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.High,
          },
        ],
      });
    }
    const image = product.images.find((img: IImage) => img.pathname === imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        errors: [
          {
            field: "imageId",
            message: "Image not found.",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.High,
          },
        ],
      });
    }

    const imagePath = path.join(
      __dirname,
      "../../../public/uploads/product/",
      imageId
    );

    try {
      await fs.unlink(imagePath);
    } catch (fileError) {
      console.error("Error deleting image file:", fileError);
      return res.status(500).json({
        success: false,
        errors: [
          {
            field: "file",
            message: "Failed to delete image file.",
            code: ErrorCode.ServerError,
            severity: ErrorSeverity.Critical,
          },
        ],
      });
    }

    // Remove the image from the product's images array
    product.images = product.images.filter((img: IImage) => img.pathname !== imageId);

    // Save the updated product document
    await product.save();

    // Respond with success
    const successResponse: SuccessResponse<{ message: string }> = {
      success: true,
      data: { message: "Product image deleted successfully." },
    };

    return res.status(200).json(successResponse);
  } catch (dbError) {
    console.error("Error deleting product image:", dbError);
    return res.status(500).json({
      success: false,
      errors: [
        {
          field: "server",
          message: "Failed to delete product image.",
          code: ErrorCode.ServerError,
          severity: ErrorSeverity.Critical,
        },
      ],
    });
  }
};

export default deleteProductImage;
