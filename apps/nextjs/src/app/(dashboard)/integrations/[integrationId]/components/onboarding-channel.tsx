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
const featureDetails = {
  intros: {
    title: "Team Introductions Channel",
    description:
      "Choose where new team members will be introduced and welcomed.",
    recommendation:
      "We recommend using a dedicated channel for introductions to keep them organized and easily accessible.",
  },
  discussions: {
    title: "Discussion Topics Channel",
    description:
      "Select where discussion prompts and conversation starters will be posted.",
    recommendation:
      "A general or team-social channel works well for engaging discussions.",
  },
  celebrations: {
    title: "Team Celebrations Channel",
    description:
      "Pick a channel for birthday wishes, work anniversaries, and other celebrations.",
    recommendation:
      "Consider using a dedicated celebrations channel to keep the party going!",
  },
};

export default function OnboardingChannel({
  feature,
  onBack,
  onSubmit,
  initialChannel,
}: {
  feature: string;
  onBack: () => void;
  onSubmit: (feature: string, channel: string) => void;
  initialChannel?: string;
}) {
  const [channelType, setChannelType] = useState<"existing" | "new">(
    initialChannel ? "existing" : "new"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [newChannelName, setNewChannelName] = useState("");
  const [selectedChannel, setSelectedChannel] = useState<string | null>(
    initialChannel || null
  );
  const [agreed, setAgreed] = useState(false);

  // Mock channels - in real app, these would come from Slack API
  const channels = [
    "general",
    "random",
    "team-social",
    "announcements",
    "celebrations",
    "introductions",
    "discussions",
  ].filter((channel) =>
    channel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const details = featureDetails[feature as keyof typeof featureDetails];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const channelToUse =
      channelType === "new" ? newChannelName : selectedChannel;
    if (channelToUse) {
      onSubmit(feature, channelToUse);
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
                    <Input
                      placeholder="Search your Slack channels..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white"
                    />
                    {channels.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto z-10">
                        {channels.map((channel) => (
                          <button
                            key={channel}
                            type="button"
                            className={cn(
                              "w-full px-3 py-2 text-left hover:bg-orange-50 transition-colors",
                              selectedChannel === channel && "bg-orange-100"
                            )}
                            onClick={() => setSelectedChannel(channel)}
                          >
                            # {channel}
                          </button>
                        ))}
                      </div>
                    )}
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
