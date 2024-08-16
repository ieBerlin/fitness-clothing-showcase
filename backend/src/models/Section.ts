import { Document, model, Schema } from "mongoose";
import { IProduct } from "./Product";

interface ISection extends Document {
  sectionId: string;
  name: string;
  description: string;
  items: IProduct[];
  createdAt?: Date;
  updatedAt?: Date;
}

const SectionSchema: Schema = new Schema(
  {
    sectionId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Section name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

SectionSchema.index({ name: 1 });

const Section = model<ISection>("Section", SectionSchema, "Section");

export default Section;
