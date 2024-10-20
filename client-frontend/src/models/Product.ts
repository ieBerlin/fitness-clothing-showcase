import Availability from "../enums/Availability";
import Season from "../enums/Season";
import ColorOption from "./Color";
import Image from "./Image";

interface Product {
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
export default Product;
