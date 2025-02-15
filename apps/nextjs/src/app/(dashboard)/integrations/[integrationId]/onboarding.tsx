"use client";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import { MessageSquare, PartyPopper, LoaderCircle } from "lucide-react";
import Features from "./components/features";
import OnboardingChannel from "./components/onboarding-channel";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

export interface Feature {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  isPremium?: boolean;
}

const features: Feature[] = [
  // {
  //   id: "intros",
  //   name: "Team Introductions",
  //   icon: <UserCircle2 className="h-5 w-5" />,
  //   description: "Welcome new team members and facilitate introductions",
  //   details: [
  //     "Automated welcome messages for new team members",
  //     "Customizable introduction templates",
  //     "Ice-breaker questions to spark conversations",
  //     "Weekly team member spotlights",
  //   ],
  // },
  {
    id: "wouldyourather",
    name: "Would you rather?",
    icon: <MessageSquare className="h-5 w-5" />,
    description: "Answer spicy would you rather questions",
  },
  {
    id: "socialsips",
    name: "Social Sips",
    icon: <PartyPopper className="h-5 w-5" />,
    description: "Random topic starter",
  },
  {
    id: "spotlight",
    name: "Put people on the spot",
    icon: <PartyPopper className="h-5 w-5" />,
    description: "Put people in the spotlight and asks them questions",
  },
  // {
  //   id: "rewards",
  //   name: "Team Rewards & Recognition",
  //   icon: <Trophy className="h-5 w-5" />,
  //   description: "Recognize and reward outstanding team contributions",
  //   details: [
  //     "Peer-to-peer recognition system",
  //     "Monthly MVP awards",
  //     "Performance-based point system",
  //     "Redeemable rewards catalog",
  //   ],
  //   isPremium: true,
  // },
];

interface ChannelConfig {
  feature: string;
  channel: string;
  new: boolean;
  name: string;
}

export default function Onboarding({
  data,
  integrationId,
  children,
}: {
  data: { teamName: string | null; teamId: string };
  integrationId: string;
  children: React.ReactNode;
}) {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const router = useRouter();
  const [configuredChannels, setConfiguredChannels] =
    useState<ChannelConfig | null>(null);
  const { mutate: submit, isPending } = useMutation({
    mutationKey: ["create-channel"],
    mutationFn: async () => {
      if (!configuredChannels) return;
      const body:
        | {
            new: true;
            channelName?: string;
            channelType: string;
          }
        | {
            new: false;
            channelId?: string;
            channelType: string;
          } = {
        new: configuredChannels.new === true,
        channelType: configuredChannels.feature,
      };

      if (body["new"]) {
        body["channelName"] = configuredChannels.channel;
      } else {
        body["channelId"] = configuredChannels.channel;
      }

      const response = await axios.post(
        `/api/slack/${integrationId}/channels`,
        {
          channel: body,
          onboarding: true,
        }
      );

      const data = response.data;
      router.push(`/integrations/${integrationId}`);
      return data;
    },
  });

  const handleChannelSelect = (
    feature: string,
    channel: string,
    newChannel: boolean,
    name: string
  ) => {
    setConfiguredChannels({ feature, channel, new: newChannel, name });
    setSelectedFeature(null);
  };

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex flex-col gap-2 ">{children}</div>
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
        <h2 className="text-xl font-medium text-primary">
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

      {!selectedFeature ? (
        <>
          <Features
            features={features}
            onSelect={setSelectedFeature}
            configuredChannels={configuredChannels}
          />
          <div className="flex justify-end">
            <Button
              size="lg"
              className="text-base font-semibold"
              disabled={!configuredChannels || isPending}
              onClick={() => submit()}
            >
              {isPending && (
                <LoaderCircle
                  className="-ms-1 me-2 animate-spin"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              )}
              Submit
            </Button>
          </div>
        </>
      ) : (
        <OnboardingChannel
          integrationId={integrationId ?? ""}
          feature={selectedFeature}
          onBack={() => setSelectedFeature(null)}
          onSubmit={handleChannelSelect}
          initialChannel={configuredChannels?.channel}
          newChannel={!!configuredChannels?.new}
        />
      )}
    </div>
  );
}
