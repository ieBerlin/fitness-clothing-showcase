import { Request, Response } from "express";
import Section, { ISection } from "../../models/Section";
import Product, { IProduct } from "../../models/Product";
import {
  ErrorResponse,
  ItemsResponse,
  SuccessResponse,
} from "../../utils/responseInterfaces";
import ErrorSeverity from "../../enums/ErrorSeverity";
import ErrorCode from "../../enums/ErrorCode";
import PriceOptions from "../../enums/PriceOptions";
import Availability from "../../enums/Availability";

const getAllSections = async (req: Request, res: Response) => {
  try {
    // Destructure query params with defaults for pagination
    const { page = 1, limit = 10 } = req.query;

    // Parse availability filter and price filter from query
    const availability: Availability[] = req.query.availability
      ? (JSON.parse(req.query.availability as string) as Availability[])
      : [];
    const price: PriceOptions =
      (req.query.price as PriceOptions) || PriceOptions.ALL;

    // Define the product filter
    const productFilter: {
      availability?: { $in: Availability[] };
      price?: { $lt?: number; $gte?: number };
    } = {};

    // Apply availability filter if provided
    if (availability.length > 0) {
      productFilter.availability = { $in: availability };
    }

    // Apply price filter logic based on selected price option
    if (price !== PriceOptions.ALL) {
      switch (price) {
        case PriceOptions.LESS_THAN_5000:
          productFilter.price = { $lt: 5000 };
          break;
        case PriceOptions.BETWEEN_5000_AND_10000:
          productFilter.price = { $gte: 5000, $lt: 10000 };
          break;
        case PriceOptions.OVER_10000:
          productFilter.price = { $gte: 10000 };
          break;
      }
    }

    // Fetch all sections from the database
    const sections = await Section.find();

    if (sections.length === 0) {
      return res.status(404).json({
        success: false,
        errors: [
          {
            field: "sections",
            message: "No sections found",
            code: ErrorCode.NotFound,
            severity: ErrorSeverity.Medium,
          },
        ],
      } as ErrorResponse);
    }

    // Fetch products for each section based on the filter and pagination
    const sectionsData = await Promise.all(
      sections.map(async (section) => {
        const filterWithSection = { _id: { $in: section.items }, ...productFilter };

        // Pagination setup
        const skip = (Number(page) - 1) * Number(limit);

        // Fetch filtered products within section
        const products = await Product.find(filterWithSection)
          .skip(skip)
          .limit(Number(limit));

        // Count total products for pagination
        const totalProducts = await Product.countDocuments(filterWithSection);

        // Build ItemsResponse for products
        const productsData: ItemsResponse<IProduct> = {
          items: products,
          totalItems: totalProducts,
          currentPage: Number(page),
          totalPages: Math.ceil(totalProducts / Number(limit)),
        };

        return {
          section: section.toObject() as ISection,
          products: productsData,
        };
      })
    );

    // Prepare and send success response with sections and products
    return res.status(200).json({
      success: true,
      data: sectionsData,
    } as SuccessResponse<
      {
        section: ISection;
        products: ItemsResponse<IProduct>;
      }[]
    >);
  } catch (error) {
    console.error("Error fetching sections:", error);

    // Send error response for server failure
    return res.status(500).json({
      success: false,
      errors: [
        {
          field: "server",
          message: "Error fetching sections",
          code: ErrorCode.ServerError,
          severity: ErrorSeverity.Critical,
        },
      ],
    } as ErrorResponse);
  }
};

export default getAllSections;
