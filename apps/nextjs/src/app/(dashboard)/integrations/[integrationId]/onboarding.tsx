"use client";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { UserCircle2, MessageSquare, PartyPopper, Trophy } from "lucide-react";
import Features from "./components/features";
import OnboardingChannel from "./components/onboarding-channel";

export interface Feature {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  details: string[];
  isPremium?: boolean;
}

const features: Feature[] = [
  {
    id: "intros",
    name: "Team Introductions",
    icon: <UserCircle2 className="h-5 w-5" />,
    description: "Welcome new team members and facilitate introductions",
    details: [
      "Automated welcome messages for new team members",
      "Customizable introduction templates",
      "Ice-breaker questions to spark conversations",
      "Weekly team member spotlights",
    ],
  },
  {
    id: "discussions",
    name: "Discussion Topics",
    icon: <MessageSquare className="h-5 w-5" />,
    description: "Keep conversations flowing with curated discussion topics",
    details: [
      "Daily/weekly discussion prompts",
      "Industry-relevant conversation starters",
      "Fun and engaging team questions",
      "Cultural exchange topics",
    ],
  },
  {
    id: "celebrations",
    name: "Team Celebrations",
    icon: <PartyPopper className="h-5 w-5" />,
    description: "Celebrate important moments and milestones",
    details: [
      "Birthday celebrations",
      "Work anniversaries",
      "Project completion celebrations",
      "Personal achievement announcements",
    ],
  },
  {
    id: "rewards",
    name: "Team Rewards & Recognition",
    icon: <Trophy className="h-5 w-5" />,
    description: "Recognize and reward outstanding team contributions",
    details: [
      "Peer-to-peer recognition system",
      "Monthly MVP awards",
      "Performance-based point system",
      "Redeemable rewards catalog",
    ],
    isPremium: true,
  },
];

interface ChannelConfig {
  feature: string;
  channel: string;
}

export default function Onboarding({
  data,
}: {
  data: { teamName: string | null; teamId: string };
}) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [configuredChannels, setConfiguredChannels] = useState<ChannelConfig[]>(
    []
  );

  const handleChannelSelect = (feature: string, channel: string) => {
    setConfiguredChannels((prev) => {
      const existing = prev.find((c) => c.feature === feature);
      if (existing) {
        return prev.map((c) => (c.feature === feature ? { ...c, channel } : c));
      }
      return [...prev, { feature, channel }];
    });
    setSelectedFeature(null);
  };

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-col gap-2 ">
        <div className=" text-lg md:text-2xl text-primary font-bold">
          Yay you added Pyezza to {data.teamName ?? data.teamId}
        </div>
        <div className="text-base md:text-xl font-semibold text-secondary ">
          Let's Finish Onboarding
        </div>
      </div>
      <Separator />
      <div className="text-lg text-muted-foreground">
        <div className="text-lg">
          Configure your workspace's social features to enhance team engagement
          and culture.
        </div>
        <div>
          Choose the features you want to enable and select or create Slack
          channels for each one.
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-medium text-orange-700">
          Choose Your Social Features
        </h2>
        <p className="text-muted-foreground">
          <p>Select a feature to configure its Slack channel.</p>
          <p>
            You can set up multiple features to create a comprehensive social
            engagement system.
          </p>
        </p>
      </div>
      {/* {configuredChannels.length > 0 && (
        <div className="mb-12">
          <ConfiguredChannels
            channels={configuredChannels}
            onEdit={setSelectedFeature}
          />
        </div>
      )} */}
      {!selectedFeature ? (
        <Features
          features={features}
          onSelect={setSelectedFeature}
          configuredChannels={configuredChannels}
        />
      ) : (
        <OnboardingChannel
          feature={selectedFeature}
          onBack={() => setSelectedFeature(null)}
          onSubmit={handleChannelSelect}
          initialChannel={
            configuredChannels.find((c) => c.feature === selectedFeature)
              ?.channel
          }
        />
      )}
    </div>
  );
}
