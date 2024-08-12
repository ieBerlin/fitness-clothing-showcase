import { Request, Response } from "express";
import Section from "../../models/Section";

const updateSectionItems = async (req: Request, res: Response) => {
  const { sectionId } = req.params;
  const { items } = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).json({
      success: false,
      message: "Invalid items array",
    });
  }

  try {
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { items },
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Section items updated successfully",
      data: section,
    });
  } catch (error) {
    console.error("Error updating section items:", error);
    res.status(500).json({
      success: false,
      message: "Error updating section items",
    });
  }
};

export default updateSectionItems;
