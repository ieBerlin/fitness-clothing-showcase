// src/controllers/deleteProductImage.ts

import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import Product from "../../models/Product";
import { IImage } from "../../models/Image";

const deleteProductImage = async (req: Request, res: Response) => {
  const { imageId } = req.params;

  try {
    // Find the product with the specific image pathname
    const product = await Product.findOne({ "images.pathname": imageId });
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Find the specific image within the product
    const image = product.images.find((img: IImage) => img.pathname === imageId);
    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found." });
    }

    const imagePath = path.join(
      __dirname,
      "../../../public/uploads/product/",
      imageId
    );

    try {
      await fs.unlink(imagePath);

      // Remove the image from the images array
      product.images = product.images.filter((img: IImage) => img.pathname !== imageId);

      await product.save();

      res.status(200).json({
        success: true,
        message: "Product image deleted successfully.",
      });
    } catch (fileError) {
      console.error("Error deleting image file:", fileError);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete image file." });
    }
  } catch (dbError) {
    console.error("Error deleting product image:", dbError);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete product image." });
  }
};

export default deleteProductImage;
