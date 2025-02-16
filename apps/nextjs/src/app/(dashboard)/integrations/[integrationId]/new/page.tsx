import { getIntegration } from "@/actions/integration";
import Onboarding from "../onboarding";

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
    <div className="p-4 sm:p-8 lg:p-16 w-full  overflow-y-auto">
      <Onboarding data={data} integrationId={integrationId}>
        <div className=" text-lg md:text-2xl text-primary font-bold">
          Add a new channel
        </div>
        <div className="text-base md:text-xl font-semibold text-secondary ">
          Let's start configuring the pyezza now.
        </div>
      </Onboarding>
    </div>
  );
}
