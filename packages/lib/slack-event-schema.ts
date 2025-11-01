import { z } from "zod";

const MessageEventSchema = z.object({
  type: z.literal("message"),
  user: z.string(),
  ts: z.string(),
  event_ts: z.string(),
  channel: z.string(),
  thread_ts: z.string().optional(), // replies only
  text: z.string().optional(), // Slack sometimes omits text in bot edits
});

const EventCallbackSchema = z.object({
  type: z.literal("event_callback"),
  team_id: z.string(),
  api_app_id: z.string().optional(),
  event: MessageEventSchema,
  event_id: z.string(),
  event_time: z.number(),
  authed_users: z.array(z.string()).optional(),
});

const UrlVerificationSchema = z.object({
  type: z.literal("url_verification"),
  challenge: z.string(),
});

export const SlackEventSchema = z.discriminatedUnion("type", [
  EventCallbackSchema,
  UrlVerificationSchema,
]);

export type SlackEvent = z.infer<typeof SlackEventSchema>;
