import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import Admin from "../../models/Admin";

const deleteAdminImage = async (req: Request, res: Response) => {
  const { adminId } = req.params;
  console.log(adminId);
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found." });
    }

    const imagePath = path.join(
      __dirname,
      "../../../public/uploads/admin",
      admin.adminImage
    );

    // Remove the file from the file system
    try {
      await fs.unlink(imagePath);
    } catch (fileError) {
      console.error("Error deleting image file:", fileError);
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete image file." });
    }

    // Remove the image path from the admin document
    admin.adminImage = "";
    await admin.save();

    res
      .status(200)
      .json({ success: true, message: "Admin image deleted successfully." });
  } catch (dbError) {
    console.error("Error deleting admin image:", dbError);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete admin image." });
  }
};

export default deleteAdminImage;
