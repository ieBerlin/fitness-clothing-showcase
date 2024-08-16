import { Request, Response, NextFunction } from "express";
import multer, { MulterError } from "multer";
import path from "path";

interface CustomRequest extends Request {
  imageFolder?: string;
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
    return res.status(400).json({
      success: false,
      error: "Invalid URL path or no matching type found.",
    });
  }

  const imageFolder = match[1];
  req.imageFolder = imageFolder;

  const uploadMiddleware = upload(imageFolder);

  uploadMiddleware.single("image")(req, res, (err: any) => {
    if (err instanceof MulterError) {
      return res.status(400).json({ success: false, error: "Multer error occurred." });
    } else if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ success: false, error: "Unknown error occurred." });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded." });
    }

    (req as any).imageName = req.file.filename;
    next();
  });
}

export { storeImage };
