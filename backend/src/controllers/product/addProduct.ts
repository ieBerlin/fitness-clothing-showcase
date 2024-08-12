import { Request, Response } from "express";
import Product from "../../models/Product";
import ValidationError from "../../utils/ValidationError";

const addProduct = async (req: Request, res: Response) => {
  try {
    const {
      productName,
      productDescription,
      sizes,
      isUnisex,
      season,
      woolPercentage,
      price,
      releaseDate,
      image,
    } = req.body;

    const errors: ValidationError[] = [];

    if (
      !productName ||
      typeof productName !== "string" ||
      productName.trim().length === 0
    ) {
      errors.push({
        field: "productName",
        message: "Product name is required and must be a non-empty string",
      });
    }

    if (
      !productDescription ||
      typeof productDescription !== "string" ||
      productDescription.trim().length === 0
    ) {
      errors.push({
        field: "productDescription",
        message:
          "Product description is required and must be a non-empty string",
      });
    }

    if (!Array.isArray(sizes)) {
      errors.push({ field: "sizes", message: "Sizes must be an array" });
    }

    if (typeof price !== "number" || price <= 0) {
      errors.push({
        field: "price",
        message: "Price must be a positive number",
      });
    }

    if (releaseDate && isNaN(Date.parse(releaseDate))) {
      errors.push({ field: "releaseDate", message: "Invalid release date" });
    }

    if (image && typeof image !== "string") {
      errors.push({ field: "image", message: "Image URL must be a string" });
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const newProduct = await Product.create({
      productName,
      productDescription,
      sizes,
      isUnisex,
      season,
      woolPercentage,
      price,
      releaseDate,
      image,
    });

    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Error adding product" });
  }
};

export default addProduct;
