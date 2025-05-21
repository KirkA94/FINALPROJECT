import { PrismaClient } from '@prisma/client';

// Use a global variable to prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Create a single instance of Prisma Client
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Enable logging for debugging
  });

// Assign the Prisma Client instance to the global variable in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}