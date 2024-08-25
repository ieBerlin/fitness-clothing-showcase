import { InputHTMLAttributes } from "react";
import { ColorOption, Image, Size } from "./product.types";

export interface NumberInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  readonly?: boolean;
  label?: string;
  min?: number;
  max?: number;
  name: string;
}
export interface Step {
  id: string;
  label: string;
}
export interface SizesProps {
  isUnisex: boolean;
  availableSizes: Size[];
  visibility: boolean;
}

export interface ColorItemProps {
  colorOption: ColorOption;
  isSelected: boolean;
  isUnisex: boolean;
}
export const steps: Step[] = [
  { id: "basic-info", label: "Basic Product Information" },
  { id: "color-selection", label: "Chosen Colors" },
  { id: "image-upload", label: "Images" },
];
export interface FetchProductParams {
  productId: string;
}
export interface ImagePickerProps {
  label: string;
  image?: Image;
}
export interface StoreImageResponse {
  success: boolean;
  message: string;
}
