import { Router } from 'express';
import portfolioRoutes from './portfolio.routes.js';
import contactRoutes from './contact.routes.js';

const router = Router();

router.use('/portfolio', portfolioRoutes);
router.use('/contact', contactRoutes);

export default router;