import { Document, Schema, model, Types } from "mongoose";
import { Color, Season } from "../config/product-attributes";

interface Size {
  name: string;
  quantity: number;
}
interface ColorOption {
  name: Color;
  availableSizes: Size[];
}

export interface IProduct extends Document {
  productId: string;
  productName: string;
  productDescription: string;
  colors: ColorOption[];
  isUnisex: boolean;
  season: Season;
  woolPercentage: number;
  price: number;
  releaseDate: Date;
  image: string[];
}

const ProductSchema: Schema = new Schema({
  productId: { type: String, required: true, unique: true },
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  colors: { type: [String], required: true },
  isUnisex: { type: Boolean, required: true },
  season: { type: String, enum: Object.values(Season), required: true },
  woolPercentage: { type: Number, required: true, min: 0, max: 100 },
  price: { type: Number, required: true },
  releaseDate: { type: Date, required: true },
  image: { type: [String], required: true },
});

const Product = model<IProduct>("Product", ProductSchema, "Product");

export default Product;
