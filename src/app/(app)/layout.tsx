"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Users,
  Kanban,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QueryProvider } from "@/providers/query-provider";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/search", label: "Search", icon: Search },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/settings", label: "Settings", icon: Settings },
];

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-[var(--mono-border,#333333)] bg-[var(--mono-bg,#121212)]">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-[var(--mono-border,#333333)] px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-6 w-6 bg-white" />
          <span className="text-sm font-bold tracking-wider text-white uppercase">
            Thalist
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "bg-white/10 text-white border border-[var(--mono-border,#333333)]"
                      : "text-[var(--mono-muted,rgba(255,255,255,0.6))] hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-[var(--mono-border,#333333)] p-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 px-3 py-2 text-sm text-[var(--mono-muted,rgba(255,255,255,0.6))] hover:text-white transition-colors duration-150 cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <div className="flex min-h-screen bg-[var(--mono-bg,#121212)]">
        <Sidebar />
        <main className="flex-1 pl-56">
          <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
        </main>
      </div>
    </QueryProvider>
  );
}
