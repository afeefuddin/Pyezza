import SidebarDemo from "@/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarDemo>{children}</SidebarDemo>
    </>
  );
}
