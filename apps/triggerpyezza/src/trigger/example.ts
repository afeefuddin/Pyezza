import { prisma } from "@repo/database";
import { logger, schedules, task, wait } from "@trigger.dev/sdk/v3";
import {
  TChannel,
  TChannelWithIntegration,
  TChannelWithSettingAndMessage,
} from "@repo/types/channel";
import { TMessage } from "@repo/types/message";
import { TMessageTemplate } from "@repo/types/messageTemplate";
import { dateToSeconds } from "@repo/lib/date";
import { SlackApi } from "@repo/lib/slack-api";

function filterChannels(
  channels: TChannelWithSettingAndMessage[]
): TChannelWithSettingAndMessage[] {
  const filterChannels: TChannelWithSettingAndMessage[] = [];

  channels.forEach((channel) => {
    if (!channel.setting) {
      console.log("Disappointing");
      return;
    }
    const timezone = channel.setting.timezone;
    const date = new Date(
      new Date().toLocaleString("en-US", { timeZone: timezone })
    );

    console.log(date);

    let today = date.getDay() - 1;
    if (today < 0) {
      today = 6;
    }

    // If Eligible to send message today
    if (!channel.setting.daysOfWeek.includes(today)) {
      console.log("Did not match the date");
      return;
    }

    // If last message sent was today
    if (channel.Message[0]) {
      const lastMessageDateLocal = new Date(
        channel.Message[0].createdAt.toLocaleString("en-US", {
          timeZone: timezone,
        })
      );
      const dupDate = new Date(date);
      if (
        lastMessageDateLocal.setHours(0, 0, 0, 0) ===
        dupDate.setHours(0, 0, 0, 0)
      ) {
        return;
      }
    }

    // if it's the right time to send the message
    const startTime = channel.setting.timeOfday - 20 * 60;
    const endTime = channel.setting.timeOfday + 15 * 60;
    const currentTime = dateToSeconds(date);
    if (currentTime < startTime || currentTime > endTime) {
      console.log(
        "Did not match the time",
        date,
        currentTime,
        startTime,
        endTime
      );
      return;
    }

    filterChannels.push(channel);
  });

  return filterChannels;
}

const buildSpotlightSlackMessage = (content, userId) => {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `🌟 The Spotlight is on <@${userId}>🌟`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: content,
      },
    },
  ];
  return blocks;
};

const sendSpotLightMessage = async (
  message: TMessage & {
    channel: TChannelWithIntegration;
    template: TMessageTemplate;
  },
  slackApi: SlackApi
) => {
  // Fetch Users
  if (!message.channel.channelId) {
    throw new Error("Channel not assigned");
  }
  const users = await slackApi.getUsersInChannel(message.channel.channelId);

  if (!users.ok) {
    throw new Error("Error fetching users" + users.error);
  }

  let members = users.members;
  if (members.length === 0) {
    throw new Error("No users in the channel");
  }

  // remove Pyezza from members :)
  members = members.filter(
    (value) => value !== message.channel.integration.botUserId
  );

  // Pick random User
  const randomUser = members[Math.round(Math.random() * 10) % members.length];

  // Build a message
  const messageToSend = buildSpotlightSlackMessage(
    message.template.content,
    randomUser
  );
  console.log(messageToSend);
  // Send a message

  const messageSlack = await slackApi.sendMessage(
    messageToSend,
    message.channel.channelId
  );

  if (!messageSlack.ok) {
    const errorMessage =
      "Error message seding failed: " +
      messageSlack.error +
      " id: " +
      message.channel!.channelId;
    throw new Error(errorMessage);
  }
};

const sendGenericSocialMessage = async (
  message: TMessage & {
    channel: TChannelWithIntegration;
    template: TMessageTemplate;
  },
  slackApi: SlackApi
) => {
  if (!message.channel.channelId) {
    throw new Error("Channel not assigned");
  }

  let messageToSend;

  if (message.template.type === "socialsips") {
    messageToSend = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "🥤 *Time for a social sip* 🥤",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: message.template.content,
        },
      },
    ];
  } else {
    messageToSend = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Would you rather* 🤔",
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: message.template.content,
        },
      },
    ];
  }

  const messageSlack = await slackApi.sendMessage(
    messageToSend,
    message.channel.channelId
  );

  if (!messageSlack.ok) {
    const errorMessage =
      "Error message seding failed: " +
      messageSlack.error +
      " id: " +
      message.channel!.channelId;
    throw new Error(errorMessage);
  }
};

export const sendSlackMessage = task({
  id: "send-message-slack",
  run: async (payload: { id: number; messageId: number }) => {
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

    if (message.template.type === "spotlight") {
      await sendSpotLightMessage(message, slackApi);
    } else {
      await sendGenericSocialMessage(message, slackApi);
    }

    try {
      await prisma.message.update({
        where: {
          id: message.id,
        },
        data: {
          status: "SENT",
        },
      });
    } catch (error) {
      logger.warn("ERROR Updating the message");
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
          id: channel.id,
          messageId: message.id,
        });
      });
    } catch (error: any) {
      logger.error(`Error in sendMessageTask for channel ${id}:`, error);
      throw error;
    }
  },
});

export const firstScheduledTask = schedules.task({
  id: "first-scheduled-task",
  // Every hour
  cron: "0 * * * *",
  // Set an optional maxDuration to prevent tasks from running indefinitely
  maxDuration: 300, // Stop executing after 300 secs (5 mins) of compute
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
      console.log(channels);
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
    } catch (error: any) {
      logger.error("Error in messageScheduler:", error);
      throw error;
    }
  },
});
