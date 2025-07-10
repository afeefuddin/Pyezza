import { dateToSeconds } from "@repo/lib/date";
import { TChannelWithSettingAndMessage } from "@repo/types/channel";
import { TMessageWithChannelIdAndReminderSettings } from "@repo/types/message";

export function filterChannels(
  channels: TChannelWithSettingAndMessage[]
): TChannelWithSettingAndMessage[] {
  const filterChannels: TChannelWithSettingAndMessage[] = [];

  channels.forEach((channel) => {
    if (!channel.setting) {
      return;
    }
    const timezone = channel.setting.timezone;
    const date = new Date(
      new Date().toLocaleString("en-US", { timeZone: timezone })
    );

    let today = date.getDay() - 1;
    if (today < 0) {
      today = 6;
    }

    // If Eligible to send message today
    if (!channel.setting.daysOfWeek.includes(today)) {
      console.log("Did not match the date");
      return;
    }

    // If last message sent was today
    if (channel.Message[0]) {
      const lastMessageDateLocal = new Date(
        channel.Message[0].createdAt.toLocaleString("en-US", {
          timeZone: timezone,
        })
      );
      const dupDate = new Date(date);
      if (
        lastMessageDateLocal.setHours(0, 0, 0, 0) ===
        dupDate.setHours(0, 0, 0, 0)
      ) {
        return;
      }
    }

    // if it's the right time to send the message
    const startTime = channel.setting.timeOfday - 10 * 60;
    const endTime = channel.setting.timeOfday + 15 * 60;
    const currentTime = dateToSeconds(date);
    if (currentTime < startTime || currentTime > endTime) {
      console.log(
        "Did not match the time",
        date,
        currentTime,
        startTime,
        endTime,
        channel.channelName
      );
      return;
    }

    filterChannels.push(channel);
  });

  return filterChannels;
}

export function filterReminderMessages(
  messages: TMessageWithChannelIdAndReminderSettings[]
): TMessageWithChannelIdAndReminderSettings[] {
  return messages.filter((message) => {
    if (!message.channel || !message.channel.setting) {
      return false;
    }

    if (!message.channel.setting.reminderOn) {
      return false;
    }

    const reminderTime =
      dateToSeconds(new Date(message.createdAt)) +
      message.channel.setting.reminderInterval;

    const currentTime = Date.now();

    if (reminderTime > currentTime + 10 * 60 * 60) {
      return false;
    }

    return true;
  });
}

// Check for only 1 reply from tagged members in the history for any 1 of the taggedMember
export function findTaggedMemberReplyInHistory(
  taggedMembers: string[],
  messages: { user?: string | undefined }[]
) {
  for (const message of messages) {
    if (!message.user) {
      continue;
    }
    if (taggedMembers.includes(message.user)) {
      return true;
    }
  }

  return false;
}
