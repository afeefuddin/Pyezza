import { Card } from "@/components/ui/card";
import type { TIntegrationWithChannels } from "@repo/types/integration";

function ChannelCard({
  channelName,
  type,
}: {
  channelName: string;
  type: string;
}) {
  return (
    <Card className="p-6">
      <div className="font-bold">#{channelName}</div>
      <div className="">
        <div>{type}</div>
      </div>
    </Card>
  );
}

export default function Home({ data }: { data: TIntegrationWithChannels }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl">Your Channels</div>
      <div className="grid grid-cols-2">
        {data.channels.length > 0 ? (
          <div>
            {data.channels.map((c) => (
              <ChannelCard
                channelName={c.channelName ?? ""}
                type={c.type}
                key={c.channelId}
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
