"use client";

import { TimezoneComboBox } from "@/components/Timezonecombobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TChannelSetting } from "@repo/types/channelSetting";
import { Calendar, Clock, Earth, RotateCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { TimeOfDay } from "./components/timeofday";
import { DaysOfTheWeek } from "./components/daysoftheweek";
import { EveryNWeekSelect } from "./components/everynweekselect";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { secondToDate } from "@repo/lib/date";
import { useRouter } from "next/navigation";

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
  const [everyNWeek, setEveryNWeek] = useState(data.everyNWeek ?? 0);
  const [daysOfTheWeek, setDaysOfTheWeek] = useState(data.daysOfWeek ?? []);
  const [timeOfTheDay, setTimeOfTheDay] = useState<Date | undefined>(
    data.timeOfday ? secondToDate(data.timeOfday) : undefined
  );
  const [timezone, setTimezone] = useState<string>(
    data.timezone ?? "Etc/GMT+0"
  );
  const router = useRouter();

  const { mutate: submit } = useMutation({
    mutationKey: ["update-channel-settings"],
    mutationFn: async () => {
      const body = {
        everyNWeek,
        daysOfTheWeek,
        timeOfTheDay,
        timezone,
      };
      await axios.put(
        `/api/integrations/${integrationId}/c/${data.channel.publicId}`,
        body
      );
    },
    onSuccess() {
      router.push(`/integrations/${integrationId}`);
    },
  });

  return (
    <div className="flex flex-col gap-12 px-4">
      <div className="grid grid-cols-8 items-center">
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
        <Input
          disabled
          value={data.channel.channelName ?? ""}
          className="col-span-4"
        />
      </div>
      {data.channel.type !== "celebration" && (
        <>
          <div className="grid grid-cols-8 items-center">
            <Calendar size={30} className="text-muted-foreground" />
            <div className="col-span-3">
              <div>Days of the week</div>
              <div className="text-gray-800 text-sm">
                On What days should pyezza send message
              </div>
            </div>
            <DaysOfTheWeek setValue={setDaysOfTheWeek} value={daysOfTheWeek} />
          </div>

          <div className="grid grid-cols-8 items-center">
            <Clock size={30} className="text-muted-foreground" />
            <div className="col-span-3">
              <div>Time of the day</div>
              <div className="text-gray-800 text-sm">
                At what time should pyezza drop a banger
              </div>
            </div>
            <TimeOfDay date={timeOfTheDay} setDate={setTimeOfTheDay} />
          </div>

          <div className="grid grid-cols-8 items-center">
            <RotateCw size={30} className="text-muted-foreground" />
            <div className="col-span-3">
              <div>Every N week</div>
              <div className="text-gray-800 text-sm">
                Do you wanna have fun every week?
              </div>
            </div>
            <EveryNWeekSelect setValue={setEveryNWeek} value={everyNWeek} />
          </div>

          <div className="grid grid-cols-8 items-center">
            <Earth size={30} className="text-muted-foreground" />
            <div className="col-span-3">
              <div>Select Your timezone</div>
              <div className="text-gray-800 text-sm"></div>
            </div>
            <TimezoneComboBox value={timezone} onChange={setTimezone} />
          </div>
          <div className="flex justify-end gap-4">
            <Link href={`/integrations/${integrationId}`}>
              <Button variant="link">Cancel</Button>
            </Link>
            <Button onClick={() => submit()}>Save</Button>
          </div>
        </>
      )}
    </div>
  );
}
