import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { TIntegrationWithChannels } from "@repo/types/integration";
import { MessageSquareMore, Plus, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NotificationBanner from "./components/notification-banner";

function ChannelCard({
  channelName,
  type,
  publicId,
  integrationId,
  messageSent,
}: {
  channelName: string;
  type: string;
  publicId: string;
  integrationId: string;
  messageSent: number;
}) {
  return (
    <Link href={`/integrations/${integrationId}/c/${publicId}`} prefetch>
      <Card className="p-4 hover:cursor-pointer">
        <div>
          {type === "spotlight" ? (
            <Image src="/spotlight.svg" alt="" height={400} width={400} />
          ) : type === "socialsips" ? (
            <Image src="/socialsips.png" alt="" height={400} width={400} />
          ) : (
            <Image src="/wouldyourather.png" alt="" height={400} width={400} />
          )}
          <div className="flex flex-row justify-between items-center">
            <div>
              <div className="font-bold text-xl">#{channelName}</div>
              <div className="capitalize text-gray-700">{type}</div>
            </div>
            <div className="flex flex-row gap-2">
              <MessageSquareMore className="text-gray-700" />
              <div className="text-gray-700">{messageSent}</div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function Home({
  data,
  newChannel,
}: {
  data: TIntegrationWithChannels;
  newChannel?: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="text-xl font-bold">Your Channels</div>
        <Link href={`/integrations/${data.publicId}/c/new`}>
          <Button>
            <Plus />
            Add channel
          </Button>
        </Link>
      </div>
      {newChannel === "success" && <NotificationBanner />}
      <div>
        {data.channels.length > 0 ? (
          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-4">
            {data.channels.map((c) => (
              <ChannelCard
                channelName={c.channelName ?? ""}
                type={c.type}
                key={c.publicId}
                publicId={c.publicId}
                integrationId={data.publicId}
                messageSent={c._count.Message}
              />
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
