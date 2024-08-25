import { NextFunction, Request, Response } from "express";

const delayMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const delay = 1700;

  setTimeout(() => {
    next();
  }, delay);
};

export default delayMiddleware;
