import { Document, Schema, model } from "mongoose";

export interface IImage extends Document {
  pathname: string;
  angle?: "back" | "front" | "side" | "top" | "bottom";
}

const ImageSchema: Schema = new Schema(
  {
    pathname: {
      type: String,
      required: true,
      unique: true,
    },
    angle: {
      type: String,
      enum: ["back", "front", "side", "top", "bottom"],
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

const Image = model<IImage>("Image", ImageSchema, "Image");

export default Image;
