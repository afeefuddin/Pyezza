import { SlackApi } from "@repo/lib/slack-api";
import { SpotlightService } from "@repo/services/spotlight.service";
import { TChannelWithIntegration } from "@repo/types/channel";
import { TMessage } from "@repo/types/message";
import { TMessageTemplate } from "@repo/types/messageTemplate";

const sendSpotLightMessage = async (
  message: TMessage & {
    channel: TChannelWithIntegration;
    template: TMessageTemplate;
  },
  slackApi: SlackApi
) => {
  const spotlight = new SpotlightService(
    message.channel.id,
    message.channel.channelId!,
    slackApi,
    message.channel.integration.botUserId!
  );

  const userToTag = await spotlight.popNextUser();
  const messageToSend = await spotlight.buildSlackMessage(
    message.template,
    userToTag
  );

  const result = await slackApi.sendMessage(
    messageToSend,
    message.channel.channelId!
  );

  if (!result.ok) {
    throw new Error(
      `Error sending spotlight message: ${result.error}, channel: ${message.channel.channelId}`
    );
  }

  return { taggedMembers: [userToTag], result };
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

  let messageToSend: Record<string, unknown>[];

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
          text: ">" + message.template.content,
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
          text: ">" + message.template.content,
        },
      },
    ];
  }

  if (message.template.gif) {
    messageToSend.push({
      type: "image",
      block_id: "image4",
      image_url: message.template.gif,
      alt_text: "",
    });
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

  return messageSlack;
};

const sendReminderMessage = async (
  {
    userId,
    channelId,
    ts,
  }: { userId: string | null; channelId: string; ts: string | null },
  slackApi: SlackApi
) => {
  const blocks: Record<string, unknown>[] = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Hey <@${userId}>! 🌸 I thoughtfully gathered these messages just for you! ✨`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Please consider replying 👉👈🥺",
      },
    },
  ];

  const data = await slackApi.sendMessage(blocks, channelId, ts);

  if (!data.ok) {
    throw new Error(
      `Error sending reminder message: ${data.error}, channel: ${channelId}`
    );
  }

  return data;
};

export { sendGenericSocialMessage, sendSpotLightMessage, sendReminderMessage };
