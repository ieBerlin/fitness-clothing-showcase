export type Angle = "back" | "front" | "side" | "top" | "bottom";

export interface Image {
  pathname: string;
  angle: Angle;
  _id: string;
}
export interface Size {
  name: string;
  quantity: number;
  sizeAvailability: Availability;
}

export interface ColorOption {
  name: Color;
  availableSizes: Size[];
}
export interface Product {
  _id: string;
  productName: string;
  productDescription: string;
  colors: ColorOption[];
  isUnisex: boolean;
  season: Season[];
  woolPercentage?: number;
  price: number;
  releaseDate: Date;
  images: Image[];
  availability: Availability;
}

export const genderSizes = {
  men: ["S", "M", "L", "XL", "2XL"],
  women: ["XS", "S", "M", "L", "XL", "2XL"],
};

export enum Season {
  Winter = "WINTER",
  Autumn = "AUTUMN",
  Spring = "SPRING",
  Summer = "SUMMER",
}

export enum Color {
  BLACK = "#000000",
  WHITE = "#FFFFFF",
  GRAY = "#808080",
  NAVY_BLUE = "#000080",
  RED = "#FF0000",
  BLUE = "#0000FF",
  GREEN = "#008000",
  OLIVE = "#808000",
  PURPLE = "#800080",
  PINK = "#FFC0CB",
  YELLOW = "#FFFF00",
  ORANGE = "#FFA500",
  BROWN = "#A52A2A",
  MAROON = "#800000",
  BEIGE = "#F5F5DC",
  TURQUOISE = "#40E0D0",
  TEAL = "#008080",
  BURGUNDY = "#800020",
  KHAKI = "#F0E68C",
  LILAC = "#C8A2C8",
}

export enum Availability {
  IN_STOCK = "in_stock",
  OUT_OF_STOCK = "out_of_stock",
  DISCOUNTED = "discounted",
  COMING_SOON = "coming_soon",
  OUT_OF_SEASON = "out_of_season",
  UNAVAILABLE = "unavailable",
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
}
export interface ProductResponse {
  success: boolean;
  product: Product;
}
export const allSizes = ["XS", "S", "M", "L", "XL", "2XL"];
