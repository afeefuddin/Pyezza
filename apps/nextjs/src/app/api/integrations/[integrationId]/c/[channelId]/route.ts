import { withError, withUser } from "@/lib/middleware";
import { timezonePresent } from "@/lib/timezone";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { TChannelSetting } from "@repo/types/channelSetting";

import { prisma } from "@repo/database";
import { dateToSeconds } from "@/lib/date";

const updateSettingApiSchema = z.object({
  everyNWeek: z.number().optional(),
  daysOfTheWeek: z.array(z.number()).optional(),
  timeOfTheDay: z.string().optional(),
  timezone: z.string(),
});

export const PUT = withError(
  withUser(async (req, params) => {
    const { integrationId, channelId } = await params.params;
    const rawData = await req.json();
    const data = updateSettingApiSchema.parse(rawData);

    const updateData: Partial<TChannelSetting> = {};
    if (timezonePresent(data.timezone)) {
      updateData["timezone"] = data.timezone;
    }

    if (data.daysOfTheWeek) {
      updateData["daysOfWeek"] = data.daysOfTheWeek;
    }

    if (data.everyNWeek) {
      updateData["everyNWeek"] = data.everyNWeek;
    }

    if (data.timeOfTheDay) {
      updateData["timeOfday"] = dateToSeconds(new Date(data.timeOfTheDay));
    }

    console.log(channelId, integrationId, req.user);

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

    await prisma.channelSetting.update({
      where: {
        channelId: channel.id,
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
