import { Router } from 'express';
import { handleContactForm } from '../controllers/contact.controller.js';
import { contactRateLimiter } from '../middlewares/rateLimiter.js';
import { validateBody } from '../middlewares/validateBody.js';
import { contactSchema } from '../validators/contact.schema.js';

const router = Router();

router.post('/', contactRateLimiter, validateBody(contactSchema), handleContactForm);

export default router;