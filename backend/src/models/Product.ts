import { Document, Schema, model } from "mongoose";
import { Color, Season, Availability } from "../config/product-attributes";
import { IImage } from "./Image";

export interface Size {
  name: string;
  quantity: number;
  sizeAvailability: Availability;
}

export interface ColorOption {
  name: Color;
  availableSizes: Size[];
}

export interface IProduct extends Document {
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

const ProductSchema: Schema = new Schema({
  productName: { type: String, required: true },
  productDescription: { type: String, required: true },
  colors: [
    {
      name: { type: String, enum: Object.values(Color), required: true },
      availableSizes: [
        {
          name: { type: String, required: true },
          quantity: { type: Number, required: true },
          sizeAvailability: {
            type: String,
            enum: Object.values(Availability),
            required: true,
          },
        },
      ],
    },
  ],
  isUnisex: { type: Boolean, required: true },
  season: { type: [String], enum: Object.values(Season), required: true },
  woolPercentage: { type: Number, min: 0, max: 100 },
  price: { type: Number, required: true },
  releaseDate: { type: Date, required: true },
  images: [
    {
      pathname: { type: String, required: true },
      angle: {
        type: String,
        enum: ["back", "front", "side", "top", "bottom"],
        required: true,
      },
    },
  ],
  availability: {
    type: String,
    enum: Object.values(Availability),
    required: true,
  },
});

const Product = model<IProduct>("Product", ProductSchema, "Product");

export default Product;
