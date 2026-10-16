import nodemailer from 'nodemailer';
import { env } from './env.js';

// Created once and reused for every email
export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465, // 465 = implicit TLS, 587 = STARTTLS
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

/** Checks SMTP credentials at startup. Logs instead of crashing the API. */
export const verifyMailer = async (): Promise<void> => {
  try {
    await transporter.verify();
    console.log('✅ SMTP connection ready');
  } catch (error) {
    console.error('⚠️  SMTP verification failed. Contact form will not work:', error);
  }
};