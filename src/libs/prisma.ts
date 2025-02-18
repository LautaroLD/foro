import { PrismaClient } from '@prisma/client';
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}
export const prisma = global.prisma || new PrismaClient();
if (process.env.NODE !== 'production') {
  global.prisma = prisma;
}
