"use client";

import { useState } from "react";
import { Sidebar } from "@/components/app/sidebar";
import { TopBar } from "@/components/app/top-bar";
import { QueryProvider } from "@/providers/query-provider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <QueryProvider>
      <div className="flex h-screen bg-[var(--bg-secondary)] overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex flex-1 flex-col min-w-0">
          <TopBar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
          <main className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
            <div className="mx-auto max-w-6xl p-4">{children}</div>
          </main>
        </div>
      </div>
    </QueryProvider>
  );
}
