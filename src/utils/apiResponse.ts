import type { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  errors?: Record<string, string>,
): void => {
  const body: ApiResponse<T> = { success: statusCode < 400, message };
  if (data !== undefined) body.data = data;
  if (errors) body.errors = errors;
  res.status(statusCode).json(body);
};