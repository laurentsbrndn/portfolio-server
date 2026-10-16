import { Router } from 'express';
import { handleContactForm } from '../controllers/contact.controller.js';
import { contactRateLimiter } from '../middlewares/rateLimiter.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema } from '../validators/contact.schema.js';

const router = Router();

// Validate first, so invalid submissions don't consume the visitor's quota
router.post('/', validateBody(contactSchema), contactRateLimiter, handleContactForm);

export default router;