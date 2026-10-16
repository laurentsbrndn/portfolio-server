import { transporter } from '../config/mailer.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import type { ContactRequestBody } from '../types/contact.type.js';

const buildHtml = ({ name, email, subject, message }: ContactRequestBody): string => {
  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    subject: escapeHtml(subject),
    message: escapeHtml(message),
  };

  return `
    <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; padding: 24px; color: #111;">
      <h2 style="margin: 0 0 16px; font-size: 18px;">New message from your portfolio</h2>
      <p style="margin: 4px 0;"><strong>Name:</strong> ${safe.name}</p>
      <p style="margin: 4px 0;"><strong>Email:</strong> ${safe.email}</p>
      <p style="margin: 4px 0;"><strong>Subject:</strong> ${safe.subject}</p>
      <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;" />
      <p style="white-space: pre-wrap; background: #fafafa; border: 1px solid #e5e5e5; padding: 16px; border-radius: 8px; line-height: 1.6;">${safe.message}</p>
    </div>
  `;
};

export const sendContactEmail = async (payload: ContactRequestBody): Promise<void> => {
  const { name, email, subject, message } = payload;

  try {
    await transporter.sendMail({
      // Must be your own SMTP address (SPF/DMARC); the visitor goes in Reply-To
      from: { name: `${name} via Portfolio`, address: env.SMTP_USER },
      replyTo: { name, address: email },
      to: env.CONTACT_RECEIVER_EMAIL,
      subject: `[Portfolio Contact] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
      html: buildHtml(payload),
    });
  } catch (error) {
    console.error('Failed to send contact email:', error);
    throw new AppError(
      HTTP_STATUS.BAD_GATEWAY,
      'Your message could not be sent right now. Please try again later.',
    );
  }
};