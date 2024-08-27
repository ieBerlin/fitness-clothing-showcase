import { ValidationError } from "./ValidationError";

export interface SuccessResponse<T = any> {
    success: true;
    data: T;
  }
  export interface ErrorResponse {
    success: boolean;
    errors: ValidationError[];
    statusCode?: number; 
    message?: string; 
  }
  
  