import { Request, Response, NextFunction } from "express";
import multer, { MulterError } from "multer";
import path from "path";
import { ErrorResponse } from "../utils/responseInterfaces";
import ErrorSeverity from './../enums/ErrorSeverity';
import ErrorCode from './../enums/ErrorCode';

interface CustomRequest extends Request {
  imageFolder?: string;
  imageName?: string;
}

const storage = (imageFolder: string) => multer.diskStorage({
  filename: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${fileExtension}`);
  },

  destination: (
    _req: Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, `public/uploads/${imageFolder}`);
  },
});

const upload = (imageFolder: string) => multer({
  storage: storage(imageFolder),
});

function storeImage(req: CustomRequest, res: Response, next: NextFunction) {
  const urlPath = req.url;

  const regex = /^\/upload\/([^\/]+)/;
  const match = urlPath.match(regex);

  if (!match || !["product", "admin"].includes(match[1])) {
    const errorResponse: ErrorResponse = {
      success: false,
      errors: [
        {
          field: "urlPath",
          message: "Invalid URL path or no matching type found.",
          code: ErrorCode.ValidationError,
          severity: ErrorSeverity.Medium,
        },
      ],
    };
    return res.status(400).json(errorResponse);
  }

  const imageFolder = match[1];
  req.imageFolder = imageFolder;

  const uploadMiddleware = upload(imageFolder);

  uploadMiddleware.single("image")(req, res, (err: any) => {
    if (err instanceof MulterError) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "file",
            message: "Multer error occurred during file upload.",
            code: ErrorCode.ServerError,
            severity: ErrorSeverity.Medium,
          },
        ],
      };
      return res.status(400).json(errorResponse);
    } else if (err) {
      console.error("Upload error:", err);
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "file",
            message: "Unknown error occurred during file upload.",
            code: ErrorCode.ServerError,
            severity: ErrorSeverity.Critical,
          },
        ],
      };
      return res.status(500).json(errorResponse);
    }

    if (!req.file) {
      const errorResponse: ErrorResponse = {
        success: false,
        errors: [
          {
            field: "file",
            message: "No file uploaded.",
            code: ErrorCode.ValidationError,
            severity: ErrorSeverity.Medium,
          },
        ],
      };
      return res.status(400).json(errorResponse);
    }

    req.imageName = req.file.filename;
    next();
  });
}

export { storeImage };
