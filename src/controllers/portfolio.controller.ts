import type { Request, Response, NextFunction } from 'express';
import * as portfolioService from '../services/portfolio.service.js';
import { sendResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const getPortfolio = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await portfolioService.getFullPortfolioData();

    // Browser/CDN may reuse for 60s, then revalidate in the background.
    // Express adds a weak ETag automatically, so unchanged data returns 304.
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    sendResponse(res, HTTP_STATUS.OK, 'Portfolio data retrieved successfully.', data);
  } catch (error) {
    next(error);
  }
};