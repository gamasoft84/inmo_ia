import type { ReactNode } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { FAB } from "@/components/layout/FAB";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title="InmoIA" />
        <main className="content-area pb-20 md:pb-5">{children}</main>
      </div>
      <BottomNav />
      <FAB />
    </div>
  );
}
