"use client";

import * as React from "react";
import {
  User,
  Shield,
  Kanban,
  Key,
  CheckCircle,
  XCircle,
  Activity,
} from "lucide-react";
import { ProfileForm } from "@/components/settings/profile-form";
import { AccountSettings } from "@/components/settings/account-settings";
import { PipelineDefaults } from "@/components/settings/pipeline-defaults";
import { cn } from "@/lib/utils";

// ─── Tab definitions ────────────────────────────────────────────────────────

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Shield },
  { id: "pipeline", label: "Pipeline Defaults", icon: Kanban },
  { id: "api", label: "API", icon: Key },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── API Tab placeholder ────────────────────────────────────────────────────

function ApiTab() {
  const [exaStatus] = React.useState<"connected" | "disconnected" | "checking">(
    "connected"
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Exa API Status */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          Exa API Status
        </h3>
        <div className="flex items-center gap-3 border border-[var(--mono-border,#333333)] bg-[var(--mono-bg,#121212)] p-4">
          {exaStatus === "connected" ? (
            <>
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-white">
                  Connected
                </span>
                <span className="text-xs text-[var(--mono-muted,rgba(255,255,255,0.6))]">
                  Exa API is active and responding normally.
                </span>
              </div>
            </>
          ) : exaStatus === "disconnected" ? (
            <>
              <XCircle className="h-5 w-5 text-red-400" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-white">
                  Disconnected
                </span>
                <span className="text-xs text-[var(--mono-muted,rgba(255,255,255,0.6))]">
                  Unable to reach the Exa API. Check your credentials.
                </span>
              </div>
            </>
          ) : (
            <>
              <Activity className="h-5 w-5 text-amber-400 animate-pulse" />
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-white">
                  Checking...
                </span>
                <span className="text-xs text-[var(--mono-muted,rgba(255,255,255,0.6))]">
                  Verifying connection to Exa API.
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* API Usage Stats (placeholder) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          API Usage
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Searches */}
          <div className="flex flex-col gap-2 border border-[var(--mono-border,#333333)] bg-[var(--mono-bg,#121212)] p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--mono-muted,rgba(255,255,255,0.6))]">
              Searches This Month
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">247</span>
              <span className="text-xs text-[var(--mono-muted,rgba(255,255,255,0.6))]">
                / 1,000
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/10">
              <div
                className="h-full bg-sky-400 transition-all duration-300"
                style={{ width: "24.7%" }}
              />
            </div>
          </div>

          {/* Candidates enriched */}
          <div className="flex flex-col gap-2 border border-[var(--mono-border,#333333)] bg-[var(--mono-bg,#121212)] p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--mono-muted,rgba(255,255,255,0.6))]">
              Candidates Enriched
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">1,842</span>
              <span className="text-xs text-[var(--mono-muted,rgba(255,255,255,0.6))]">
                / 10,000
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/10">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: "18.4%" }}
              />
            </div>
          </div>

          {/* Exports */}
          <div className="flex flex-col gap-2 border border-[var(--mono-border,#333333)] bg-[var(--mono-bg,#121212)] p-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--mono-muted,rgba(255,255,255,0.6))]">
              Exports This Month
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">12</span>
              <span className="text-xs text-[var(--mono-muted,rgba(255,255,255,0.6))]">
                / 50
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/10">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: "24%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* API Key section */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
          API Key
        </h3>
        <div className="flex items-center gap-3 border border-[var(--mono-border,#333333)] bg-[var(--mono-bg,#121212)] p-4">
          <div className="flex-1">
            <code className="text-sm font-mono text-[var(--mono-muted,rgba(255,255,255,0.6))]">
              exa_sk_***************************a4f2
            </code>
          </div>
          <span className="text-xs text-[var(--mono-muted,rgba(255,255,255,0.6))]">
            Set via environment variable
          </span>
        </div>
        <p className="text-xs text-[var(--mono-muted,rgba(255,255,255,0.6))]">
          API keys are managed through server environment variables for security.
          Contact your administrator to update.
        </p>
      </div>
    </div>
  );
}

// ─── Settings Page ──────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<TabId>("profile");

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Settings
        </h1>
        <p className="text-sm text-[var(--mono-muted,rgba(255,255,255,0.6))]">
          Manage your account, profile, and pipeline configuration.
        </p>
      </div>

      {/* Tabs + content */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Tab navigation (sidebar style on lg) */}
        <nav className="flex lg:flex-col gap-1 border-b border-[var(--mono-border,#333333)] lg:border-b-0 lg:border-r lg:pr-6 lg:min-w-[200px] overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer",
                  isActive
                    ? "text-white bg-white/10 border border-[var(--mono-border,#333333)] lg:border-r-white"
                    : "text-[var(--mono-muted,rgba(255,255,255,0.6))] hover:text-white hover:bg-white/5 border border-transparent"
                )}
              >
                <tab.icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Tab content */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-white">Profile</h2>
              <ProfileForm
                initialData={{
                  fullName: "",
                  email: "user@thalist.ai",
                  company: "",
                  role: "",
                }}
                onSave={async (data) => {
                  // TODO: Wire up to API
                  await new Promise((resolve) => setTimeout(resolve, 800));
                }}
              />
            </div>
          )}

          {activeTab === "account" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-white">Account</h2>
              <AccountSettings
                onChangePassword={async () => {
                  // TODO: Wire up to API
                  await new Promise((resolve) => setTimeout(resolve, 800));
                }}
                onDeleteAccount={async () => {
                  // TODO: Wire up to API
                  await new Promise((resolve) => setTimeout(resolve, 1200));
                }}
              />
            </div>
          )}

          {activeTab === "pipeline" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-white">
                Pipeline Defaults
              </h2>
              <PipelineDefaults
                onSave={async (stages) => {
                  // TODO: Wire up to API
                  await new Promise((resolve) => setTimeout(resolve, 800));
                }}
              />
            </div>
          )}

          {activeTab === "api" && (
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-white">API</h2>
              <ApiTab />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
