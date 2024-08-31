import Availability from "../enums/Availability";
export const allSizes = ["XS", "S", "M", "L", "XL", "2XL"];
export const genderSizes = {
  men: ["S", "M", "L", "XL", "2XL"],
  women: ["XS", "S", "M", "L", "XL", "2XL"],
};

interface Size {
  _id: string;
  name: string;
  quantity: number;
  sizeAvailability: Availability;
}
export const defaultSizes = (): Partial<Size>[] => {
  return allSizes.map((size) => ({
    name: size,
    quantity: 0,
    sizeAvailability: Availability.IN_STOCK,
  }));
};

export default Size;
