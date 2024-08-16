import { Request, Response } from "express";
import Product from "../../models/Product";
import ValidationError from "../../utils/ValidationError";
import {
  Availability,
  Color,
  genderSizes,
  Season,
} from "../../config/product-attributes";

const updateProduct = async (req: Request, res: Response) => {
  try {
    const {
      productName,
      productDescription,
      isUnisex,
      season,
      woolPercentage,
      price,
      releaseDate,
      availability,
      colors,
    } = req.body;
    const { productId } = req.params;
    const errors: ValidationError[] = [];

    if (!productId || typeof productId !== "string") {
      errors.push({
        field: "productId",
        message: "Product ID is required and must be a string",
      });
    }

    if (
      productName &&
      (typeof productName !== "string" || productName.trim().length === 0)
    ) {
      errors.push({
        field: "productName",
        message: "If provided, product name must be a non-empty string",
      });
    }

    if (
      productDescription &&
      (typeof productDescription !== "string" ||
        productDescription.trim().length === 0)
    ) {
      errors.push({
        field: "productDescription",
        message: "If provided, product description must be a non-empty string",
      });
    }

    if (isUnisex !== undefined && typeof isUnisex !== "boolean") {
      errors.push({
        field: "isUnisex",
        message: "If provided, isUnisex must be a boolean value",
      });
    }

    const expectedSizes = isUnisex
      ? [...genderSizes.men, ...genderSizes.women]
      : genderSizes.men;

    if (colors && !Array.isArray(colors)) {
      errors.push({ field: "colors", message: "Colors must be an array" });
    } else if (colors) {
      colors.forEach((colorOption: any, colorIndex: number) => {
        const { name: colorName, availableSizes } = colorOption;

        // Validate color name
        if (!Object.values(Color).includes(colorName)) {
          errors.push({
            field: colorName,
            message: `Invalid color value: ${colorName}`,
          });
          return;
        }

        // Validate availableSizes
        if (!Array.isArray(availableSizes)) {
          errors.push({
            field: `colors[${colorIndex}].availableSizes`,
            message: `Available sizes for color ${colorName} must be an array`,
          });
          return;
        }

        const sizeNames = availableSizes.map((size: any) => size.name);
        expectedSizes.forEach((expectedSize) => {
          if (!sizeNames.includes(expectedSize)) {
            errors.push({
              field: `colors[${colorIndex}].availableSizes`,
              message: `Missing size ${expectedSize} for color ${colorName}`,
            });
          }
        });

        // Validate each size in availableSizes
        availableSizes.forEach((size: any, sizeIndex: number) => {
          const { name: sizeName, quantity, sizeAvailability } = size;

          // Validate quantity
          if (typeof quantity !== "number" || quantity < 0) {
            errors.push({
              field: `colors[${colorIndex}].availableSizes[${sizeIndex}].quantity`,
              message: `Quantity for size ${sizeName} in color ${colorName} must be a non-negative number`,
            });
          }

          // Validate sizeAvailability enum
          if (
            sizeAvailability &&
            !Object.values(Availability).includes(sizeAvailability)
          ) {
            errors.push({
              field: `colors[${colorIndex}].availableSizes[${sizeIndex}].sizeAvailability`,
              message: `Invalid sizeAvailability for size ${sizeName} in color ${colorName}: ${sizeAvailability}`,
            });
          }
        });
      });
    }

    if (season && (!Array.isArray(season) || season.length === 0)) {
      errors.push({
        field: "season",
        message: "Season must be an array and cannot be empty if provided",
      });
    } else if (
      season &&
      season.some((item: Season) => !Object.values(Season).includes(item))
    ) {
      errors.push({
        field: "season",
        message: "Invalid season value(s) provided",
      });
    }

    if (price !== undefined && (typeof price !== "number" || price <= 0)) {
      errors.push({
        field: "price",
        message: "Price must be a positive number if provided",
      });
    }

    if (releaseDate && isNaN(Date.parse(releaseDate))) {
      errors.push({ field: "releaseDate", message: "Invalid release date" });
    }

    if (availability && !Object.values(Availability).includes(availability)) {
      errors.push({
        field: "availability",
        message: "Invalid availability value if provided",
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update product fields only if they are provided
    product.productName = productName ?? product.productName;
    product.productDescription =
      productDescription ?? product.productDescription;
    product.isUnisex = isUnisex ?? product.isUnisex;
    product.season = season ?? product.season;
    product.woolPercentage = woolPercentage ?? product.woolPercentage;
    product.price = price ?? product.price;
    product.releaseDate = releaseDate ?? product.releaseDate;
    product.images = product.images;
    product.availability = availability ?? product.availability;
    product.colors = colors ?? product.colors;

    const updatedProduct = await product.save();

    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};

export default updateProduct;
