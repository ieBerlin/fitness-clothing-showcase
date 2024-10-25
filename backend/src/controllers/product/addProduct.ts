import { Request, Response } from "express";
import Product, { ColorOption, IProduct, Size } from "../../models/Product";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import { ValidationError } from "../../utils/ValidationError";
import Availability from "./../../enums/Availability";
import Color from "../../enums/Color";
import { genderSizes } from "../../enums/Size";
import Season from "../../enums/Season";

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
      images,
      availability,
      colors,
    } = req.body;
console.log(req.body)
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
      colors.forEach((colorOption: ColorOption, colorIndex: number) => {
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

        const sizeNames = availableSizes.map((size: Size) => size.name);
        expectedSizes.forEach((expectedSize) => {
          if (!sizeNames.includes(expectedSize)) {
            errors.push({
              field: `colors[${colorIndex}].availableSizes`,
              message: `Missing size ${expectedSize} for color ${colorName}`,
            });
          }
        });

        // Validate each size in availableSizes
        availableSizes.forEach((size: Size, sizeIndex: number) => {
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
              field: `colors[${colorIndex}].availableSizes[${sizeIndex}].sizeAvailability`,
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
        field: "woolPercentage",
        message: "Wool Percentage must be a positive number",
      });
    }

    if (!releaseDate || isNaN(Date.parse(releaseDate))) {
      errors.push({ field: "releaseDate", message: "Invalid release date" });
    }

    if (images && !Array.isArray(images)) {
      errors.push({ field: "image", message: "Image URL must be an array" });
    }

    if (!Object.values(Availability).includes(availability)) {
      errors.push({
        field: "availability",
        message: "Invalid availability value",
      });
    }

    if (errors.length > 0) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors,
      };
      return res.status(400).json(errorResponse);
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
      images,
      availability,
    });

    const successResponse: SuccessResponse<IProduct> = {
      success: true,
      data: newProduct,
    };

    res.status(201).json(successResponse);
  } catch (error) {
    console.error("Error adding product:", error);
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "Error adding product" }],
    };
    res.status(500).json(errorResponse);
  }
};

export default addProduct;
