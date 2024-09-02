import { Request, Response } from "express";
import Traffic from "../../models/Traffic";
import { SuccessResponse, ErrorResponse } from "../../utils/responseInterfaces";

const getTrafficData = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const filter: any = {};

    if (typeof startDate === "string" && typeof endDate === "string") {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      } else {
        return res.status(400).json({
          success: false,
          errors: [{ field: "date", message: "Invalid date format" }],
        });
      }
      filter.timestamp = { $gte: start, $lte: end };
    }

    const trafficData = await Traffic.find(filter);

    const successResponse: SuccessResponse<any[]> = {
      success: true,
      data: trafficData,
    };

    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("Error fetching traffic data:", error);

    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "server",
          message: "An unexpected error occurred while fetching traffic data.",
        },
      ],
    };

    return res.status(500).json(errorResponse);
  }
};

export default getTrafficData;
