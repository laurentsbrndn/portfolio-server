import type { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/AppError.js';
import { sendResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof AppError) {
    sendResponse(res, err.statusCode, err.message);
    return;
  }

  // Errors thrown by express.json()
  if (err?.type === 'entity.parse.failed') {
    sendResponse(res, HTTP_STATUS.BAD_REQUEST, 'Invalid JSON payload.');
    return;
  }
  if (err?.type === 'entity.too.large') {
    sendResponse(res, HTTP_STATUS.PAYLOAD_TOO_LARGE, 'Request body is too large.');
    return;
  }

  // Unknown error: log details, never leak them to the client
  console.error(err);
  sendResponse(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    'Something went wrong. Please try again later.',
  );
};