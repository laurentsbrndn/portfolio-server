import { Router } from 'express';
import { getPortfolio } from '../controllers/portfolio.controller.js';

const router = Router();

router.get('/', getPortfolio);

export default router;