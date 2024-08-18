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
export class ErrorDetails {
  constructor(
    public status: number,
    public title: string,
    public message: string,
    public buttonLabel: string
  ) {}
}
