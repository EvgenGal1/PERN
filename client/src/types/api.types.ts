// типы res API

export type ApiResponse<T = unknown | void> = {
  success: boolean;
  status?: number;
  message?: string;
  data?: T;
  error?: ApiErrorDetails[];
  exp?: number;
};

export type ApiErrorDetails = {
  code: string;
  message: string;
  field?: string;
  details?: unknown;
};
