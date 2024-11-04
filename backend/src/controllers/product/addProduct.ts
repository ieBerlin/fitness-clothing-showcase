import { Request, Response } from "express";
import Product, { ColorOption, IProduct, Size } from "../../models/Product";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import { ValidationError } from "../../utils/ValidationError";
import Availability from "./../../enums/Availability";
import Color from "../../enums/Color";
import { genderSizes } from "../../enums/Size";
import Season from "../../enums/Season";
import NotificationTitle from "../../enums/NotificationTitle";
import getNotificationMessage from "../../utils/getNotificationMessage";
import { createNotification } from "../../utils/createNotification";
import { INotification } from "../../models/Notification";
import Gender from "../../enums/Gender";

const addProduct = async (req: Request, res: Response) => {
  const senderId = res.locals.admin.adminId;
  try {
    const {
      productName,
      productDescription,
      gender,
      season,
      woolPercentage,
      price,
      releaseDate,
      images,
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

    if (
      typeof gender !== "string" ||
      !Object.values(Gender).includes(gender as Gender)
    ) {
      errors.push({
        field: "gender",
        message:
          "Gender is required and must be either 'male', 'female', or 'unisex'.",
      });
    }

    const expectedSizes = gender
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

    if (
      woolPercentage &&
      (typeof woolPercentage !== "number" ||
        woolPercentage <= 0 ||
        woolPercentage > 100)
    ) {
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
      gender,
      season,
      woolPercentage,
      price,
      releaseDate,
      images,
      availability,
    });
    await createNotification({
      senderId,
      title: NotificationTitle.ADD_PRODUCT,
      message: getNotificationMessage(NotificationTitle.ADD_PRODUCT, {
        productName,
        productDescription,
        colors,
        gender,
        season,
        woolPercentage,
        price,
        releaseDate,
        images,
        availability,
      } as IProduct),
      isRead: false,
      createdAt: new Date(),
    } as INotification);

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
