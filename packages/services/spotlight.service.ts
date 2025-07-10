import { SlackApi } from "@repo/lib/slack-api";
import { prisma } from "@repo/database";
import { TMessageTemplate } from "@repo/types/messageTemplate";

export class SpotlightService {
  constructor(
    private dbChannelId: number,
    private slackChannelId: string,
    private slackApi: SlackApi,
    private botUserId: string
  ) {}
  buildSpotlightSlackMessage = (
    content: string,
    userId: string,
    gif?: string | null
  ) => {
    const blocks: Record<string, unknown>[] = [
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
          text: ">" + content,
        },
      },
    ];

    if (gif) {
      blocks.push({
        type: "image",
        block_id: "image4",
        image_url: gif,
        alt_text: "",
      });
    }

    return blocks;
  };

  async getValidSlackUsers(): Promise<string[]> {
    const res = await this.slackApi.getUsersInChannel(this.slackChannelId);
    if (!res.ok) throw new Error("Slack API failed: " + res.error);

    return res.members.filter((id) => id !== this.botUserId);
  }

  async getQueue(): Promise<string[]> {
    const queue = await prisma.spotlightMessageQueue.findUnique({
      where: { channelId: this.dbChannelId },
    });

    return queue?.members ?? [];
  }

  async saveQueue(members: string[]) {
    await prisma.spotlightMessageQueue.upsert({
      where: { channelId: this.dbChannelId },
      update: { members },
      create: { channelId: this.dbChannelId, members },
    });
  }

  async popNextUser(): Promise<string> {
    let currentMembers = await this.getValidSlackUsers();
    const currentSet = new Set(currentMembers);

    let queue = await this.getQueue();

    // Filter dead users
    queue = queue.filter((id) => currentSet.has(id));

    // If queue is empty, refill
    if (queue.length === 0) {
      queue = [...currentMembers].sort(() => Math.random() - 0.5);
    }

    const userToTag = queue.shift();
    if (!userToTag) throw new Error("Queue is unexpectedly empty");

    await this.saveQueue(queue);

    return userToTag;
  }

  async buildSlackMessage(template: TMessageTemplate, userId: string) {
    return this.buildSpotlightSlackMessage(
      template.content,
      userId,
      template.gif
    );
  }
}
