import CTA from "@/components/dashboard/cta";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function Dashboard() {
  return (
    <div className="p-8 lg:p-16 w-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your integrations and messaging activity
        </p>
      </div>
      <DashboardContent />
      <CTA />
      <div></div>
    </div>
  );
}
