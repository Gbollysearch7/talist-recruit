"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    {
      label: "Profile",
      icon: User,
      onClick: () => {
        router.push("/app/settings");
        setOpen(false);
      },
    },
    {
      label: "Settings",
      icon: Settings,
      onClick: () => {
        router.push("/app/settings");
        setOpen(false);
      },
    },
    {
      label: "Sign Out",
      icon: LogOut,
      onClick: () => {
        // TODO: Implement sign out with Supabase
        setOpen(false);
      },
    },
  ];

  return (
    <div ref={menuRef} className="relative">
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full",
          "bg-[var(--mono-ghost)] border border-[var(--mono-border)]",
          "text-[var(--mono-fg)] text-xs font-semibold uppercase",
          "hover:bg-[var(--mono-border)] transition-colors duration-150",
          "focus:outline-none focus:ring-1 focus:ring-[var(--mono-border)]"
        )}
        aria-label="User menu"
        aria-expanded={open}
      >
        TA
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            "absolute right-0 top-full mt-2 w-48 z-50",
            "bg-[var(--mono-bg)] border border-[var(--mono-border)] rounded-lg",
            "shadow-xl shadow-black/40",
            "animate-fade-in"
          )}
        >
          {/* User info header */}
          <div className="px-4 py-3 border-b border-[var(--mono-border)]">
            <p className="text-xs font-medium text-[var(--mono-fg)] truncate">
              Recruiter
            </p>
            <p className="text-[11px] text-[var(--mono-muted)] truncate mt-0.5">
              admin@talist.ai
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isSignOut = item.label === "Sign Out";
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-2 text-left",
                    "text-xs transition-colors duration-150",
                    isSignOut
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-[var(--mono-muted)] hover:text-[var(--mono-fg)] hover:bg-[var(--mono-whisper)]",
                    isSignOut && "border-t border-[var(--mono-border)] mt-1"
                  )}
                >
                  <Icon size={14} strokeWidth={1.5} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
