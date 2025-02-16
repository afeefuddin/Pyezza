import { PrismaClient } from "@prisma/client";
import type { Prisma, PrismaClient as PrismaClientType } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

type ModelNames = Prisma.ModelName;
export type PrismaModels = {
  [M in ModelNames]: Exclude<
    Awaited<ReturnType<PrismaClientType[Uncapitalize<M>]["findUnique"]>>,
    null
  >;
};

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export const testPrisma = () => {};
