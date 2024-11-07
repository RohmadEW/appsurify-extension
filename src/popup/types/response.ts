export interface ErrorResponse<R = Record<string, string>> {
  code?: string;
  detail?: string;
  non_field_errors?: string[];
  message?: R;
}

export interface Response<R = Record<string, string>> {
  success: boolean;
  detail: string;
  data?: R;
}

export interface PaginatedResponse<R = Record<string, string>> {
  count: number;
  next: string | null;
  previous: string | null;
  results: R[];
}
