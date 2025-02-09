"use server";

import { convertToLocal } from "@/lib/timezone";
import { prisma } from "@repo/database";

export async function getChannelSettings(channelId: string) {
  const channel = await prisma.channel.findUnique({
    where: {
      publicId: channelId,
    },
  });
  if (!channel) {
    return null;
  }

  // we don't need settings for celebration channel
  if (channel.type === "celebration") {
    return {
      channel: {
        channelName: channel.channelName,
        type: "celebration",
        publicId: channel.publicId,
      },
    };
  }

  const data = await prisma.channelSetting.upsert({
    create: {
      channel: {
        connect: {
          publicId: channelId,
        },
      },
    },
    where: {
      channelId: channel.id,
    },
    update: {},
    include: {
      channel: {
        select: {
          channelName: true,
          type: true,
          publicId: true,
        },
      },
    },
  });

  return data;
}
