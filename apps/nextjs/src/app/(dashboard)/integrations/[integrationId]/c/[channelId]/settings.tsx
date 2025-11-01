"use client";

import { TimezoneComboBox } from "@/components/Timezonecombobox";
import { Button } from "@/components/ui/button";
import type { TChannelSetting } from "@repo/types/channelSetting";
import {
  Bell,
  Calendar,
  Clock,
  Earth,
  Forward,
  LoaderCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { TimeOfDay } from "./components/timeofday";
import { DaysOfTheWeek } from "./components/daysoftheweek";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { dateToSeconds, secondToDate } from "@repo/lib/date";
import { useRouter } from "next/navigation";
import revalidatePathAction from "@/actions/revalidate";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function Settings({
  data,
  integrationId,
}: {
  data: {
    channel: {
      channelName: string | null;
      type: string;
      publicId: string;
    };
  } & Partial<TChannelSetting>;
  integrationId: string;
}) {
  const [daysOfTheWeek, setDaysOfTheWeek] = useState(data.daysOfWeek ?? []);
  const [timeOfTheDay, setTimeOfTheDay] = useState<Date | undefined>(
    data.timeOfday ? secondToDate(data.timeOfday) : undefined
  );
  const [reminderInterval, setReminderInterval] = useState<Date | undefined>(
    data.reminderInterval ? secondToDate(data.reminderInterval) : undefined
  );
  const [timezone, setTimezone] = useState<string>(
    data.timezone ?? "Etc/GMT+0"
  );
  const [reminderOn, setReminderOn] = useState(data.reminderOn ?? false);
  const [forwardResponseFromThread, setForwardResponseFromThread] = useState(
    data.forwardResponseFromThread ?? false
  );
  const router = useRouter();

  const { mutate: submit, isPending } = useMutation({
    mutationKey: ["update-channel-settings"],
    mutationFn: async () => {
      const body = {
        daysOfTheWeek,
        timeOfTheDay: dateToSeconds(timeOfTheDay),
        timezone,
        reminderInterval: dateToSeconds(reminderInterval),
        reminderOn,
        forwardResponseFromThread,
      };
      await axios.put(
        `/api/integrations/${integrationId}/c/${data.channel.publicId}`,
        body
      );
    },
    onSuccess() {
      revalidatePathAction(
        `/integrations/${integrationId}/c/${data.channel.publicId}`,
        "page"
      );
      router.push(`/integrations/${integrationId}`);
    },
  });

  return (
    <div className="flex flex-col gap-8 px-4">
      <div className="flex flex-col gap-8">
        <div>
          <div className="font-bold text-lg">Channel</div>
          <div className="text-gray-600">
            The channel Pyezza drops bangers to
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <Image
            src="/slack.svg"
            alt=""
            width={30}
            height={30}
            className="col-span-1"
          />
          <div className="font-semibold text-xl">
            {data.channel.channelName}
          </div>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-8">
        <div>
          <div className="font-bold text-lg">Days of the week</div>
          <div className="text-gray-600">
            On What days sould pyezza send message
          </div>
        </div>
        <DaysOfTheWeek setValue={setDaysOfTheWeek} value={daysOfTheWeek} />
      </div>
      <Separator />
      <div className="flex flex-row gap-8 justify-between">
        <div>
          <div className="font-bold text-lg">Time of the day</div>
          <div className="text-gray-600">
            On What days sould pyezza send message
          </div>
        </div>

        <TimeOfDay date={timeOfTheDay} setDate={setTimeOfTheDay} />
      </div>
      <Separator />
      <div className="flex flex-row gap-8 justify-between">
        <div>
          <div className="font-bold text-lg">Timezone</div>
        </div>
        <TimezoneComboBox value={timezone} onChange={setTimezone} />
      </div>
      {data.channel.type === "spotlight" && (
        <>
          <Separator />
          <div className="flex flex-col gap-8 ">
            <div>
              <div className="font-bold text-lg">Notifications</div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-row justify-between gap-8">
                <div>
                  <div className="font-bold">Enable Reminders</div>
                  <div className="text-gray-600">
                    Send a reminder message if the question hasn't been
                    addressed
                  </div>
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <Switch
                    checked={reminderOn}
                    onCheckedChange={(value) => setReminderOn(value)}
                  />
                </div>
              </div>
              {reminderOn && (
                <div className=" flex flex-row justify-between relative border-l-4 border-primary pl-4 ml-4">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="text-gray-600">
                      After how much time should pyezza remind them?
                    </div>
                  </div>
                  <TimeOfDay
                    date={reminderInterval}
                    setDate={setReminderInterval}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-row justify-between gap-8">
              <div>
                <div className="font-bold">Forward message to channel</div>
                <div className="text-gray-600">
                  Improve visiblity of the replies by forwarding them to the
                  channel
                </div>
              </div>
              <Switch
                checked={forwardResponseFromThread}
                onCheckedChange={(value) => setForwardResponseFromThread(value)}
              />
            </div>
          </div>
        </>
      )}
      <Separator />
      <div className="flex justify-end gap-4">
        <Link href={`/integrations/${integrationId}`}>
          <Button variant="link">Cancel</Button>
        </Link>
        <Button disabled={isPending} onClick={() => submit()}>
          {isPending && (
            <LoaderCircle
              className="-ms-1 me-2 animate-spin"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          )}
          Save
        </Button>
      </div>
    </div>
  );
}
