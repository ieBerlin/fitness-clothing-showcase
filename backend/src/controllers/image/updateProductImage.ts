import { Request, Response } from "express";
import Product from "../../models/Product";
import { Angle, IImage } from "../../models/Image";
import mongoose from "mongoose";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import ErrorSeverity from "./../../enums/ErrorSeverity";
import ErrorCode from "./../../enums/ErrorCode";
import { createNotification } from "../../utils/createNotification";
import NotificationTitle from "../../enums/NotificationTitle";
import { INotification } from "../../models/Notification";
import getNotificationMessage from "../../utils/getNotificationMessage";

interface MulterRequest extends Request {
  imageName?: string;
  imageAngle?: Angle;
}

const updateProductImage = async (req: MulterRequest, res: Response) => {
  try {
    const imagePath = req.imageName;
    const { imageAngle, productId } = req.params;

    // Validate productId
    if (!productId || !mongoose.isValidObjectId(productId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "productId",
            message: "Invalid Product ID",
            code: ErrorCode.ValidationError,
            severity: ErrorSeverity.Medium,
          },
        ],
      };
      return res.status(400).json(errorResponse);
    }

    // Validate imagePath and imageAngle
    if (!imagePath || !imageAngle) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: !imagePath ? "imagePath" : "imageAngle",
            message: "Image path and angle are required",
            code: ErrorCode.ValidationError,
            severity: ErrorSeverity.Medium,
          },
        ],
      };
      return res.status(400).json(errorResponse);
    }

    if (!["back", "front", "side", "top", "bottom"].includes(imageAngle)) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "imageAngle",
            message: "Invalid image angle",
            code: ErrorCode.ValidationError,
            severity: ErrorSeverity.Medium,
          },
        ],
      };
      return res.status(400).json(errorResponse);
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "productId",
            message: "Product not found",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.High,
          },
        ],
      };
      return res.status(404).json(errorResponse);
    }

    // Ensure imagePath is valid
    if (typeof imagePath !== "string" || imagePath.trim().length === 0) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "imagePath",
            message: "Invalid image path",
            code: ErrorCode.ValidationError,
            severity: ErrorSeverity.Medium,
          },
        ],
      };
      return res.status(400).json(errorResponse);
    }

    // Update the product's images
    const updatedImages = product.images.filter(
      (img) => img.angle !== imageAngle
    );
    updatedImages.push({ angle: imageAngle, pathname: imagePath } as IImage);
    await Product.findByIdAndUpdate(
      productId,
      { $set: { images: updatedImages } },
      { new: true }
    );

    const successResponse: SuccessResponse = {
      success: true,
    };
    const senderId = res.locals.admin.adminId;
    await createNotification({
      senderId,
      title: NotificationTitle.UPDATE_PRODUCT_IMAGE,
      message: getNotificationMessage(NotificationTitle.UPDATE_PRODUCT_IMAGE),
      isRead: false,
      createdAt: new Date(),
    } as INotification);

    res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error updating product image:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "server",
          message: "Failed to update product image",
          code: ErrorCode.ServerError,
          severity: ErrorSeverity.Critical,
        },
      ],
    };
    res.status(500).json(errorResponse);
  }
};

export default updateProductImage;
