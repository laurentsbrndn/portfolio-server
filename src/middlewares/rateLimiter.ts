import type { RequestHandler } from 'express';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from '../config/env.js';
import { sendResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

// Shared across all serverless instances (unlike an in-memory store)
const contactLimiter =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(3, '15 m'),
        prefix: 'portfolio:contact',
      })
    : null; // Local dev without Upstash: limiter disabled

/** 3 successful contact submissions per 15 minutes per IP. */
export const contactRateLimiter: RequestHandler = async (req, res, next) => {
  if (!contactLimiter) {
    next();
    return;
  }

  try {
    const { success, limit, remaining, reset } = await contactLimiter.limit(req.ip ?? 'unknown');

    res.setHeader('RateLimit-Limit', limit);
    res.setHeader('RateLimit-Remaining', remaining);

    if (!success) {
      res.setHeader('Retry-After', Math.max(1, Math.ceil((reset - Date.now()) / 1000)));
      sendResponse(
        res,
        HTTP_STATUS.TOO_MANY_REQUESTS,
        'Too many messages sent. Please try again in 15 minutes.',
      );
      return;
    }

    next();
  } catch (error) {
    // Fail open: a Redis outage must not block legitimate visitors
    console.error('Rate limiter unavailable:', error);
    next();
  }
};