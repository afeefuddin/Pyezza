import { SpotlightService } from "../spotlight.service";
import { prisma } from "@repo/database";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@repo/database", () => ({
  prisma: {
    spotlightMessageQueue: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

const slackApiMock = {
  getUsersInChannel: vi.fn(),
  sendMessage: vi.fn(),
};

describe("SpotlightService", () => {
  const botUserId = "BOT123";
  const dbChannelId = 1;
  const slackChannelId = "C123";

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should return the next user in queue and update queue", async () => {
    slackApiMock.getUsersInChannel.mockResolvedValue({
      ok: true,
      members: ["U1", "U2", "BOT123"],
    });

    (prisma.spotlightMessageQueue.findUnique as any).mockResolvedValue({
      members: ["U1", "U2"],
    });

    const service = new SpotlightService(
      dbChannelId,
      slackChannelId,
      slackApiMock as any,
      botUserId
    );

    let result = await service.popNextUser();
    expect(result).toBe("U1");

    expect(prisma.spotlightMessageQueue.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: { members: ["U2"] },
        create: { channelId: 1, members: ["U2"] },
        where: { channelId: 1 },
      })
    );
  });

  it("should rebuild queue if all users are invalid", async () => {
    slackApiMock.getUsersInChannel.mockResolvedValue({
      ok: true,
      members: ["U1", "U2", "U3", botUserId],
    });

    (prisma.spotlightMessageQueue.findUnique as any).mockResolvedValue({
      members: ["DEADUSER"],
    });

    const service = new SpotlightService(
      dbChannelId,
      slackChannelId,
      slackApiMock as any,
      botUserId
    );

    const user = await service.popNextUser();
    expect(["U1", "U2", "U3"]).toContain(user);
  });

  it("throws if Slack API fails", async () => {
    slackApiMock.getUsersInChannel.mockResolvedValue({
      ok: false,
      error: "invalid_auth",
    });

    const service = new SpotlightService(
      dbChannelId,
      slackChannelId,
      slackApiMock as any,
      botUserId
    );

    await expect(service.popNextUser()).rejects.toThrow("Slack API failed");
  });

  it("throws if no users found after filtering", async () => {
    slackApiMock.getUsersInChannel.mockResolvedValue({
      ok: true,
      members: ["BOT123"],
    });

    const service = new SpotlightService(
      dbChannelId,
      slackChannelId,
      slackApiMock as any,
      botUserId
    );

    await expect(service.popNextUser()).rejects.toThrow(
      "Queue is unexpectedly empty"
    );
  });
});
