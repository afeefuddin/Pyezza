import { withError, withUser } from "@/lib/middleware";
import { NextResponse } from "next/server";
import { prisma } from "@repo/database";
import { SlackApi } from "@/lib/slack-api";
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
  channels: z.array(
    z.intersection(
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
    )
  ),
});

async function createChannel(
  slackApi: SlackApi,
  channelName: string,
  type: "socialsips" | "wouldyourather" | "spotlight" | "celebration",
  integrationId: number
): Promise<boolean> {
  let data;
  try {
    // create channel entry
    const channel = await prisma.channel.create({
      data: {
        type,
        integrationId,
        channelName,
        active: false,
      },
    });

    // call the slack api
    data = await slackApi.createChannel(channelName);

    if (data.ok) {
      await prisma.channel.update({
        where: {
          id: channel.id,
          active: true,
        },
        data: {
          channelId: data.channel_id,
        },
      });
    } else {
      await prisma.channel.delete({
        where: {
          id: channel.id,
        },
      });
    }
  } catch {
    return false;
  }
  return true;
}

async function joinChannel(
  slackApi: SlackApi,
  channelId: string,
  type: "socialsips" | "wouldyourather" | "spotlight" | "celebration",
  integrationId: number
) {
  let data;
  try {
    // create channel entry
    const channel = await prisma.channel.create({
      data: {
        type,
        integrationId,
        channelId,
        active: false,
      },
    });

    // call the slack api
    data = await slackApi.joinChannel(channelId);

    if (data.ok) {
      await prisma.channel.update({
        where: {
          id: channel.id,
          active: true,
        },
        data: {
          channelId: data.channel.name,
        },
      });
    } else {
      await prisma.channel.delete({
        where: {
          id: channel.id,
        },
      });
    }
  } catch {
    return false;
  }
  return true;
}

export const POST = withError(
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
        id: true,
      },
    });
    if (!integration || !integration.token) {
      return NextResponse.json({
        channels: [],
        warn: "integration not found",
      });
    }

    const created: string[] = [];
    const errors: string[] = [];

    const rawData = await req.json();
    const parsedData = joinChannelRequestSchema.parse(rawData);

    const slackapi = new SlackApi(integration.token);

    /* 
      There can be two possibilites here
      [
        {
          channelType: ,
          channelId: // can be a new channel,
        }
      ]
      // we have to define a service to set the channel settings different types of channels
    */

    await Promise.all(
      parsedData.channels.map(async (c) => {
        if (c.new) {
          const response = await createChannel(
            slackapi,
            c.channelName,
            c.channelType,
            integration.id
          );
          if (response) {
            created.push(c.channelName);
          } else {
            errors.push(c.channelName);
          }
        } else {
          const response = await joinChannel(
            slackapi,
            c.channelId,
            c.channelType,
            integration.id
          );
          if (response) {
            created.push(c.channelId);
          } else {
            errors.push(c.channelId);
          }
        }
      })
    );
    return NextResponse.json({
      created,
      errors,
    });
    // const channels = await slackapi.getChannels()
    // return NextResponse.json({channels})
  })
);
