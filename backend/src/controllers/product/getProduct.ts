import { Request, Response } from "express";
import Product from "../../models/Product";
import { Availability } from "../../config/product-attributes";

const getProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
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

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ success: false, message: "Error fetching product" });
  }
};

export default getProduct;
