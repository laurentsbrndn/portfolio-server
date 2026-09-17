import { Request, Response, NextFunction } from 'express';
import * as portfolioService from '../services/portfolio.service.js';
import { sendResponse } from '../utils/apiResponse.js';

export const getPortfolio = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await portfolioService.getFullPortfolioData();
    return sendResponse(res, 200, 'Data portofolio berhasil diambil', data);
  } catch (error) {
    next(error);
  }
};