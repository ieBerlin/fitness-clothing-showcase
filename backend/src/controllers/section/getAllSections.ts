import { Request, Response } from "express";
import Section, { ISection } from "../../models/Section";
import Product, { IProduct } from "../../models/Product";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import ErrorSeverity from "../../enums/ErrorSeverity";
import ErrorCode from "../../enums/ErrorCode";
import PriceOptions from "../../enums/PriceOptions";
import Availability from "../../enums/Availability";

const getAllSections = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const availability: Availability[] = req.query.availability
      ? (JSON.parse(req.query.availability as string) as Availability[])
      : [];
    const price: PriceOptions =
      (req.query.price as PriceOptions) || PriceOptions.ALL;

    const filter: {
      productName?: { $regex: string; $options: string };
      availability?: { $in: Availability[] };
      price?: { $lt?: number; $gte?: number };
    } = {};

    if (availability.length > 0) {
      filter.availability = { $in: availability };
    }

    if (price !== PriceOptions.ALL) {
      switch (price) {
        case PriceOptions.LESS_THAN_5000:
          filter.price = { $lt: 5000 };
          break;
        case PriceOptions.BETWEEN_5000_AND_10000:
          filter.price = { $gte: 5000, $lt: 10000 };
          break;
        case PriceOptions.OVER_10000:
          filter.price = { $gte: 10000 };
          break;
      }
    }

    // Fetch sections
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
    if (availability.length === 0) {
      const successResponse: SuccessResponse<
        {
          section: ISection;
          products: IProduct[];
        }[]
      > = {
        success: true,
        data: sections.map((section) => ({
          section: section.toObject() as ISection,
          products: [],
        })),
      };
      return res.status(200).json(successResponse);
    }
    // Fetch products for each section
    const sectionsData: {
      section: ISection;
      products: IProduct[];
    }[] = await Promise.all(
      sections.map(async (section) => {
        const productFilter: any = { _id: { $in: section.items }, ...filter };

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        const products: IProduct[] = await Product.find(productFilter)
          .skip(skip)
          .limit(Number(limit));

        const sectionObject = section.toObject() as ISection;

        return {
          section: sectionObject,
          products,
        };
      })
    );

    // Prepare success response
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
