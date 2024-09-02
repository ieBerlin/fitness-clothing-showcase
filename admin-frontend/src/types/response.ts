import ErrorCode from "../enums/ErrorCode";
import { ErrorSeverity } from "../enums/ErrorSeverity";
import Activity from "../models/Activity";
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
export type ProductsResponse = {
  products?: Product[];
  count?: number;
  totalPages?: number;
  currentPage?: number;
  totalProducts?: number;
};
//

export interface SectionResponseItem {
  section: Section;
  products: Product[];
}
export interface ActivitiesResponse {
  activities: Activity[];
  totalActivities: number;
  currentPage: number;
  totalPages: number;
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
