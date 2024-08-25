import { Availability, Season } from "../types/product.types";

export const availabilityOptions = Object.entries(Availability).map(
  ([key, value]) => ({
    label: key.replace(/_/g, " ").toUpperCase(),
    value: value.toLowerCase(),
  })
);
export const seasonOptions = Object.entries(Season).map(([key, value]) => ({
  value: value.toLowerCase(),
  label: key.toUpperCase(),
}));
