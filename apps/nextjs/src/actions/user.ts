"use server";
import { currentUser, User } from "@clerk/nextjs/server";
import { prisma, testPrisma } from "@repo/database";

export async function getUser() {
  let clerkUser: User | undefined;
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
    let data = await prisma.user.findFirst({
      where: {
        externalProviderId: clerkUser.id,
      },
    });
    if (!data) {
      data = await prisma.user.create({
        data: {
          email: clerkUser.emailAddresses[0].emailAddress,
          externalProviderId: clerkUser.id,
          imageUrl: clerkUser.imageUrl,
          name: clerkUser.fullName,
        },
      });
    }

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
