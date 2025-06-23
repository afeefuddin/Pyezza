import axios from "axios";
import { z } from "zod";
import { decrypt } from "./encrypt";

export const slackChannelsResponseSchema = z.object({
  channels: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

const slackJoinChannelResponseSchema = z.discriminatedUnion("ok", [
  z.object({
    ok: z.literal(true),
    channel: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
  z.object({
    ok: z.literal(false),
    error: z.string(),
  }),
]);

export class SlackApi {
  private token: string;
  private url = "https://slack.com/api";
  private headers: { Authorization: string };

  constructor(token: string) {
    this.token = decrypt(token);
    this.headers = {
      Authorization: `Bearer ${this.token}`,
    };
  }

  // TODO: Cache response for 10 minutes to avoid rate limiting
  async getChannels() {
    const response = await axios.get(`${this.url}/conversations.list`, {
      headers: this.headers,
    });
    const rawData = response.data;
    const parsedData = slackChannelsResponseSchema.parse(rawData);
    return parsedData.channels;
  }

  async joinChannel(channelId: string) {
    const response = await axios.post(
      `${this.url}/conversations.join?channel=${channelId}`,
      null,
      {
        headers: this.headers,
      }
    );
    const rawData = response.data;
    const parsedData = slackJoinChannelResponseSchema.parse(rawData);
    return parsedData;
  }

  async createChannel(name: string) {
    const response = await axios.post(
      `${this.url}/conversations.create?name=${name}`,
      null,
      {
        headers: this.headers,
      }
    );
    const rawData = response.data;
    const parsedData = z
      .discriminatedUnion("ok", [
        z.object({
          ok: z.literal(true),
          channel: z.object({
            id: z.string(),
          }),
        }),
        z.object({
          ok: z.literal(false),
          error: z.string(),
        }),
      ])
      .parse(rawData);
    return parsedData;
  }

  async sendMessage(blocks: unknown[], channelId: string) {
    const response = await axios.post(
      `${this.url}/chat.postMessage?channel=${channelId}&blocks=${encodeURIComponent(JSON.stringify(blocks))}`,
      null,
      {
        headers: this.headers,
      }
    );
    const rawData = response.data;
    const parsedData = z
      .discriminatedUnion("ok", [
        z.object({
          ok: z.literal(true),
          ts: z.string(),
        }),
        z.object({
          ok: z.literal(false),
          error: z.string(),
        }),
      ])
      .parse(rawData);
    return parsedData;
  }

  async getUsersInChannel(channelId: string) {
    const response = await axios.post(
      `${this.url}/conversations.members?channel=${channelId}`,
      null,
      {
        headers: this.headers,
      }
    );
    const rawData = response.data;
    // TODO: Handle pagination for teams with > 100 users
    const parsedData = z
      .discriminatedUnion("ok", [
        z.object({
          ok: z.literal(true),
          members: z.array(z.string()),
        }),
        z.object({
          ok: z.literal(false),
          error: z.string(),
        }),
      ])
      .parse(rawData);
    return parsedData;
  }
}
