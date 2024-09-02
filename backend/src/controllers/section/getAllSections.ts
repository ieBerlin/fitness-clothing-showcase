import { Request, Response } from "express";
import Section, { ISection } from "../../models/Section";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import { ErrorCode, ErrorSeverity } from "../../utils/ValidationError";
import Product, { IProduct } from "../../models/Product";

const getAllSections = async (req: Request, res: Response) => {
  try {
    const { search, availability, color, page = 1, limit = 10 } = req.query;

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
        const productFilter: any = {
          _id: { $in: section.items },
        };
        if (search) {
          productFilter.productName = { $regex: search, $options: "i" };
        }
        if (availability) {
          productFilter.availability = availability;
        }

        if (color) {
          productFilter.colors = { $elemMatch: { name: color } };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const products: IProduct[] = await Product.find(productFilter)
          .skip(skip)
          .limit(Number(limit));

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
