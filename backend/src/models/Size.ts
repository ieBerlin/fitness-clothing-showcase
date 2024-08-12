import { Document, Schema, model } from "mongoose";

export interface ISize extends Document {
  id: string;
  value: string;
  available: boolean;
  quantity: number;
  color: string;
}

const SizeSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  available: { type: Boolean, required: true },
  quantity: { type: Number, required: true },
  color: { type: String, required: true },
});

const Size = model<ISize>("Size", SizeSchema, "Size");

export default Size;
