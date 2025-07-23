// типы res API

export type ApiResponse<T = void | unknown> = {
  success: boolean;
  status?: number;
  message?: string;
  data?: T;
  error?: ApiErrorDetails;
  errors?: ApiErrorDetails[];
  exp?: number;
};

export type ApiErrorDetails = {
  code: string;
  message: string;
  field?: string;
  details?: unknown;
};
