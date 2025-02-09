import type { PrismaModels } from "@repo/database";

export type TChannel = PrismaModels["Channel"];
export type TChannelWithSetting = PrismaModels["Channel"] & {
  setting: PrismaModels["ChannelSetting"] | null;
};

export type TChannelWithSettingAndMessage = PrismaModels["Channel"] & {
  setting: PrismaModels["ChannelSetting"] | null;
  Message: PrismaModels["Message"][];
};
