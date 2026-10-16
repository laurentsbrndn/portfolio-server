import { Resend } from 'resend';
import { env } from './env.js';

// HTTPS API: no SMTP ports needed, works on serverless platforms
export const resend = new Resend(env.RESEND_API_KEY);