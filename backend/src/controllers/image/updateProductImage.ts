import { Request, Response } from "express";
import Product from "../../models/Product";
import { IImage } from "../../models/Image";
import mongoose from "mongoose";

interface MulterRequest extends Request {
  imageName?: string;
  imageAngle?: "back" | "front" | "side" | "top" | "bottom";
}

const updateProductImage = async (req: MulterRequest, res: Response) => {
  try {
    const imagePath = req.imageName;
    const { imageAngle, productId } = req.params;
    console.log(productId);
    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Product ID",
      });
    }
    if (!imagePath || !imageAngle) {
      return res.status(400).json({
        success: false,
        message: "Image path and angle are required",
      });
    }

    // Validate productId
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Ensure imageAngle is valid
    if (!["back", "front", "side", "top", "bottom"].includes(imageAngle)) {
      return res.status(400).json({
        success: false,
        message: "Invalid image angle",
      });
    }

    // Update the product's images
    const updatedImages = product.images.filter(
      (img) => img.angle !== imageAngle
    );

    // Ensure that the imagePath is a valid string
    if (typeof imagePath !== "string" || imagePath.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid image path",
      });
    }

    updatedImages.push({ angle: imageAngle, pathname: imagePath } as IImage);
    await Product.findByIdAndUpdate(
      productId,
      { $set: { images: updatedImages } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Product image updated successfully",
    });
  } catch (error) {
    console.error("Error updating product image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product image",
    });
  }
};

export default updateProductImage;
