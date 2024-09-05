import { Request, Response } from "express";
import Product from "../../models/Product";
import { ErrorResponse, SuccessResponse } from "../../utils/responseInterfaces";
import PriceOptions from "../../enums/PriceOptions";
import Availability from './../../enums/Availability';

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    const availability: Availability[] = req.query.availability
      ? (JSON.parse(req.query.availability as string) as Availability[])
      : [];

    const priceOption: PriceOptions =
      (req.query.price as PriceOptions) || PriceOptions.ALL;
    if (availability.length === 0) {
      const successResponse: SuccessResponse = {
        success: true,
        data: {
          products: [],
          totalProducts: 0,
          currentPage: Number(page),
          totalPages: 0,
        },
      };
      return res.status(200).json(successResponse);
    }
    const filter: {
      productName?: { $regex: string; $options: string };
      availability?: { $in: Availability[] };
      price?: { $lt?: number; $gte?: number };
    } = {};

    if (search) {
      filter.productName = { $regex: search as string, $options: "i" };
    }

    if (availability.length > 0) {
      filter.availability = { $in: availability };
    }

    if (priceOption !== PriceOptions.ALL) {
      switch (priceOption) {
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

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(filter).skip(skip).limit(Number(limit));
    const totalProducts = await Product.countDocuments(filter);

    const successResponse: SuccessResponse = {
      success: true,
      data: {
        products,
        totalProducts,
        currentPage: Number(page),
        totalPages: Math.ceil(totalProducts / Number(limit)),
      },
    };

    res.status(200).json(successResponse);
  } catch (error) {
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [{ field: "server", message: "Error fetching products" }],
    };

    res.status(500).json(errorResponse);
  }
};

export default getAllProducts;
