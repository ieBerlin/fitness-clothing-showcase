import { Request, Response } from "express";
import Section from "../../models/Section";

const getAllSections = async (req: Request, res: Response) => {
  try {
    const sections = await Section.find();

    if (!sections.length) {
      return res
        .status(404)
        .json({ success: false, message: "No sections found" });
    }

    res.status(200).json({ success: true, sections });
  } catch (error) {
    console.error("Error fetching sections:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching sections" });
  }
};

export default getAllSections;
