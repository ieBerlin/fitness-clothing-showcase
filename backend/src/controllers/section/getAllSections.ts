import { Request, Response } from "express";
import Section from "../../models/Section";
import { SuccessResponse } from "../../utils/SuccessResponse";
import { ErrorResponse } from "../../utils/responseInterfaces";
import { ErrorCode, ErrorSeverity } from "../../utils/ValidationError";

const getAllSections = async (req: Request, res: Response) => {
  try {
    const sections = await Section.find();

    if (sections.length === 0) {
      const notFoundResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "sections",
            message: "No sections found",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.Medium,
          },
        ],
      };
      return res.status(404).json(notFoundResponse);
    }

    const successResponse: SuccessResponse<{ sections: any[] }> = {
      success: true,
      data: { sections },
    };

    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error fetching sections:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "server",
          message: "Error fetching sections",
          code: ErrorCode.ServerError,
          severity: ErrorSeverity.Critical,
        },
      ],
    };

    return res.status(500).json(errorResponse);
  }
};

export default getAllSections;
