interface Size {
  name: string;
  quantity: number;
  sizeAvailability: Availability;
}

interface ColorOption {
  name: Color;
  availableSizes: Size[];
}
export interface Product {
  productName: string;
  productDescription: string;
  colors: ColorOption[];
  isUnisex: boolean;
  season: Season[];
  woolPercentage?: number;
  price: number;
  releaseDate: Date;
  images: IImage[];
  availability: Availability;
}
interface IImage extends Document {
  pathname: string;
  angle?: "back" | "front" | "side" | "top" | "bottom";
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
  BLACK = "black",
  WHITE = "white",
  GRAY = "gray",
  NAVY_BLUE = "navy blue",
  RED = "red",
  BLUE = "blue",
  GREEN = "green",
  OLIVE = "olive",
  PURPLE = "purple",
  PINK = "pink",
  YELLOW = "yellow",
  ORANGE = "orange",
  BROWN = "brown",
  MAROON = "maroon",
  BEIGE = "beige",
  TURQUOISE = "turquoise",
  TEAL = "teal",
  BURGUNDY = "burgundy",
  KHAKI = "khaki",
  LILAC = "lilac",
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
