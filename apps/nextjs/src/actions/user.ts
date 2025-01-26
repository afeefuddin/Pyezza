"use server"
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@repo/database";

export  async function getUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    console.log("no clerk user");
    return null;
  }
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

    console.log("no data found");
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
