"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { Feature } from "../onboarding";
import { Lock } from "lucide-react";

export default function Features({
  features,
  onSelect,
  configuredChannels,
}: {
  features: Feature[];
  onSelect: (feature: string) => void;
  configuredChannels: { feature: string; channel: string; name: string } | null;
}) {
  return (
    <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
      {features.map((feature, i) => {
        const isConfigured = configuredChannels?.feature === feature.id;

        return (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className={`p-8 h-full ${feature.isPremium ? "opacity-70" : "cursor-pointer  hover:border-primary"} ${isConfigured && "border-2 border-primary"} transition-colors`}
              onClick={() => !feature.isPremium && onSelect(feature.id)}
            >
              <div className="flex-col items-start gap-4">
                <div className="flex-row flex justify-between items-center">
                  <div className="text-orange-600 mt-1 text-3xl">
                    {feature.icon}
                  </div>
                  {isConfigured && (
                    <div className="text-white bg-primary/85 py-px px-1 rounded-lg ">
                      #{configuredChannels?.name || configuredChannels.channel}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 justify-between">
                    <h3 className="font-bold text-lg">{feature.name}</h3>
                    {/* {feature.isPremium && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Lock className="h-4 w-4 text-primary" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This is a premium feature. Upgrade to unlock!</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )} */}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    Example: "{feature.example}"
                  </p>
                  {feature.isPremium && (
                    <Button
                      variant="outline"
                      className="w-full text-orange-600 border-orange-600 hover:bg-orange-50"
                    >
                      Upgrade to Unlock
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
