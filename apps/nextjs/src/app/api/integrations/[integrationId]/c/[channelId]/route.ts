import { withError, withUser } from "@/lib/middleware";
import { timezonePresent } from "@/lib/timezone";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type { TChannelSetting } from "@repo/types/channelSetting";

import { prisma } from "@repo/database";

const updateSettingApiSchema = z.object({
  daysOfTheWeek: z.array(z.number()).optional(),
  timeOfTheDay: z.number().optional(),
  timezone: z.string(),
  reminderOn: z.boolean().optional(),
  reminderInterval: z.number().optional(),
});

type Params = {
  integrationId: string;
  channelId: string;
};

function timeBounded(value: number) {
  if (value <= 0) {
    return 0;
  }

  if (value >= 86399) {
    return 86399;
  }

  return value;
}

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
      updateData["timeOfday"] = timeBounded(data.timeOfTheDay);
    }

    if (data.reminderOn && channel.type === "spotlight") {
      updateData["reminderOn"] = data.reminderOn;
      updateData["reminderInterval"] = timeBounded(data.reminderInterval);
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
      path: `/integrations/${integrationId}/c/${channelId}`,
    });
  })
);
