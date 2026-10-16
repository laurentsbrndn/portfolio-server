import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { sendResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const validateBody =
  (schema: ZodType): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.') || 'body';
        errors[key] ??= issue.message;
      }
      // First message is shown directly by the frontend form
      const message = result.error.issues[0]?.message ?? 'Invalid request body.';
      sendResponse(res, HTTP_STATUS.BAD_REQUEST, message, undefined, errors);
      return;
    }

    req.body = result.data; // trimmed & normalized values
    next();
  };