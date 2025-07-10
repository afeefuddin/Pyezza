"use server";
import { currentUser, User } from "@clerk/nextjs/server";
import { prisma } from "@repo/database";

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

  try {
    const data = await prisma.$transaction(async (tx) => {
      let existingUser = await tx.user.findFirst({
        where: {
          externalProviderId: clerkUser.id,
        },
      });

      if (!existingUser) {
        existingUser = await tx.user.create({
          data: {
            email: clerkUser.emailAddresses[0]?.emailAddress,
            externalProviderId: clerkUser.id,
            imageUrl: clerkUser.imageUrl,
            name: clerkUser.fullName,
          },
        });
      }

      return existingUser;
    });

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
