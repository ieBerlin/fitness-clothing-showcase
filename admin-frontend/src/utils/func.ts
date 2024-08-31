import Availability from "../enums/Availability";
import Season from "../enums/Season";
import Product from "../models/Product";

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
export function productsQuantity(product: Product): number {
  let quantity: number = 0;
  product.colors.forEach((color) =>
    color.availableSizes.map((size) => {
      quantity += size.quantity;
    })
  );
  return quantity;
}
