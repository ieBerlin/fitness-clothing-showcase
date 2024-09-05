import { Request, Response } from "express";
import Section, { ISection } from "../../models/Section";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import mongoose from "mongoose";
import ErrorSeverity from './../../enums/ErrorSeverity';
import ErrorCode from './../../enums/ErrorCode';

const getSection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;

    if (sectionId || !mongoose.Types.ObjectId.isValid(sectionId)) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "sectionId",
            message: "Section ID is required",
            code: ErrorCode.ValidationError,
            severity: ErrorSeverity.Medium,
          },
        ],
      };
      return res.status(400).json(errorResponse);
    }

    const section = await Section.findById(sectionId);

    if (!section) {
      const notFoundResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "sectionId",
            message: "Section not found",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.Medium,
          },
        ],
      };
      return res.status(404).json(notFoundResponse);
    }

    const successResponse: SuccessResponse<ISection> = {
      success: true,
      data: section,
    };

    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error fetching section:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "server",
          message: "Error fetching section",
          code: ErrorCode.ServerError,
          severity: ErrorSeverity.Critical,
        },
      ],
    };

    return res.status(500).json(errorResponse);
  }
};

export default getSection;
