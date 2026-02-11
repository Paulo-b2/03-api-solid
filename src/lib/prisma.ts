import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../env/index.js";

let prisma: PrismaClient | null = null;

export function getPrisma() {
  if (!prisma) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not defined before Prisma initialization");
    }

    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    prisma = new PrismaClient({
      adapter,
      log: env.NODE_ENV === "dev" ? ["query"] : [],
    });
  }

  return prisma;
}
