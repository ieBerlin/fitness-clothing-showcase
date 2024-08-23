import { Availability } from "../types/product.types";

export function determineSizeAvailability(quantity: number): Availability {
  if (quantity > 10) {
    return Availability.IN_STOCK;
  } else if (quantity > 0 && quantity <= 10) {
    return Availability.DISCOUNTED;
  } else {
    return Availability.OUT_OF_STOCK;
  }
}
export const availabilityOptions = Object.entries(Availability).map(
  ([key, value]) => ({
    label: key.replace(/_/g, " ").toUpperCase(),
    value: value,
  })
);
