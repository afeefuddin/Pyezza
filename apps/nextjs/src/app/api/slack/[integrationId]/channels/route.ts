import { withError, withUser } from "@/lib/middleware";
import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { SlackApi } from "@repo/lib/slack-api";
import { z } from "zod";

export const GET = withError(
  withUser(async (req, { params }) => {
    const integrationId = params.integrationId;
    if (!integrationId) {
      return NextResponse.json(
        { msg: "integrationId is required" },
        { status: 400 }
      );
    }

    const integration = await prisma.integration.findFirst({
      where: {
        publicId: integrationId,
        user: req.user,
      },
      select: {
        token: true,
      },
    });
    if (!integration || !integration.token) {
      return NextResponse.json({
        channels: [],
        warn: "integration not found",
      });
    }

    const slackapi = new SlackApi(integration.token);
    const channels = await slackapi.getChannels();
    return NextResponse.json({
      channels,
    });
  })
);

const joinChannelRequestSchema = z.object({
  channel: z.intersection(
    z.object({
      channelType: z.enum([
        "socialsips",
        "wouldyourather",
        "spotlight",
        "celebration",
      ]),
    }),
    z.discriminatedUnion("new", [
      z.object({
        new: z.literal(false),
        channelId: z.string(),
      }),
      z.object({
        new: z.literal(true),
        channelName: z.string(),
      }),
    ])
  ),
});

async function createChannel(
  slackApi: SlackApi,
  channelName: string,
  type: "socialsips" | "wouldyourather" | "spotlight" | "celebration",
  integrationId: number
): Promise<boolean> {
  let data:
    | {
        ok: true;
        channel: {
          id: string;
        };
      }
    | {
        ok: false;
        error: string;
      };

  try {
    const channel = await prisma.channel.create({
      data: {
        type,
        integrationId,
        channelName,
        active: false,
      },
    });

    data = await slackApi.createChannel(channelName);

    await prisma.$transaction(async (prisma) => {
      if (data.ok) {
        await prisma.channel.update({
          where: {
            id: channel.id,
          },
          data: {
            active: true,
            channelId: data.channel.id,
          },
        });

        const integration = await prisma.integration.findUnique({
          where: {
            id: integrationId,
          },
          include: {
            channels: true,
          },
        });

        if (integration?.channels.length && !integration.onboardingCompleted) {
          await prisma.integration.update({
            where: {
              id: integrationId,
            },
            data: {
              onboardingCompleted: true,
            },
          });
        }
      } else {
        await prisma.channel.delete({
          where: {
            id: channel.id,
          },
        });
      }
    });

    return data.ok;
  } catch (error) {
    console.error("Error creating channel:", error);
    return false;
  }
}

async function joinChannel(
  slackApi: SlackApi,
  channelId: string,
  type: "socialsips" | "wouldyourather" | "spotlight" | "celebration",
  integrationId: number
): Promise<boolean> {
  let data:
    | {
        channel: {
          id: string;
          name: string;
        };
        ok: true;
      }
    | {
        error: string;
        ok: false;
      };

  try {
    const channel = await prisma.channel.create({
      data: {
        type,
        integrationId,
        channelId,
        active: false,
      },
    });

    data = await slackApi.joinChannel(channelId);

    await prisma.$transaction(async (prisma) => {
      if (data.ok) {
        await prisma.channel.update({
          where: {
            id: channel.id,
          },
          data: {
            active: true,
            channelId: data.channel.id,
          },
        });

        const integration = await prisma.integration.findUnique({
          where: {
            id: integrationId,
          },
          include: { channels: true },
        });

        if (integration?.channels.length && !integration.onboardingCompleted) {
          await prisma.integration.update({
            where: {
              id: integrationId,
            },
            data: {
              onboardingCompleted: true,
            },
          });
        }
      } else {
        await prisma.channel.delete({
          where: {
            id: channel.id,
          },
        });
      }
    });

    return data.ok;
  } catch (error) {
    console.error("Error joining channel:", error);
    return false;
  }
}

export const POST = withError(
  withUser(async (req, { params }) => {
    const integrationId = (await params).integrationId;
    if (!integrationId) {
      return NextResponse.json(
        { msg: "integrationId is required" },
        { status: 400 }
      );
    }

    const integration = await prisma.integration.findFirst({
      where: {
        publicId: integrationId,
        user: req.user,
      },
      select: {
        token: true,
        id: true,
      },
    });
    if (!integration || !integration.token) {
      return NextResponse.json({
        channels: [],
        warn: "integration not found",
      });
    }

    const rawData = await req.json();
    const parsedData = joinChannelRequestSchema.parse(rawData);

    const slackapi = new SlackApi(integration.token);

    const c = parsedData.channel;
    let response: boolean;
    if (c.new) {
      response = await createChannel(
        slackapi,
        c.channelName,
        c.channelType,
        integration.id
      );
    } else {
      response = await joinChannel(
        slackapi,
        c.channelId,
        c.channelType,
        integration.id
      );
    }

    return NextResponse.json({ response });
  })
);
