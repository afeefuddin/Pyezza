import {getIntegrations} from "@/actions/integration";
import IntegrationCard from "./integration-card";

export default async function Integration() {
  const data = await getIntegrations();
  return (
    <div className="p-8 md:p-16 w-full overflow-y-auto">
      <div className="flex flex-col overflow-y-auto p-4">
        {!data || data.length === 0 ? (
          <div className="text-lg">You don't have any integrations yet</div>
        ) : (
          <div className="flex w-full flex-col items-stretch justify-center gap-4  md:grid md:grid-cols-2 lg:grid-cols-3">
            {data.map((i) => (
              <IntegrationCard data={i} key={i.teamId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
