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
  console.log(configuredChannels);
  return (
    <div className="grid gap-4">
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
              className={`p-6 ${feature.isPremium ? "opacity-70" : "cursor-pointer hover:border-orange-400"} ${isConfigured && "border-2 border-primary"} transition-colors`}
              onClick={() => !feature.isPremium && onSelect(feature.id)}
            >
              <div className="flex items-start gap-4">
                <div className="text-orange-600 mt-1">{feature.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 justify-between">
                    <h3 className="font-bold text-lg">{feature.name}</h3>
                    {feature.isPremium && (
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
                    )}
                    {isConfigured && (
                      <div className="text-primary">
                        #
                        {configuredChannels?.name || configuredChannels.channel}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {feature.description}
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
