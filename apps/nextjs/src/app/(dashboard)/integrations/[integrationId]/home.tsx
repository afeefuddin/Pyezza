import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { TIntegrationWithChannels } from "@repo/types/integration";
import { Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function ChannelCard({
  channelName,
  type,
  publicId,
  integrationId,
}: {
  channelName: string;
  type: string;
  publicId: string;
  integrationId: string;
}) {
  return (
    <Card className="p-6 flex flex-col gap-4 rounded">
      <div className="flex flex-row justify-between">
        <div className="font-bold">#{channelName}</div>
        <Link href={`/integrations/${integrationId}/c/${publicId}`} prefetch>
          <Settings size={20} />
        </Link>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-1">
          <div className="capitalize text-lg">{type}</div>
          <div className="text-gray-700">Next Message at</div>
        </div>
        {type === "spotlight" ? (
          <Image src="/spotlight.svg" alt="" height={100} width={100} />
        ) : (
          <Image src="/wouldyourather.png" alt="" height={130} width={130} />
        )}
      </div>
    </Card>
  );
}

export default function Home({ data }: { data: TIntegrationWithChannels }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="text-xl font-bold">Your Channels</div>
        <Link href={`/integrations/${data.publicId}/new`}>
          <Button>Add channel</Button>
        </Link>
      </div>
      <div>
        {data.channels.length > 0 ? (
          <div className="lg:grid lg:grid-cols-2 gap-2">
            {data.channels.map((c) => (
              <ChannelCard
                channelName={c.channelName ?? ""}
                type={c.type}
                key={c.channelId}
                publicId={c.publicId}
                integrationId={data.publicId}
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
