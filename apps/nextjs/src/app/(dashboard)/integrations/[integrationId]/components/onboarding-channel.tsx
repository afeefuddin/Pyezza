"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { slackChannelsResponseSchema } from "@/lib/slack-api";
import {
  Select,
  SelectGroup,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
const featureDetails = {
  intros: {
    title: "Team Introductions Channel",
    description:
      "Choose where new team members will be introduced and welcomed.",
    recommendation:
      "We recommend using a dedicated channel for introductions to keep them organized and easily accessible.",
  },
  wouldyourather: {
    title: "Discussion Topics Channel",
    description:
      "Select where discussion prompts and conversation starters will be posted.",
    recommendation:
      "A general or team-social channel works well for engaging discussions.",
  },
  celebration: {
    title: "Team Celebrations Channel",
    description:
      "Pick a channel for birthday wishes, work anniversaries, and other celebrations.",
    recommendation:
      "Consider using a dedicated celebrations channel to keep the party going!",
  },
  spotlight: {
    title: "Spotlight Channel",
    description:
      "Pick a channel for birthday wishes, work anniversaries, and other celebrations.",
    recommendation:
      "Consider using a dedicated celebrations channel to keep the party going!",
  },
};

export default function OnboardingChannel({
  integrationId,
  feature,
  onBack,
  onSubmit,
  initialChannel,
  newChannel,
}: {
  integrationId: string;
  feature: string;
  onBack: () => void;
  onSubmit: (
    feature: string,
    channel: string,
    newChannel: boolean,
    name: string
  ) => void;
  initialChannel?: string;
  newChannel: boolean;
}) {
  const [channelType, setChannelType] = useState<"existing" | "new">(
    newChannel ? "new" : "existing"
  );
  const [newChannelName, setNewChannelName] = useState(initialChannel);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(
    initialChannel || null
  );

  const [agreed, setAgreed] = useState(false);

  const { data: channels } = useQuery({
    queryKey: ["channels", integrationId],
    queryFn: async () => {
      const response = await axios.get(`/api/slack/${integrationId}/channels`);
      const rawData = response.data;
      const parsedData = slackChannelsResponseSchema.parse(rawData);
      return parsedData.channels;
    },
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const details = featureDetails[feature as keyof typeof featureDetails];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const channelToUse =
      channelType === "new" ? newChannelName : selectedChannel;
    if (channelToUse) {
      onSubmit(
        feature,
        channelToUse,
        channelType === "new",
        channels?.find((value) => value.id === channelToUse)?.name ?? ""
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Button
        variant="ghost"
        className="gap-2 text-orange-600 hover:text-orange-700 -ml-2"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-medium text-orange-700">
            {details.title}
          </h2>
          <p className="text-muted-foreground">{details.description}</p>
        </div>

        <Card className="p-4 bg-orange-50 border-orange-100">
          <div className="flex gap-2">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Plus className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-medium text-orange-700">Pro tip</h3>
              <p className="text-sm text-orange-600">
                {details.recommendation}
              </p>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <RadioGroup
            defaultValue={channelType}
            onValueChange={(value) =>
              setChannelType(value as "existing" | "new")
            }
            className="space-y-4"
          >
            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="existing" id="existing" />
                <Label htmlFor="existing">Use existing channel</Label>
              </div>
              {channelType === "existing" && (
                <div className="mt-4 ml-6">
                  <div className="relative">
                    <Select
                      onValueChange={(value) => setSelectedChannel(value)}
                      defaultValue={!newChannel ? initialChannel : undefined}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="select a channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {channels?.map((channel) => (
                            <SelectItem
                              key={channel.id}
                              value={channel.id}
                              className={cn(
                                "w-full px-3 py-2 text-left hover:bg-orange-50 transition-colors",
                                selectedChannel === channel.id &&
                                  "bg-orange-100"
                              )}
                              onClick={() => setSelectedChannel(channel.id)}
                            >
                              # {channel.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new">Create new channel</Label>
              </div>
              {channelType === "new" && (
                <div className="mt-4 ml-6">
                  <Input
                    placeholder="Enter new channel name"
                    defaultValue={newChannel ? initialChannel : ""}
                    value={newChannelName}
                    onChange={(e) =>
                      setNewChannelName(
                        e.target.value.toLowerCase().replace(/\s+/g, "-")
                      )
                    }
                    className="bg-white"
                  />
                </div>
              )}
            </div>
          </RadioGroup>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked as boolean)}
            />
            <label htmlFor="consent" className="text-sm text-muted-foreground">
              I understand that the bot will be added to the selected channel
              and team members will receive notifications.
            </label>
          </div>

          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 w-full"
            disabled={(!selectedChannel && !newChannelName) || !agreed}
          >
            {initialChannel ? "Update Channel" : "Create Channel"}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
