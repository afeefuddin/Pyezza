import type { PrismaModels } from "@repo/database";

export type TMessage = PrismaModels["Message"];

export type TMessageWithChannelIdAndReminderSettings = TMessage & {
  channel: {
    channelId: string | null;
    setting: {
      reminderMessage: string | null;
      reminderInterval: number;
    } | null;
    integration: {
      token: string | null;
    };
  };
};
