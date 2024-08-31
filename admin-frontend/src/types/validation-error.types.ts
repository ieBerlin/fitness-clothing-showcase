import ErrorCode from "../enums/ErrorCode";
import { ErrorSeverity } from "../enums/ErrorSeverity";

export interface ErrorDetails {
  status: number;
  title: string;
  message: string;
  buttonLabel: string;
}
export type ValidationError = {
  field: string;
  message: string;
  code?: ErrorCode;
  severity?: ErrorSeverity;
};
