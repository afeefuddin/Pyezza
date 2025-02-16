"use server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma, testPrisma } from "@repo/database";

export async function getUser() {
  let clerkUser;
  try {
    clerkUser = await currentUser();
  } catch (error) {
    clerkUser = undefined;
  }
  if (!clerkUser) {
    return null;
  }

  testPrisma();
  try {
    const data = prisma.user.upsert({
      where: {
        externalProviderId: clerkUser.id,
      },
      update: {
        imageUrl: clerkUser.imageUrl,
        name: clerkUser.fullName,
      },
      create: {
        email: clerkUser.emailAddresses[0].emailAddress,
        externalProviderId: clerkUser.id,
        imageUrl: clerkUser.imageUrl,
        name: clerkUser.fullName,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
