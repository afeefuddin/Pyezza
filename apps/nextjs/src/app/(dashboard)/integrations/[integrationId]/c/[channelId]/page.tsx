import { getChannelSettings } from "@/actions/channelSetting";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Settings from "./settings";

export default async function Channel({
  params,
}: {
  params: Promise<{ integrationId: string; channelId: string }>;
}) {
  const { integrationId, channelId } = await params;
  const settings = await getChannelSettings(channelId);
  if (!settings) {
    return <></>;
  }

  return (
    <div className="p-4 sm:p-8 lg:p-16 w-full overflow-y-auto">
      <div className="p-4 pt-0">
        <div className="flex items-center gap-2">
          <Link href={`/integrations/${integrationId}`}>
            <div className="text-primary hover:underline">All channels</div>
          </Link>
          <ChevronRight size={16} />
          <div>{channelId}</div>
        </div>
      </div>
      <Separator />
      <div className="mt-8">
        <Settings data={settings} integrationId={integrationId} />
      </div>
    </div>
  );
}
