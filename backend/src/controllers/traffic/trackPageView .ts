import { Request, Response } from "express";
import Traffic from "../../models/Traffic";

const trackPageView = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log('created')
    await Traffic.create();
    return res.status(200).end(); 
  } catch (error) {
    console.error("Error tracking page view:", error);
    return res.status(500).end(); 
  }
};

export default trackPageView;
