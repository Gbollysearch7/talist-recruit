"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/app/user-menu";

interface TopBarProps {
  onToggleSidebar: () => void;
}

const pageTitles: Record<string, string> = {
  "/app": "Dashboard",
  "/app/search": "Search",
  "/app/candidates": "Candidates",
  "/app/pipeline": "Pipeline",
  "/app/saved-searches": "Saved Searches",
  "/app/settings": "Settings",
};

function getPageTitle(pathname: string): string {
  // Exact match first
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  // Check for prefix match (e.g., /app/candidates/123)
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 2) {
    const baseRoute = `/${segments[0]}/${segments[1]}`;
    if (pageTitles[baseRoute]) {
      return pageTitles[baseRoute];
    }
  }

  return "Dashboard";
}

export function TopBar({ onToggleSidebar }: TopBarProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header
      className={cn(
        "flex items-center justify-between shrink-0",
        "h-16 px-6 border-b border-[var(--mono-border)]",
        "bg-[var(--mono-bg)]"
      )}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg",
            "text-[var(--mono-muted)] hover:text-[var(--mono-fg)]",
            "hover:bg-[var(--mono-whisper)] transition-colors duration-150"
          )}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} strokeWidth={1.5} />
        </button>

        <h1 className="text-sm font-semibold text-[var(--mono-fg)] uppercase tracking-wide">
          {title}
        </h1>
      </div>

      {/* Center section - Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 rounded-lg",
            "bg-[var(--mono-whisper)] border border-[var(--mono-border)]",
            "focus-within:border-[var(--mono-muted)] transition-colors duration-150"
          )}
        >
          <Search
            size={14}
            strokeWidth={1.5}
            className="text-[var(--mono-ghost)] shrink-0"
          />
          <input
            type="text"
            placeholder="Search candidates, jobs..."
            className={cn(
              "w-full bg-transparent text-xs text-[var(--mono-fg)]",
              "placeholder:text-[var(--mono-ghost)]",
              "focus:outline-none"
            )}
          />
          <kbd
            className={cn(
              "hidden sm:inline-flex items-center px-1.5 py-0.5 rounded",
              "text-[10px] text-[var(--mono-ghost)]",
              "bg-[var(--mono-whisper)] border border-[var(--mono-border)]",
              "font-mono"
            )}
          >
            /
          </kbd>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className={cn(
            "relative flex items-center justify-center w-8 h-8 rounded-lg",
            "text-[var(--mono-muted)] hover:text-[var(--mono-fg)]",
            "hover:bg-[var(--mono-whisper)] transition-colors duration-150"
          )}
          aria-label="Notifications"
        >
          <Bell size={16} strokeWidth={1.5} />
          {/* Notification dot placeholder */}
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--mono-success)]" />
        </button>

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
}
