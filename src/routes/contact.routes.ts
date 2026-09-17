import { Router } from 'express';
import { handleContactForm } from '../controllers/contact.controller.js';
import { contactRateLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/', contactRateLimiter, handleContactForm);

export default router;