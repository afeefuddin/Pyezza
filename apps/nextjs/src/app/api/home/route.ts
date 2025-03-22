import { withError, withUser } from "@/lib/middleware";
import { NextResponse } from "next/server";
import { prisma } from "@repo/database";

export const GET = withError(
  withUser(async (req, res) => {
    const { id: userId } = req.user;

    const [integrations, channels, messages] = await prisma.$transaction([
      prisma.integration.count({ where: { userId } }),
      prisma.channel.count({ where: { integration: { userId } } }),
      prisma.message.count({ where: { channel: { integration: { userId } } } }),
    ]);

    return NextResponse.json({
      result: { integrations, channels, messages },
    });
  })
);
