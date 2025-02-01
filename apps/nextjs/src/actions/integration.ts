"use server";
import { prisma } from "@repo/database";
import { getUser } from "./user";

export async function getIntegrations() {
  try {
    const user = await getUser();
    if (!user) return null;
    const response = await prisma.integration.findMany({
      where: {
        userId: user.id,
      },
    });
    return response;
  } catch {
    return null;
  }
}

export async function getIntegration(publicId: string) {
  const user = await getUser();
  if (!user) return null;
  try {
    const resposne = await prisma.integration.findFirst({
      where: {
        user: user,
        publicId: publicId,
      },
      include: {
        channels: {
          where: {
            active: true,
          },
        },
      },
    });
    return resposne;
  } catch {
    return null;
  }
}
