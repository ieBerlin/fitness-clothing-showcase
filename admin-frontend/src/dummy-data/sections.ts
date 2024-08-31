// import Section from "../models/Section";
import { sampleProducts } from "./products";

import Section from "../models/Section";

export const staticSections: Partial<Section>[] = [
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

const addStaticSectionDetails = (sections: Section[]): Section[] => {
  return sections.map((section) => {
    const staticSection = staticSections.find((s) => s._id === section.name);
    return {
      ...section,
      name: staticSection?.name || section.name,
      description: staticSection?.description || section.description,
    };
  });
};

export const currentMonthSections: Section[] = addStaticSectionDetails([
  {
    _id: "section1",
    name: "popular-products",
    description: "Top-selling products this month.",
    items: sampleProducts.map((item) => item._id),
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-08-28"),
  },
  {
    _id: "section2",
    name: "new-arrivals",
    description: "Fresh new products added this month.",
    items: sampleProducts.map((item) => item._id),
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-08-28"),
  },
  {
    _id: "section3",
    name: "trending-now",
    description: "Products gaining popularity this month.",
    items: sampleProducts.map((item) => item._id),
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-08-28"),
  },
  {
    _id: "section4",
    name: "on-sale",
    description: "Discounted products available this month.",
    items: sampleProducts.map((item) => item._id),
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date("2024-08-28"),
  },
]);

export const previousMonthSections: Section[] = addStaticSectionDetails([
  {
    _id: "section1",
    name: "popular-products",
    description: "Top-selling products last month.",
    items: sampleProducts.map((item) => item._id),
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-07-31"),
  },
  {
    _id: "section2",
    name: "new-arrivals",
    description: "Fresh new products added last month.",
    items: sampleProducts.map((item) => item._id),
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-07-31"),
  },
  {
    _id: "section3",
    name: "trending-now",
    description: "Products gaining popularity last month.",
    items: sampleProducts.map((item) => item._id),
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-07-31"),
  },
  {
    _id: "section4",
    name: "on-sale",
    description: "Discounted products available last month.",
    items: sampleProducts.map((item) => item._id),
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-07-31"),
  },
]);

export const systemActivities = [
  {
    date: "2024-08-25",
    action: "Created",
    productName: "Product A",
    user: "Admin1",
  },
  {
    date: "2024-08-26",
    action: "Updated",
    productName: "Product B",
    user: "Admin2",
  },
  {
    date: "2024-08-27",
    action: "Deleted",
    productName: "Product C",
    user: "Admin1",
  },
  {
    date: "2024-08-27",
    action: "Created",
    productName: "Product D",
    user: "Admin3",
  },
];
