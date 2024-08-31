import { ISection } from "../models/Section";

const staticSections: Partial<ISection>[] = [
  {
    name: "Popular Products",
    description: "The most popular products among our customers.",
  },
  {
    name: "New Arrivals",
    description: "The latest additions to our product range.",
  },
  {
    name: "Trending Now",
    description: "Products that are currently trending.",
  },
  {
    name: "On Sale",
    description: "Products currently available at a discounted price.",
  },
];

export default staticSections;
