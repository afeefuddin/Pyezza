import { withError, withUser } from "@/lib/middleware";
import { timezonePresent } from "@/lib/timezone";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { TChannelSetting } from "@repo/types/channelSetting";

import { prisma } from "@repo/database";
import { dateToSeconds } from "@repo/lib/date";

const updateSettingApiSchema = z.object({
  daysOfTheWeek: z.array(z.number()).optional(),
  timeOfTheDay: z.string().optional(),
  timezone: z.string(),
});

type Params = {
  integrationId: string;
  channelId: string;
};

export const PUT = withError(
  withUser(async (req, params) => {
    const { integrationId, channelId } = (await params.params) as Params;
    const rawData = await req.json();
    const data = updateSettingApiSchema.parse(rawData);

    const channel = await prisma.channel.findFirst({
      where: {
        publicId: channelId,
        integration: {
          publicId: integrationId,
          user: {
            id: req.user.id,
          },
        },
      },
    });

    if (!channel) {
      return NextResponse.json({ error: "Channel Not found" }, { status: 404 });
    }

    const channelSetting = await prisma.channelSetting.upsert({
      where: {
        channelId: channel.id,
      },
      create: {
        channelId: channel.id,
      },
      update: {},
    });

    const updateData: Partial<TChannelSetting> = {};
    if (timezonePresent(data.timezone)) {
      updateData["timezone"] = data.timezone;
    }

    if (data.daysOfTheWeek) {
      updateData["daysOfWeek"] = data.daysOfTheWeek;
    }

    if (data.timeOfTheDay) {
      updateData["timeOfday"] = dateToSeconds(new Date(data.timeOfTheDay));
    }

    await prisma.channelSetting.update({
      where: {
        id: channelSetting.id,
      },
      data: {
        ...updateData,
      },
    });

    return NextResponse.json({
      update: true,
    });
  })
);
