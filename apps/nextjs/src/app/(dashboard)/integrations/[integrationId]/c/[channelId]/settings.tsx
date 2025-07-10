"use client";

import { TimezoneComboBox } from "@/components/Timezonecombobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TChannelSetting } from "@repo/types/channelSetting";
import { Bell, Calendar, Clock, Earth, LoaderCircle } from "lucide-react";
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
    <div className="flex flex-col gap-12 px-4">
      <div className="flex flex-col items-start gap-4 lg:grid grid-cols-8 lg:gap-0 lg:items-center">
        <div className="col-span-4 grid grid-cols-4 ">
          <Image
            src="/slack.svg"
            alt=""
            width={30}
            height={30}
            className="col-span-1"
          />
          <div className="col-span-3">
            <div>Channel</div>
            <div className="text-gray-800 text-sm">
              The channel pyezza will send messages to
            </div>
          </div>
        </div>
        <Input
          disabled
          value={data.channel.channelName ?? ""}
          className="col-span-4"
        />
      </div>
      {data.channel.type !== "celebration" && (
        <>
          <div className="flex flex-col items-start gap-4 lg:gap-0 lg:grid lg:grid-cols-8 lg:items-center">
            <div className=" grid grid-cols-4 col-span-4">
              <Calendar size={30} className="text-muted-foreground" />
              <div className="col-span-3">
                <div>Days of the week</div>
                <div className="text-gray-800 text-sm">
                  On What days should pyezza send message
                </div>
              </div>
            </div>
            <DaysOfTheWeek setValue={setDaysOfTheWeek} value={daysOfTheWeek} />
          </div>

          <div className="flex flex-col items-start gap-4 lg:gap-0 lg:grid lg:grid-cols-8 lg:items-center">
            <div className=" grid grid-cols-4 col-span-4">
              <Clock size={30} className="text-muted-foreground" />
              <div className="col-span-3">
                <div>Time of the day</div>
                <div className="text-gray-800 text-sm">
                  At what time should pyezza drop a banger
                </div>
              </div>
            </div>
            <TimeOfDay date={timeOfTheDay} setDate={setTimeOfTheDay} />
          </div>
          <div className="flex flex-col items-start gap-4 lg:gap-0 lg:grid lg:grid-cols-8 lg:items-center">
            <div className=" grid grid-cols-4 col-span-4">
              <Earth size={30} className="text-muted-foreground" />
              <div className="col-span-3 text-start">
                <div>Select Your timezone</div>
                <div className="text-gray-800 text-sm"></div>
              </div>
            </div>
            <TimezoneComboBox value={timezone} onChange={setTimezone} />
          </div>
          {data.channel.type === "spotlight" && (
            <div className="flex flex-col items-start gap-4 lg:gap-0 lg:grid lg:grid-cols-8 lg:items-center">
              <div className=" grid grid-cols-4 col-span-4">
                <Bell size={30} className="text-muted-foreground" />
                <div className="col-span-3 text-start">
                  <div>Enable Reminders</div>
                  <div className="text-gray-800 text-sm"></div>
                </div>
              </div>
              <Switch
                checked={reminderOn}
                onCheckedChange={(value) => setReminderOn(value)}
              />
            </div>
          )}
          {reminderOn && (
            <div className="flex flex-col items-start gap-4 lg:gap-0 lg:grid lg:grid-cols-8 lg:items-center">
              <div className=" grid grid-cols-4 col-span-4">
                <Clock size={30} className="text-muted-foreground" />
                <div className="col-span-3">
                  <div>Reminder Interval</div>
                  <div className="text-gray-800 text-sm">
                    After how much time should pyezza remind them?
                  </div>
                </div>
              </div>
              <TimeOfDay
                date={reminderInterval}
                setDate={setReminderInterval}
              />
            </div>
          )}

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
        </>
      )}
    </div>
  );
}
