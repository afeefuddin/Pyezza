import { getIntegration } from "@/actions/integration";
import Onboarding from "./onboarding";
import Home from "./home";

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
    <div className="p-4 sm:p-8 md:p-16 w-full  overflow-y-auto">
      {data.onboardingCompleted ? (
        <Home data={data} />
      ) : (
        <Onboarding data={data} integrationId={integrationId}>
          <div className=" text-lg md:text-2xl text-primary font-bold">
            Yay you added Pyezza to {data.teamName ?? data.teamId}
          </div>
          <div className="text-base md:text-xl font-semibold text-secondary ">
            Let's Finish Onboarding
          </div>
        </Onboarding>
      )}
    </div>
  );
}
