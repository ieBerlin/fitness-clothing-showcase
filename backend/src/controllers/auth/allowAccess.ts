import { Request, Response } from "express";
import { SuccessResponse } from './../../utils/responseInterfaces';

const allowAccess = (_: Request, res: Response) => {
  const successResponse: SuccessResponse = {
    success: true,
  };

  return res.status(200).json(successResponse);
};

export default allowAccess;
