import type { RequestHandler } from 'express';
import { sendResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const notFoundHandler: RequestHandler = (req, res) => {
  sendResponse(res, HTTP_STATUS.NOT_FOUND, `Route ${req.method} ${req.originalUrl} not found.`);
};