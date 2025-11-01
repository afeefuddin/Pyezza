import { withError } from "@/lib/middleware";
import { prisma } from "@repo/database";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { SlackEventSchema } from "@repo/lib/slack-event-schema";
import { headers as getHeaders } from "next/headers";
import { forwardMessageToSlackChannel } from "@repo/trigger/src/trigger/forward-message";

export const POST = withError(async (req) => {
  const rawBody = await req.text();

  const headerList = await getHeaders();
  const timestamp = headerList.get("x-slack-request-timestamp");
  const slackSignature = headerList.get("x-slack-signature");

  if (!timestamp || !slackSignature) {
    return NextResponse.json(
      { error: "Missing Slack headers" },
      { status: 400 }
    );
  }

  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) {
    return NextResponse.json({ error: "Request too old" }, { status: 400 });
  }

  const sigBaseString = `v0:${timestamp}:${rawBody}`;
  const hmac = crypto
    .createHmac("sha256", process.env.SLACK_SIGNING_SECRET!)
    .update(sigBaseString, "utf8")
    .digest("hex");
  const computedSignature = `v0=${hmac}`;

  const validSignature = crypto.timingSafeEqual(
    Buffer.from(computedSignature, "utf8"),
    Buffer.from(slackSignature, "utf8")
  );

  if (!validSignature) {
    console.error("Invalid Slack signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const json = JSON.parse(rawBody);
  const parsed = SlackEventSchema.safeParse(json);
  if (!parsed.success) {
    console.error("Invalid Slack payload", parsed.error);
    return NextResponse.error();
  }

  const body = parsed.data;

  if (body.type === "url_verification") {
    return NextResponse.json({ challenge: body.challenge });
  }

  const event = body.event;
  if (event.type === "message") {
    if (!event.thread_ts) {
      return NextResponse.json({ ok: true });
    }

    const message = await prisma.message.findFirst({
      where: {
        channel: {
          integration: {
            teamId: body.team_id,
          },
          channelId: event.channel,
        },
        sent_ts: event.thread_ts,
      },
      include: {
        channel: {
          include: {
            setting: {
              select: {
                forwardResponseFromThread: true,
              },
            },
          },
        },
      },
    });
    if (
      !message ||
      message.forwardedResponseFromThread ||
      !message.channel.setting.forwardResponseFromThread ||
      !message.taggedMembers.includes(event.user)
    ) {
      return NextResponse.json({ ok: true });
    }

    forwardMessageToSlackChannel.trigger(
      {
        channelId: message.channel.id,
        message_ts: body.event.ts,
        messageId: message.id,
      },
      {
        idempotencyKey: `slack-event:${body.event_id}${body.event.thread_ts}`,
      }
    );
  }

  return NextResponse.json({ ok: true });
});
