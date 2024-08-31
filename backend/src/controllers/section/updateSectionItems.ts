import { Request, Response } from "express";
import Section, { ISection } from "../../models/Section";
import Product from "../../models/Product";
import mongoose from "mongoose";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import { ErrorCode, ErrorSeverity } from "../../utils/ValidationError";

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
