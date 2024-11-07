import ErrorCode from "../enums/ErrorCode";
import ErrorSeverity from "../enums/ErrorSeverity";
import Admin from "../models/Admin";
import Product from "../models/Product";
import Section from "../models/Section";
import { ValidationError } from "./validation-error.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
}
export interface ErrorResponse {
  success: boolean;
  errors: ValidationError[];
  statusCode?: number;
}
export interface DataResponse<T> {
  items?: T[];
  count?: number;
  totalPages?: number;
  currentPage?: number;
  totalItems?: number;
}

//

export interface SectionResponseItem {
  section: Section;
  products: DataResponse<Product>;
}

export interface AdminProfileResponse {
  adminId: string;
  adminEmail: string;
  adminImage: string;
}
export interface StatisticsResponse {
  totalAdmins: number;
  totalProducts: number;
  totalTraffic: number;
}
export type AdminResponse = Admin;
export type SectionsResponse = SectionResponseItem[];
export type SectionResponse = Section;
export type ProductResponse = Product;
export type ProductsCountResponse = number;

//

export interface IAdmin {
  email: string;
  password: string;
}
export interface IAuthResponse {
  token: string;
}
export interface IErrorResponse {
  error: string;
  status: number;
}
export interface StoreImageResponse {
  success: boolean;
  message: string;
}
export const createErrorResponse = (
  message: string,
  statusCode: number,
  field: string,
  code: ErrorCode,
  severity: ErrorSeverity,
  errors: ValidationError[] = []
): ErrorResponse => ({
  success: false,
  errors: [
    ...errors,
    {
      field,
      message,
      code,
      severity,
    },
  ],
  statusCode,
});
