import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { env, allowedOrigins } from './config/env.js';
import routes from './routes/index.js';
import { apiRateLimiter } from './middlewares/rateLimiter.js';
import { notFoundHandler } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Real client IP behind a proxy (required for correct rate limiting)
app.set('trust proxy', env.TRUST_PROXY);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    maxAge: 86_400, // cache preflight for 24h
  }),
);
app.use(compression());
app.use(express.json({ limit: '10kb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', apiRateLimiter, routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;