"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { SearchHistorySidebar } from "@/components/search/search-history-sidebar";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const mainNavLinks = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Search", href: "/search", icon: "search" },
  { label: "Saved Searches", href: "/saved-searches", icon: "bookmark" },
  { label: "My Lists", href: "/candidates", icon: "list" },
  { label: "Pipeline", href: "/pipeline", icon: "group" },
];

const bottomNavLinks = [
  { label: "Settings", href: "/settings", icon: "settings" },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-[var(--border-light)]",
        "bg-[var(--bg-surface)] transition-all duration-300 ease-in-out",
        "shrink-0 relative"
      )}
      style={{ width: collapsed ? 64 : 240 }}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex items-center h-12 border-b border-[var(--border-light)]",
          "shrink-0",
          collapsed ? "justify-center px-0" : "px-4 gap-2"
        )}
      >
        <span
          className="material-symbols-outlined text-[var(--primary)] shrink-0"
          style={{ fontSize: 22 }}
        >
          auto_awesome
        </span>
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">
            talist.ai
          </span>
        )}
      </div>

      {/* New Search Button */}
      <div className={cn("pt-3 pb-2", collapsed ? "px-2" : "px-3")}>
        <Link
          href="/search"
          className={cn(
            "flex items-center justify-center gap-2 rounded",
            "btn btn-primary text-sm font-medium",
            collapsed ? "w-10 h-10 mx-auto" : "w-full px-3 py-2"
          )}
        >
          <Plus size={16} strokeWidth={2} className="shrink-0" />
          {!collapsed && <span>New Search</span>}
        </Link>
      </div>

      {/* Label */}
      {!collapsed && (
        <div className="px-4 pt-3 pb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Menu
          </span>
        </div>
      )}

      {/* Main Navigation + Search History */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="py-1 overflow-x-hidden shrink-0">
          <ul className="flex flex-col gap-0.5 px-2">
            {mainNavLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    title={collapsed ? link.label : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded transition-all duration-150",
                      "text-xs font-medium",
                      collapsed
                        ? "justify-center w-10 h-10 mx-auto"
                        : "px-3 py-1.5",
                      active
                        ? "bg-[var(--primary)]/10 text-[var(--text-primary)]"
                        : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                    )}
                  >
                    <span
                      className="material-symbols-outlined shrink-0"
                      style={{
                        fontSize: 18,
                        fontVariationSettings: active
                          ? "'FILL' 1, 'wght' 500"
                          : "'FILL' 0, 'wght' 300",
                      }}
                    >
                      {link.icon}
                    </span>
                    {!collapsed && (
                      <span className="truncate">{link.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Search History - shown when on /search */}
        {pathname.startsWith("/search") && (
          <div className="flex-1 overflow-y-auto border-t border-[var(--border-light)] mt-1 pt-1">
            <SearchHistorySidebar
              collapsed={collapsed}
              onSelectSearch={(q) => {
                const params = new URLSearchParams();
                params.set("q", q);
                router.push(`/search?${params.toString()}`);
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="border-t border-[var(--border-light)] py-2 px-2">
        {/* Settings */}
        {bottomNavLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? link.label : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded transition-all duration-150",
                "text-xs font-medium",
                collapsed
                  ? "justify-center w-10 h-10 mx-auto"
                  : "w-full px-3 py-1.5",
                active
                  ? "bg-[var(--primary)]/10 text-[var(--text-primary)]"
                  : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
              )}
            >
              <span
                className="material-symbols-outlined shrink-0"
                style={{
                  fontSize: 18,
                  fontVariationSettings: active
                    ? "'FILL' 1, 'wght' 500"
                    : "'FILL' 0, 'wght' 300",
                }}
              >
                {link.icon}
              </span>
              {!collapsed && <span className="truncate">{link.label}</span>}
            </Link>
          );
        })}

        {/* Help & Support */}
        <button
          className={cn(
            "flex items-center gap-2.5 rounded transition-all duration-150",
            "text-xs font-medium text-[var(--text-tertiary)]",
            "hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]",
            collapsed
              ? "justify-center w-10 h-10 mx-auto"
              : "w-full px-3 py-1.5"
          )}
          title={collapsed ? "Help & Support" : undefined}
        >
          <span
            className="material-symbols-outlined shrink-0"
            style={{ fontSize: 18, fontVariationSettings: "'FILL' 0, 'wght' 300" }}
          >
            help
          </span>
          {!collapsed && <span className="truncate">Help & Support</span>}
        </button>

        <div className="my-1 border-t border-[var(--border-light)]" />

        {/* Collapse toggle */}
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center gap-2.5 rounded transition-all duration-150",
            "text-xs font-medium text-[var(--text-tertiary)]",
            "hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]",
            collapsed
              ? "justify-center w-10 h-10 mx-auto"
              : "w-full px-3 py-1.5"
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
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-2.5 rounded transition-all duration-150",
            "text-xs font-medium text-[var(--text-tertiary)]",
            "hover:text-red-400 hover:bg-red-500/10",
            collapsed
              ? "justify-center w-10 h-10 mx-auto"
              : "w-full px-3 py-1.5"
          )}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut size={16} strokeWidth={1.5} className="shrink-0" />
          {!collapsed && <span className="truncate">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
