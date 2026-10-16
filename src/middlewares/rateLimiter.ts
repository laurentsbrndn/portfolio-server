import rateLimit from 'express-rate-limit';
import { sendResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

/** Global safety net for all API routes. */
export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => {
    sendResponse(res, HTTP_STATUS.TOO_MANY_REQUESTS, 'Too many requests. Please slow down.');
  },
});

/** Strict limit for the contact form: 3 successful messages per 15 minutes per IP. */
export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipFailedRequests: true, // validation errors don't consume the user's quota
  handler: (_req, res) => {
    sendResponse(
      res,
      HTTP_STATUS.TOO_MANY_REQUESTS,
      'Too many messages sent. Please try again in 15 minutes.',
    );
  },
});