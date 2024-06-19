import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';

const getPrisma = () => {
  const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
  const adapter = new PrismaNeon(neon);
  const prisma = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : [],
  });
  return prisma;
};

const prisma = getPrisma();

export default prisma;
