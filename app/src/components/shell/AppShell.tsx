"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50 dark:bg-stone-950">
      <Sidebar collapsed={collapsed} />

      {mobileOpen && (
        <Sidebar mobile onClose={() => setMobileOpen(false)} />
      )}

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar
          onMenuToggle={() => setMobileOpen(!mobileOpen)}
          onSidebarCollapse={() => setCollapsed(!collapsed)}
          sidebarCollapsed={collapsed}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
