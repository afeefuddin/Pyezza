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
import { CheckCircle2, Lock } from "lucide-react";

export default function Features({
  features,
  onSelect,
  configuredChannels,
}: {
  features: Feature[];
  onSelect: (feature: string) => void;
  configuredChannels: Array<{ feature: string; channel: string }>;
}) {
  return (
    <div className="grid gap-4">
      {features.map((feature, i) => {
        const isConfigured = configuredChannels.some(
          (c) => c.feature === feature.id
        );

        return (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className={`p-6 ${feature.isPremium ? "opacity-70" : "cursor-pointer hover:border-orange-400"} transition-colors`}
              onClick={() => !feature.isPremium && onSelect(feature.id)}
            >
              <div className="flex items-start gap-4">
                <div className="text-orange-600 mt-1">{feature.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{feature.name}</h3>
                    {isConfigured && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    {feature.isPremium && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Lock className="h-4 w-4 text-orange-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This is a premium feature. Upgrade to unlock!</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <ul className="grid sm:grid-cols-2 gap-2 mb-4">
                    {feature.details.map((detail, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                        {detail}
                      </li>
                    ))}
                  </ul>
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
