import { prisma } from "@repo/database";
import { logger, schedules, task, wait } from "@trigger.dev/sdk/v3";
import { TMessageTemplate } from "@repo/types/messageTemplate";
import { SlackApi } from "@repo/lib/slack-api";
import { filterChannels, filterReminderMessages } from "../utils";
import { sendGenericSocialMessage, sendSpotLightMessage } from "../sendMessage";
import { TMessageWithChannelIdAndReminderSettings } from "@repo/types/message";
import { response } from "express";

export const sendSlackMessage = task({
  id: "send-message-slack",
  run: async (payload: { messageId: number }) => {
    const message = await prisma.message.findUnique({
      where: {
        id: payload.messageId,
      },
      include: {
        template: true,
        channel: {
          include: {
            integration: true,
          },
        },
      },
    });

    const channel = message?.channel;

    if (!message || !channel) {
      logger.error(`Message or channel not found `);
      return;
    }

    if (!channel.integration.token) {
      logger.error(`Token not found`);
      return;
    }

    if (!message.channel.channelId) {
      logger.error(`Channel not found`);
      return;
    }

    const slackApi = new SlackApi(channel.integration.token);
    let taggedMembers: string[] = [];
    let result: {
      ok: true;
      ts: string;
    } | null = null;

    if (message.template.type === "spotlight") {
      const response = await sendSpotLightMessage(message, slackApi);
      taggedMembers = response.taggedMembers;
      result = response.result;
    } else {
      result = await sendGenericSocialMessage(message, slackApi);
    }

    try {
      await prisma.message.update({
        where: {
          id: message.id,
        },
        data: {
          status: "SENT",
          taggedMembers,
          sent_ts: result.ts,
        },
      });
    } catch (error) {
      logger.warn("ERROR: Updating or Sending the message");
    }
  },
});

export const sendMessageTask = task({
  id: "send-message",
  run: async (payload: { id: number }) => {
    const { id } = payload;

    try {
      await prisma.$transaction(async (tx) => {
        const channel = await tx.channel.findUnique({
          where: { id },
          include: { setting: true },
        });

        if (!channel) {
          logger.warn(`Channel ${id} not found`);
          return;
        }

        const alreadySent = await tx.messageTemplate.findMany({
          where: {
            Message: {
              some: {
                channelId: channel.id,
              },
            },
          },
          select: { id: true },
        });

        const template = await tx.messageTemplate.findFirst({
          where: {
            id: { notIn: alreadySent.map((m) => m.id) },
            type: channel.type as TMessageTemplate["type"],
            active: true, // Add an active field to MessageTemplate if not exists
          },
        });

        if (!template) {
          logger.info(`No available templates for channel ${id}`);
          return;
        }

        const message = await tx.message.create({
          data: {
            messageTemplateId: template.id,
            channelId: channel.id,
            status: "PENDING",
          },
        });

        // Queue the actual message sending
        await sendSlackMessage.trigger({
          messageId: message.id,
        });
      });
    } catch (error: any) {
      logger.error(`Error in sendMessageTask for channel ${id}:`, error);
      throw error;
    }
  },
});

export const sendReminder = task({
  id: "send-reminder",
  run: async (payload: TMessageWithChannelIdAndReminderSettings) => {
    try {
      let reminder = await prisma.reminder.findFirst({
        where: {
          messageId: payload.id,
        },
      });
      if (!reminder) {
        reminder = await prisma.reminder.create({
          data: {
            messageId: payload.id,
          },
        });
      }
    } catch (error) {}
  },
});

export const firstScheduledTask = schedules.task({
  id: "first-scheduled-task",
  cron: "*/15 * * * *",
  maxDuration: 300,
  run: async (payload, { ctx }) => {
    try {
      const channels = await prisma.channel.findMany({
        where: {
          active: true,
        },
        include: {
          setting: true,
          Message: {
            orderBy: {
              createdAt: "desc",
            },
            take: 1,
          },
        },
      });
      const channelsToProcess = filterChannels(channels);
      await Promise.all(
        channelsToProcess.map((channel) =>
          sendMessageTask
            .trigger({ id: channel.id })
            .catch((error) =>
              logger.error(`Failed to process channel ${channel.id}:`, error)
            )
        )
      );

      const reminderMessages = await prisma.message.findMany({
        where: {
          AND: [
            {
              status: "SENT",
            },
            {
              Reminder: {
                none: {},
              },
            },
            {
              channel: {
                type: "spotlight",
              },
            },
            {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            },
          ],
        },
        include: {
          channel: {
            select: {
              channelId: true,
            },
            include: {
              setting: {
                select: {
                  reminderInterval: true,
                  reminderMessage: true,
                },
              },
            },
          },
        },
      });

      const reminderToProcess = filterReminderMessages(reminderMessages);
    } catch (error: any) {
      logger.error("Error in messageScheduler:", error);
      throw error;
    }
  },
});
