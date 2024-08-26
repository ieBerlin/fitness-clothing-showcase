import { Document, Schema, model } from "mongoose";

type Angle = "back" | "front" | "side" | "top" | "bottom";

export interface IImage extends Document {
  pathname: string;
  angle?: Angle;
}
const ImageSchema: Schema<IImage> = new Schema(
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
const Image = model<IImage>("Image", ImageSchema);

export default Image;
