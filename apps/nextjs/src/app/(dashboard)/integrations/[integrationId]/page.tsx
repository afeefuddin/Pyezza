import { getIntegration } from "@/actions/integration";
import { Separator } from "@/components/ui/separator";
import Onboarding from "./onboarding";

export default async function Page({
  params,
}: {
  params: Promise<{ integrationId: string }>;
}) {
  const { integrationId } = await params;
  const data = await getIntegration(integrationId);
  if (!data) {
    return <div>Page not found</div>;
  }
  return (
    <div className="p-8 md:p-16 w-full  overflow-y-auto">
      <Onboarding data={data} />
    </div>
  );
}
