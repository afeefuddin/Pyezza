import type { PrismaModels } from "@repo/database";

export type TChannel = PrismaModels["Channel"];
export type TChannelWithSetting = TChannel & {
  setting: PrismaModels["ChannelSetting"] | null;
};

export type TChannelWithMessageCount = TChannel & {
  _count: {
    Message: number;
  };
};

export type TChannelWithSettingAndMessage = TChannel & {
  setting: PrismaModels["ChannelSetting"] | null;
  Message: PrismaModels["Message"][];
};

export type TChannelWithIntegration = TChannel & {
  integration: PrismaModels["Integration"];
};
