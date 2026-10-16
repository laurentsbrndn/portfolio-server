import type { Request, Response, NextFunction } from 'express';
import * as contactService from '../services/contact.service.js';
import { sendResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import type { ContactRequestBody } from '../types/contact.type.js';

// Body is already validated & normalized by validateBody(contactSchema)
export const handleContactForm = async (
  req: Request<Record<string, string>, unknown, ContactRequestBody>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await contactService.sendContactEmail(req.body);
    sendResponse(res, HTTP_STATUS.OK, 'Your message has been sent successfully!');
  } catch (error) {
    next(error);
  }
};