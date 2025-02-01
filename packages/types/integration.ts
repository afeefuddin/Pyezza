import type { PrismaModels } from "@repo/database";

export type TIntegration = PrismaModels["Integration"];

export type TIntegrationWithChannels = PrismaModels["Integration"] & {
  channels: PrismaModels["Channel"][];
};
