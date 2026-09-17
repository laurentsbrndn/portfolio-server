import { Request, Response, NextFunction } from 'express';
import * as contactService from '../services/contact.service.js';
import { sendResponse } from '../utils/apiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import type { ContactRequestBody } from '../types/contact.type.js';

export const handleContactForm = async (
  req: Request<{}, {}, ContactRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return sendResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Semua field (name, email, subject, message) wajib diisi'
      );
    }

    await contactService.sendContactEmail({ name, email, subject, message });
    return sendResponse(res, HTTP_STATUS.OK, 'Pesan Anda berhasil dikirim!');
  } catch (error) {
    next(error);
  }
};