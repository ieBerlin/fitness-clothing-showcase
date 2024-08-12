import { Document, Schema, model, Types } from "mongoose";
import { ISize } from "./Size";

enum Season {
  Winter = "WINTER",
  Autumn = "AUTUMN",
  Spring = "SPRING",
  Summer = "SUMMER",
}

interface IProduct extends Document {
  productId: string;
  productName: string;
  productDescription: string;
  sizes: Types.DocumentArray<ISize>;
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
  sizes: {
    type: [{ type: Schema.Types.ObjectId, ref: "Size" }],
    required: true,
    default: [],
  },
  isUnisex: { type: Boolean, required: true },
  season: { type: String, enum: Object.values(Season), required: true },
  woolPercentage: { type: Number, required: true, min: 0, max: 100 },
  price: { type: Number, required: true },
  releaseDate: { type: Date, required: true },
  image: { type: [String], required: true },
});

const Product = model<IProduct>("Product", ProductSchema, "products");

export default Product;
