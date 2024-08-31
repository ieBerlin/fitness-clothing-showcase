import { Request, Response } from "express";
import Section, { ISection } from "../../models/Section";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import { ErrorCode, ErrorSeverity } from "../../utils/ValidationError";
import Product, { IProduct } from "../../models/Product";

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
    let sectionsData: {
      section: ISection;
      products: IProduct[];
    }[] = [];

    await Promise.all(
      sections.map(async (section) => {
        const products: IProduct[] = await Product.find({
          _id: { $in: section.items },
        });

        // Convert the Mongoose document to a plain object with type ISection
        const sectionObject = section.toObject() as ISection;
        sectionsData.push({
          section: sectionObject,
          products,
        });
      })
    );

    const successResponse: SuccessResponse<
      {
        section: ISection;
        products: IProduct[];
      }[]
    > = {
      success: true,
      data: sectionsData,
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
