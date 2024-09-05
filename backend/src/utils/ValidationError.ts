import ErrorCode from "../enums/ErrorCode";
import ErrorSeverity from "../enums/ErrorSeverity";

export type ValidationError = {
  field: string;
  message: string;
  code?: ErrorCode;
  severity?: ErrorSeverity;
};
