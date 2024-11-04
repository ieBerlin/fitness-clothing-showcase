import { Request, Response } from "express";
import Section, { ISection } from "../../models/Section";
import Product, { IProduct } from "../../models/Product";
import mongoose from "mongoose";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import ErrorSeverity from "./../../enums/ErrorSeverity";
import ErrorCode from "./../../enums/ErrorCode";
import { createNotification } from "../../utils/createNotification";
import NotificationTitle from "../../enums/NotificationTitle";
import getNotificationMessage from "../../utils/getNotificationMessage";
import { INotification } from "../../models/Notification";

const updateSectionItems = async (req: Request, res: Response) => {
  const { sectionId } = req.params;
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "items",
          message: "Invalid items array. Ensure it is a non-empty array.",
          code: ErrorCode.ValidationError,
          severity: ErrorSeverity.Medium,
        },
      ],
    };
    return res.status(400).json(errorResponse);
  }
  if (!sectionId || !mongoose.Types.ObjectId.isValid(sectionId)) {
    const invalidIdResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "sectionId",
          message: "Invalid ObjectId for sectionId.",
          code: ErrorCode.ValidationError,
          severity: ErrorSeverity.Medium,
        },
      ],
    };
    return res.status(400).json(invalidIdResponse);
  }

  try {
    const section = await Section.findById(sectionId);
    if (!section) {
      const notFoundResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "sectionId",
            message: "Section not found.",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.Medium,
          },
        ],
      };
      return res.status(404).json(notFoundResponse);
    }

    for (const item of items) {
      if (!item._id || !mongoose.Types.ObjectId.isValid(item._id)) {
        const invalidIdResponse: ErrorResponse = {
          success: false,
          errors: [
            {
              field: "items",
              message: `Invalid ObjectId for item: ${JSON.stringify(item)}`,
              code: ErrorCode.ValidationError,
              severity: ErrorSeverity.Medium,
            },
          ],
        };
        return res.status(400).json(invalidIdResponse);
      }
      const productExists = await Product.findById(
        item._id as mongoose.Types.ObjectId
      );

      if (!productExists) {
        const productNotFoundResponse: ErrorResponse = {
          success: false,
          errors: [
            {
              field: "items",
              message: `Product with ID ${item._id} not found.`,
              code: ErrorCode.NotFound,
              severity: ErrorSeverity.Medium,
            },
          ],
        };
        return res.status(404).json(productNotFoundResponse);
      }
    }
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { items },
      { new: true, runValidators: true }
    );

    if (!updatedSection) {
      const sectionNotFoundResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "sectionId",
            message: "Section not found.",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.Medium,
          },
        ],
      };
      return res.status(404).json(sectionNotFoundResponse);
    }

    const successResponse: SuccessResponse<ISection> = {
      success: true,
      data: updatedSection,
    };
    const senderId = res.locals.admin.adminId;

    await createNotification({
      senderId,
      title: NotificationTitle.SECTION_ITEMS_UPDATED,
      message: getNotificationMessage(NotificationTitle.SECTION_ITEMS_UPDATED),
      isRead: false,
      createdAt: new Date(),
    } as INotification);

    res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error updating section items:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "server",
          message: "Error updating section items.",
          code: ErrorCode.ServerError,
          severity: ErrorSeverity.Critical,
        },
      ],
    };

    res.status(500).json(errorResponse);
  }
};

export default updateSectionItems;
