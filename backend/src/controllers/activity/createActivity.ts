import { Request, Response } from "express";
import {
  ErrorCode,
  ErrorSeverity,
  ValidationError,
} from "../../utils/ValidationError";
import { SuccessResponse } from "../../utils/responseInterfaces";
import Activity, { ActivityType, EntityType } from "../../models/Activity";
import Product from "../../models/Product";
import Section from "../../models/Section";
import Admin from "../../models/Admin";
import { Types } from "mongoose";

const createActivity = async (req: Request, res: Response) => {
  try {
    const { sectionId, adminId, activityType, entityType, entityId } = req.body;

    const errors: ValidationError[] = [];

    if (!adminId || !Types.ObjectId.isValid(adminId)) {
      errors.push({
        field: "adminId",
        message: "Admin ID is required",
        code: ErrorCode.ValidationError,
        severity: ErrorSeverity.Medium,
      });
    }

    if (!activityType || !Object.values(ActivityType).includes(activityType)) {
      errors.push({
        field: "activityType",
        message: "Invalid activity type",
        code: ErrorCode.ValidationError,
        severity: ErrorSeverity.Medium,
      });
    }

    if (!entityType || !Object.values(EntityType).includes(entityType)) {
      errors.push({
        field: "entityType",
        message: "Invalid entity type",
        code: ErrorCode.ValidationError,
        severity: ErrorSeverity.Medium,
      });
    }

    if (
      entityType === EntityType.SECTION &&
      (!sectionId || !Types.ObjectId.isValid(sectionId))
    ) {
      errors.push({
        field: "sectionId",
        message: "Section ID is required for section activities",
        code: ErrorCode.ValidationError,
        severity: ErrorSeverity.Medium,
      });
    }

    if (!entityId || !Types.ObjectId.isValid(entityId)) {
      errors.push({
        field: "entityId",
        message: "Entity ID is required",
        code: ErrorCode.ValidationError,
        severity: ErrorSeverity.Medium,
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    switch (entityType) {
      case EntityType.PRODUCT: {
        if (
          activityType === ActivityType.PRODUCT_ADDED ||
          activityType === ActivityType.PRODUCT_UPDATED
        ) {
          const product = await Product.findById(entityId);
          if (!product) {
            return res.status(404).json({
              success: false,
              errors: [{ field: "entityId", message: "Product not found" }],
            });
          }
        }
        break;
      }
      case EntityType.SECTION: {
        if (
          activityType === ActivityType.PRODUCT_ADDED_TO_SECTION ||
          activityType === ActivityType.PRODUCT_REMOVED_FROM_SECTION
        ) {
          const product = await Product.findById(entityId);
          if (!product) {
            return res.status(404).json({
              success: false,
              errors: [{ field: "entityId", message: "Product not found" }],
            });
          }

          const section = await Section.findById(sectionId);
          if (!section) {
            return res.status(404).json({
              success: false,
              errors: [{ field: "sectionId", message: "Section not found" }],
            });
          }
        }
        break;
      }
    }
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        errors: [{ field: "entityId", message: "Admin not found" }],
      });
    }
    await Activity.create({
      adminId,
      activityType,
      entityType,
      entityId,
      timestamp: new Date(),
    });

    const successResponse: SuccessResponse<{ message: string }> = {
      success: true,
    };

    return res.status(201).json(successResponse);
  } catch (error) {
    console.error("Error creating activity:", error);

    return res.status(500).json({
      success: false,
      errors: [
        {
          field: "server",
          message: "An unexpected error occurred while creating the activity.",
          code: ErrorCode.ServerError,
          severity: ErrorSeverity.Critical,
        },
      ],
    });
  }
};

export default createActivity;
