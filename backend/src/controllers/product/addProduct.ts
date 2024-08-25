import { Request, Response } from "express";
import Product from "../../models/Product";
import ValidationError from "../../utils/ValidationError";
import {
  Availability,
  Color,
  genderSizes,
  Season,
} from "../../config/product-attributes";

const addProduct = async (req: Request, res: Response) => {
  try {
    const {
      productName,
      productDescription,
      isUnisex,
      season,
      woolPercentage,
      price,
      releaseDate,
      image,
      availability,
      colors,
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
    if (typeof isUnisex !== "boolean") {
      errors.push({
        field: "isUnisex",
        message: "isUnisex must be a boolean value",
      });
    }
    const expectedSizes = isUnisex
      ? [...genderSizes.men, ...genderSizes.women]
      : genderSizes.men;
    if (!Array.isArray(colors)) {
      errors.push({ field: "colors", message: "Colors must be an array" });
    } else {
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
            message: `available sizes for color ${colorName} must be an array`,
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
          if (!Object.values(Availability).includes(sizeAvailability)) {
            errors.push({
              field: `colors[${colorIndex}].availableSizes[${sizeIndex}].`,
              message: `Invalid sizeAvailability for size ${sizeName} in color ${colorName}: ${sizeAvailability}`,
            });
          }
        });
      });
    }
    if (!Array.isArray(season) || season.length === 0) {
      errors.push({
        field: "season",
        message: "Season must be an array and cannot be empty",
      });
    } else if (season.some((item) => !Object.values(Season).includes(item))) {
      errors.push({
        field: "season",
        message: "Invalid season value(s) provided",
      });
    }

    if (typeof price !== "number" || price <= 0) {
      errors.push({
        field: "price",
        message: "Price must be a positive number",
      });
    }
    if (typeof woolPercentage !== "number" || woolPercentage <= 0) {
      errors.push({
        field: "Wool Percentage",
        message: "Wool Percentage must be a positive number",
      });
    }

    if (!releaseDate || isNaN(Date.parse(releaseDate))) {
      errors.push({ field: "releaseDate", message: "Invalid release date" });
    }

    if (image && typeof image !== "string") {
      errors.push({ field: "image", message: "Image URL must be a string" });
    }
    if (!Object.values(Availability).includes(availability)) {
      errors.push({
        field: "availability",
        message: "Invalid availability value",
      });
    }
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const newProduct = await Product.create({
      productName,
      productDescription,
      colors,
      isUnisex,
      season,
      woolPercentage,
      price,
      releaseDate,
      image,
      availability,
    });

    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Error adding product" });
  }
};

export default addProduct;
