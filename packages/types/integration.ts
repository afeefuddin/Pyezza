import type { PrismaModels } from "@repo/database";
import { TChannelWithMessageCount } from "./channel";

export type TIntegration = PrismaModels["Integration"];

export type TIntegrationWithChannels = PrismaModels["Integration"] & {
  channels: TChannelWithMessageCount[];
};
