import { Request, Response } from "express";
import Product from "../../models/Product";
import Section from "../../models/Section";
import mongoose from "mongoose";

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }

    // Find and delete the product
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const sections = await Section.find({ items: productId });
    for (const section of sections) {
      section.items = section.items.filter(
        (item) => item.toString() !== productId
      );
      await section.save(); // Save the updated section
    }

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
};

export default deleteProduct;
