import staticSections from "../config/static-sections";
import Section from "../models/Section";

export async function initializeSections() {
  for (const section of staticSections) {
    const existingSection = await Section.findOne({ name: section.name });
    if (!existingSection) {
      await Section.create(section);
    }
  }
}
