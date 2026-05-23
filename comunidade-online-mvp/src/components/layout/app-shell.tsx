import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6 lg:px-8">
        <AppSidebar />
        <div className="min-w-0 flex-1 space-y-6">
          <Topbar />
          {children}
        </div>
      </div>
    </div>
  );
}

