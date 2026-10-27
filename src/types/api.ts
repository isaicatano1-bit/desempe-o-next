export type ApiErrorResponse = {
  message: string;
  errors?: Record<string, string[]>;
};

export type ApiSuccessResponse<T> = {
  message: string;
  data: T;
};
