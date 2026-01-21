import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@/env/index.js";

//o adapter se tornou obrigátorio a partir da v7 do prismas
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
  adapter,
  log: env.NODE_ENV === "dev" ? ["query"] : [],
});
