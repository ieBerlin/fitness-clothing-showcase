import { Request, Response } from "express";
import Product from "../../models/Product";

const updateProductPrice = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { price } = req.body;

    if (!price || typeof price !== "number" || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid price. Price must be a positive number.",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { price } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Respond with the updated product
    res.status(200).json({
      success: true,
      message: "Product price updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product price:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product price.",
    });
  }
};

export default updateProductPrice;
