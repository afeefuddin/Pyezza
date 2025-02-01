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
    <div className="p-8 md:p-16 w-full  overflow-y-auto">
      {data.onboardingCompleted ? (
        <Home data={data} />
      ) : (
        <Onboarding data={data} integrationId={integrationId} />
      )}
    </div>
  );
}
