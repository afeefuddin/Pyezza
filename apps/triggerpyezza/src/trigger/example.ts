import { prisma } from "@repo/database";
import { logger, schedules, task, wait } from "@trigger.dev/sdk/v3";
import { TMessageTemplate } from "@repo/types/messageTemplate";
import { SlackApi } from "@repo/lib/slack-api";
import {
  filterChannels,
  filterReminderMessages,
  findTaggedMemberReplyInHistory,
} from "../utils";
import {
  sendGenericSocialMessage,
  sendReminderMessage,
  sendSpotLightMessage,
} from "../sendMessage";
import assert from "minimalistic-assert";

const updateReminderEligiblity = async (messageId: number) => {
  await prisma.message.update({
    where: {
      id: messageId,
    },
    data: {
      eligibleForReminder: false,
    },
  });
};

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

export const sendSlackReminder = task({
  id: "send-reminder-slack",
  run: async (payload: { reminderId: number }) => {
    const reminder = await prisma.reminder.findUnique({
      where: {
        id: payload.reminderId,
      },
      select: {
        message: {
          select: {
            id: true,
            channel: {
              select: {
                channelId: true,
                integration: {
                  select: {
                    token: true,
                  },
                },
              },
            },
            sent_ts: true,
            taggedMembers: true,
          },
        },
      },
    });

    if (!reminder) {
      logger.error(`Reminder ${payload.reminderId} not found`);
      return;
    }

    if (!reminder.message.channel.integration.token) {
      logger.error(
        `Integration token not found for reminder ${payload.reminderId}`
      );
      return;
    }
    if (!reminder.message.channel.channelId) {
      logger.error(`Channel ID not found for reminder ${payload.reminderId}`);
      return;
    }

    const slackApi = new SlackApi(reminder.message.channel.integration.token);
    const data = await sendReminderMessage(
      {
        userId: reminder.message.taggedMembers[0],
        channelId: reminder.message.channel.channelId,
        ts: reminder.message.sent_ts,
      },
      slackApi
    );

    if (data.ok) {
      await prisma.reminder.update({
        where: {
          id: payload.reminderId,
        },
        data: {
          status: "SENT",
          sent_ts: data.ts,
        },
      });

      await updateReminderEligiblity(reminder.message.id);
    }
  },
});

export const sendReminder = task({
  id: "send-reminder",
  run: async (payload: { id: number }) => {
    try {
      const message = await prisma.message.findUnique({
        where: {
          id: payload.id,
        },
        select: {
          sent_ts: true,
          createdAt: true,
          taggedMembers: true,
          channel: {
            select: {
              integration: {
                select: {
                  token: true,
                },
              },
              channelId: true,
            },
          },
        },
      });

      if (!message) {
        logger.error(`Message ${payload.id} not found`);
        return;
      }

      assert(message.channel.integration.token);
      assert(message.channel.channelId);
      assert(message.sent_ts, "Sent timestamp is required");

      const slackApi = new SlackApi(message.channel.integration.token);
      const oldest = message.sent_ts;
      const history = await slackApi.getMessageHistory(
        message.channel.channelId,
        oldest
      );

      let found = findTaggedMemberReplyInHistory(
        message.taggedMembers,
        history.messages
      );

      if (found) {
        console.log("found in history");
        await updateReminderEligiblity(payload.id);
        logger.info(
          `Found tagged member reply in history for message ${payload.id}`
        );
        return;
      }

      const replies = await slackApi.getReplies(
        message.channel.channelId!,
        message.sent_ts,
        oldest
      );

      found = findTaggedMemberReplyInHistory(
        message.taggedMembers,
        replies.messages
      );

      if (found) {
        await updateReminderEligiblity(payload.id);
        logger.info(
          `Found tagged member reply in history for message ${payload.id}`
        );
        return;
      }

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

      await sendSlackReminder.trigger({
        reminderId: reminder.id,
      });
    } catch (error) {
      console.log(error);
    }
  },
});

export const firstScheduledTask = schedules.task({
  id: "first-scheduled-task",
  cron: "*/15 * * * *",
  maxDuration: 300,
  run: async () => {
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
                setting: {
                  reminderOn: true,
                },
              },
            },
            {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            },
            {
              eligibleForReminder: true,
            },
          ],
        },
        include: {
          channel: {
            select: {
              channelId: true,
              integration: {
                select: {
                  token: true,
                },
              },
              setting: {
                select: {
                  reminderMessage: true,
                  reminderInterval: true,
                  reminderOn: true
                },
              },
            },
          },
        },
      });

      const reminderToProcess = filterReminderMessages(reminderMessages);
      await Promise.all(
        reminderToProcess.map((reminder) =>
          sendReminder
            .trigger({ id: reminder.id })
            .catch((error) => logger.error(error))
        )
      );
    } catch (error: any) {
      logger.error("Error in messageScheduler:", error);
      throw error;
    }
  },
});
