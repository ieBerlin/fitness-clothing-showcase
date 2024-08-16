import { Request, Response } from "express";
import Admin from "../../models/Admin";
interface MulterRequest extends Request {
  imageName?: string;
}
const updateAdminImage = async (req: MulterRequest, res: Response) => {
  try {
    const imagePath: string = req.imageName!;
    const { adminId } = req.params;
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }
    await Admin.findByIdAndUpdate(
      adminId,
      { $set: { adminImage: imagePath } },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "Admin image updated successfully" });
  } catch (error) {
    console.error("Error updating Admin image:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update admin image" });
  }
};

export default updateAdminImage;
