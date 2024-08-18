import { Request, Response } from "express";

const allowAccess = (_: Request, res: Response) => {
  return res.status(200).json({ valid: true });
};

export default allowAccess;
