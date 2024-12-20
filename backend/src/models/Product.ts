import { Document, Schema, model } from "mongoose";
import { IImage } from "./Image";
import Availability from "./../enums/Availability";
import Season from "./../enums/Season";
import Color from "./../enums/Color";
import Gender from "./../enums/Gender";

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
  gender: Gender;
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
  gender: { type: String, enum: Object.values(Gender), required: true },
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
