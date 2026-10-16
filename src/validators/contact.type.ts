import type { z } from 'zod';
import type { contactSchema } from '../validators/contact.schema.js';

// Single source of truth: the type is derived from the validation schema
export type ContactRequestBody = z.infer<typeof contactSchema>;