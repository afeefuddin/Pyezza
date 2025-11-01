import { SlackApi } from "@repo/lib/slack-api";
import { prisma } from "@repo/database";
import { task } from "@trigger.dev/sdk/v3";

export const forwardMessageToSlackChannel = task({
  id: "forward-message",
  run: async (payload: {
    channelId: number;
    message_ts: string;
    messageId: number;
  }) => {
    if (!payload.channelId) {
      return;
    }
    const channel = await prisma.channel.findFirst({
      where: { id: payload.channelId },
      include: {
        integration: {
          select: {
            token: true,
          },
        },
      },
    });

    const message = await prisma.message.findFirst({
      where: { id: payload.messageId },
    });

    if (!channel?.integration.token || !message) {
      return;
    }

    const client = new SlackApi(channel?.integration.token);
    const link = await client.slackClient().chat.getPermalink({
      channel: channel.channelId!,
      message_ts: payload.message_ts,
    });

    await client.slackClient().chat.postMessage({
      channel: channel.channelId!,
      text: `<${link.permalink}|Cool>`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<${link.permalink}|Cool>`,
          },
        },
      ],
    });

    await prisma.message.update({
      where: { id: payload.messageId },
      data: {
        forwardedResponseFromThread: true,
      },
    });
  },
});
