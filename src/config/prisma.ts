import { PrismaClient } from '@prisma/client';
import { isProduction } from './env.js';

// Single shared client for the whole process (connection pool is reused)
export const prisma = new PrismaClient({
  log: isProduction ? ['error'] : ['warn', 'error'],
});