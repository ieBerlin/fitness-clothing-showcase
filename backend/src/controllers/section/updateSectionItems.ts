import { Request, Response } from "express";
import Section from "../../models/Section";
import Product from "../../models/Product";
import mongoose from "mongoose";

const updateSectionItems = async (req: Request, res: Response) => {
  const { sectionId } = req.params;
  const { items } = req.body;

  // Validate the items array
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid items array. Ensure it is a non-empty array.",
    });
  }

  try {
    const section = await Section.findOne({ sectionId });
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found.",
      });
    }

    for (const item of items) {
      // Ensure item._id is a valid ObjectId
      if (!item._id || !mongoose.Types.ObjectId.isValid(item._id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid ObjectId for item: ${JSON.stringify(item)}`,
        });
      }
      const productExists = await Product.findById(
        item._id as mongoose.Types.ObjectId
      );

      if (!productExists) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item._id} not found.`,
        });
      }
    }

    const updatedSection = await Section.findOneAndUpdate(
      { sectionId },
      { items },
      { new: true, runValidators: true }
    );

    if (!updatedSection) {
      return res.status(404).json({
        success: false,
        message: "Section not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Section items updated successfully.",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Error updating section items:", error);
    res.status(500).json({
      success: false,
      message: "Error updating section items.",
    });
  }
};

export default updateSectionItems;
