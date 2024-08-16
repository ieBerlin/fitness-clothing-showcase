import { Request, Response } from "express";
import Section from "../../models/Section";

const getSection = async (req: Request, res: Response) => {
  try {
    const { sectionId } = req.params;

    if (!sectionId) {
      return res
        .status(400)
        .json({ success: false, message: "Section ID is required" });
    }

    const section = await Section.find({ sectionId });

    if (section.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    res.status(200).json({ success: true, section });
  } catch (error) {
    console.error("Error fetching section:", error);
    res.status(500).json({ success: false, message: "Error fetching section" });
  }
};

export default getSection;
