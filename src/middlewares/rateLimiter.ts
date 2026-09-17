import rateLimit from 'express-rate-limit';

export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan pengiriman pesan. Silakan coba lagi 15 menit kemudian.',
  },
});