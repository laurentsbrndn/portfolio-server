import { z } from 'zod';

// Blocks CR/LF in fields that end up in email headers (header injection)
const SINGLE_LINE = /^[^\r\n]*$/;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must be at most 100 characters.')
    .regex(SINGLE_LINE, 'Name cannot contain line breaks.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, 'Email is too long.')
    .email('Please enter a valid email address.'),
  subject: z
    .string()
    .trim()
    .min(3, 'Subject must be at least 3 characters.')
    .max(150, 'Subject must be at most 150 characters.')
    .regex(SINGLE_LINE, 'Subject cannot contain line breaks.'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters.')
    .max(2000, 'Message must be at most 2000 characters.'),
});