export enum ErrorSeverity {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Critical = "Critical",
}

export enum ErrorCode {
  InvalidToken = "INVALID_TOKEN",
  NotFound = "NOT_FOUND",
  ValidationError = "VALIDATION_ERROR",
  ServerError = "SERVER_ERROR",
  NetworkError = "NETWORK_ERROR",
  UnknownError = "UNKNOWN_ERROR",
}

export type ValidationError = {
  field: string;
  message: string;
  code?: ErrorCode;
  severity?: ErrorSeverity; 
};