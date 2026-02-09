"use client";

import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/app/user-menu";

interface TopBarProps {
  onToggleSidebar: () => void;
}

export function TopBar({ onToggleSidebar }: TopBarProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between shrink-0",
        "h-12 px-4 border-b border-[var(--border-light)]",
        "bg-[var(--bg-elevated)]/80 backdrop-blur-sm"
      )}
    >
      {/* Left section - Brand */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded",
            "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
            "hover:bg-[var(--bg-surface)] transition-colors duration-150",
            "lg:hidden"
          )}
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            menu
          </span>
        </button>
        <span
          className="material-symbols-outlined text-[var(--text-tertiary)]"
          style={{ fontSize: 20 }}
        >
          filter_center_focus
        </span>
        <span className="text-xs font-semibold text-[var(--text-secondary)] tracking-wide">
          talist.ai
        </span>
      </div>

      {/* Center - Compact search bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div
          className={cn(
            "flex items-center gap-2 w-full px-3 py-1.5 rounded",
            "bg-[var(--bg-surface)] border border-[var(--border-light)]",
            "focus-within:border-[var(--border-focus)] transition-colors duration-150"
          )}
        >
          <span
            className="material-symbols-outlined text-[var(--text-muted)] shrink-0"
            style={{ fontSize: 16 }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Search candidates, jobs..."
            className={cn(
              "w-full bg-transparent text-xs text-[var(--text-primary)]",
              "placeholder:text-[var(--text-muted)]",
              "focus:outline-none"
            )}
          />
          <div className="flex items-center gap-1 shrink-0">
            <button className="p-0.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                share
              </span>
            </button>
            <button className="p-0.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                content_copy
              </span>
            </button>
            <button className="p-0.5 rounded hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                history
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <button
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs",
            "text-[var(--text-tertiary)] hover:text-[var(--text-primary)]",
            "hover:bg-[var(--bg-surface)] transition-colors duration-150"
          )}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            feedback
          </span>
          <span className="hidden sm:inline">Feedback</span>
        </button>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)]">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            toll
          </span>
          <span>Credits</span>
        </div>

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
}
