import { Request, Response } from "express";
import Section, { ISection } from "../../models/Section";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import { ValidationError } from "../../utils/ValidationError";
import mongoose from "mongoose";
import ErrorCode from "../../enums/ErrorCode";
import ErrorSeverity from "../../enums/ErrorSeverity";
import { createNotification } from "../../utils/createNotification";
import getNotificationMessage from "../../utils/getNotificationMessage";
import NotificationTitle from "../../enums/NotificationTitle";
import { IProduct } from "../../models/Product";
import { INotification } from "../../models/Notification";

const removeProductFromSection = async (req: Request, res: Response) => {
  const { sectionId, productId } = req.params;
  let errors: ValidationError[] = [];

  if (!sectionId || !mongoose.Types.ObjectId.isValid(sectionId)) {
    errors.push({
      field: "sectionId",
      message: "Invalid or missing section ID.",
      code: ErrorCode.ValidationError,
      severity: ErrorSeverity.Critical,
    });
  }

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    errors.push({
      field: "productId",
      message: "Invalid or missing product ID.",
      code: ErrorCode.ValidationError,
      severity: ErrorSeverity.Critical,
    });
  }

  if (errors.length > 0) {
    const errorResponse: ErrorResponse = {
      success: false,
      errors,
    };
    return res.status(400).json(errorResponse);
  }

  try {
    // Find the section by ID
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        errors: [
          {
            field: "sectionId",
            message: "Section not found.",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.Medium,
          },
        ],
      });
    }

    const productIndex = section.items.findIndex(
      (item) => item.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        errors: [
          {
            field: "productId",
            message: "Product not found in this section.",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.Medium,
          },
        ],
      });
    }

    // Remove the product from the section's items
    section.items.splice(productIndex, 1);

    await section.save();
    
    const successResponse: SuccessResponse<ISection> = {
      success: true,
      data: section,
    };
    const senderId = res.locals.admin.adminId;
    await createNotification({
      senderId,
      title: NotificationTitle.REMOVE_PRODUCT_FROM_SECTION,
      message: getNotificationMessage(
        NotificationTitle.REMOVE_PRODUCT_FROM_SECTION,
        {
          _id: productId,
        } as IProduct
      ),
      isRead: false,
      createdAt: new Date(),
    } as INotification);

    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error removing product from section:", error);
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "server",
          message: "Error removing product from section.",
          code: ErrorCode.ServerError,
          severity: ErrorSeverity.Critical,
        },
      ],
    };
    return res.status(500).json(errorResponse);
  }
};

export default removeProductFromSection;
