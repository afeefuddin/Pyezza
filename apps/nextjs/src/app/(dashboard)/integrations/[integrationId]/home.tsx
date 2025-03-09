import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { TIntegrationWithChannels } from "@repo/types/integration";
import { Plus, Settings } from "lucide-react";
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
    <Card className="group relative p-6 flex flex-col gap-4 rounded-lg transition-all hover:cursor-pointer hover:shadow-lg">
      <Link href={`/integrations/${integrationId}/c/${publicId}`} prefetch>
        <div className="absolute inset-0 bg-gradient-to-r rounded-lg from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="flex flex-row justify-between shrink gap-4">
          <div className="text-2xl  truncate font-bold shrink">
            #{channelName}
          </div>
          <Settings size={20} />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <div className="capitalize text-lg">{type}</div>
            <div className="text-gray-700">Messages Sent: {messageSent}</div>
          </div>
          {type === "spotlight" ? (
            <Image src="/spotlight.svg" alt="" height={100} width={100} />
          ) : type === "socialsips" ? (
            <Image src="/socialsips.png" alt="" height={130} width={130} />
          ) : (
            <Image src="/wouldyourather.png" alt="" height={130} width={130} />
          )}
        </div>
      </Link>
    </Card>
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
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
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
