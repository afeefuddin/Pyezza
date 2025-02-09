import axios from "axios";
import { z } from "zod";

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
  token: string;
  url = "https://slack.com/api";
  formData;

  constructor(token: string) {
    this.token = token;
    this.formData = new FormData();
    this.formData.set("token", this.token);
  }

  // TODO: Cache response for 10 minutes to avoid rate limiting
  async getChannels() {
    const response = await axios.get(`${this.url}/conversations.list`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    const rawData = response.data;
    const parsedData = slackChannelsResponseSchema.parse(rawData);
    return parsedData.channels;
  }

  async joinChannel(channelId: string) {
    const response = await axios.post(
      `${this.url}/conversations.join?channel=${channelId}`,
      this.formData
    );
    const rawData = response.data;
    const parsedData = slackJoinChannelResponseSchema.parse(rawData);
    return parsedData;
  }

  async createChannel(name: string) {
    const response = await axios.post(
      `${this.url}/conversations.create?name=${name}`,
      this.formData
    );
    const rawData = response.data;
    console.log(rawData);
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

  async sendMessage(value: string, channelId: string) {
    this.formData.set("text", value);
    this.formData.set("channel", channelId);
    const response = await axios.post(
      `${this.url}/chat.postMessage`,
      this.formData
    );
    const rawData = response.data;

    const parsedData = z.object({ ok: z.boolean() }).parse(rawData);

    return parsedData;
  }
}
