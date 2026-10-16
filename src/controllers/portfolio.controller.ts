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

    // Browser: 60s (max-age).
    // Vercel CDN: 5 min (s-maxage), then serves stale while refreshing in the
    // background for up to 1 day. Vercel strips s-maxage/SWR before the browser.
    res.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400');
    sendResponse(res, HTTP_STATUS.OK, 'Portfolio data retrieved successfully.', data);
  } catch (error) {
    next(error);
  }
};