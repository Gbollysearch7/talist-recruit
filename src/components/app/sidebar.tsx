"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Users,
  GitBranch,
  Bookmark,
  Settings,
  LogOut,
  Box,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navLinks = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Search", href: "/app/search", icon: Search },
  { label: "Candidates", href: "/app/candidates", icon: Users },
  { label: "Pipeline", href: "/app/pipeline", icon: GitBranch },
  { label: "Saved Searches", href: "/app/saved-searches", icon: Bookmark },
  { label: "Settings", href: "/app/settings", icon: Settings },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/app") {
      return pathname === "/app";
    }
    return pathname.startsWith(href);
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-[var(--mono-border)]",
        "bg-[var(--mono-bg)] transition-all duration-300 ease-in-out",
        "shrink-0 relative"
      )}
      style={{ width: collapsed ? 64 : 256 }}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex items-center h-16 border-b border-[var(--mono-border)]",
          "shrink-0",
          collapsed ? "justify-center px-0" : "px-5 gap-3"
        )}
      >
        <Box
          size={20}
          className="text-[var(--mono-fg)] shrink-0"
          strokeWidth={2}
        />
        {!collapsed && (
          <span className="text-sm font-bold tracking-tight text-[var(--mono-fg)] uppercase whitespace-nowrap">
            Talist.ai
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        <ul className="flex flex-col gap-1 px-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  title={collapsed ? link.label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg transition-all duration-150",
                    "text-xs font-medium uppercase tracking-wide",
                    collapsed
                      ? "justify-center w-10 h-10 mx-auto"
                      : "px-3 py-2.5",
                    active
                      ? "bg-[var(--mono-fg)] text-[var(--mono-bg)]"
                      : "text-[var(--mono-muted)] hover:text-[var(--mono-fg)] hover:bg-[var(--mono-whisper)]"
                  )}
                >
                  <Icon
                    size={18}
                    strokeWidth={active ? 2 : 1.5}
                    className="shrink-0"
                  />
                  {!collapsed && (
                    <span className="truncate">{link.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div
        className={cn(
          "border-t border-[var(--mono-border)] py-3",
          collapsed ? "px-2" : "px-2"
        )}
      >
        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center gap-3 rounded-lg transition-all duration-150",
            "text-xs font-medium text-[var(--mono-muted)]",
            "hover:text-[var(--mono-fg)] hover:bg-[var(--mono-whisper)]",
            collapsed
              ? "justify-center w-10 h-10 mx-auto"
              : "w-full px-3 py-2.5"
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={18} strokeWidth={1.5} className="shrink-0" />
          ) : (
            <>
              <ChevronLeft size={18} strokeWidth={1.5} className="shrink-0" />
              <span className="truncate">Collapse</span>
            </>
          )}
        </button>

        {/* Sign Out */}
        <button
          className={cn(
            "flex items-center gap-3 rounded-lg transition-all duration-150",
            "text-xs font-medium text-[var(--mono-muted)]",
            "hover:text-red-400 hover:bg-red-500/10",
            collapsed
              ? "justify-center w-10 h-10 mx-auto"
              : "w-full px-3 py-2.5"
          )}
          title={collapsed ? "Sign out" : undefined}
          onClick={() => {
            // TODO: Implement sign out with Supabase
          }}
        >
          <LogOut size={18} strokeWidth={1.5} className="shrink-0" />
          {!collapsed && <span className="truncate">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
