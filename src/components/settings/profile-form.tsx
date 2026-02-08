"use client";

import * as React from "react";
import { User, Upload, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ProfileFormData {
  fullName: string;
  email: string;
  company: string;
  role: string;
}

interface ProfileFormProps {
  initialData?: Partial<ProfileFormData>;
  onSave?: (data: ProfileFormData) => Promise<void>;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function ProfileForm({
  initialData,
  onSave,
  className,
}: ProfileFormProps) {
  const [formData, setFormData] = React.useState<ProfileFormData>({
    fullName: initialData?.fullName ?? "",
    email: initialData?.email ?? "",
    company: initialData?.company ?? "",
    role: initialData?.role ?? "",
  });
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Error handling would go here
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)}>
      {/* Avatar placeholder */}
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center border-2 border-dashed border-[var(--mono-border,#333333)] bg-white/5">
          <User className="h-6 w-6 text-[var(--mono-muted,rgba(255,255,255,0.6))]" />
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-white hover:text-white/80 transition-colors duration-150 cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload avatar
          </button>
          <span className="text-xs text-[var(--mono-muted,rgba(255,255,255,0.6))]">
            JPG, PNG, or GIF. Max 2MB.
          </span>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Full Name"
          placeholder="Your full name"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          value={formData.email}
          disabled
          hint="Email cannot be changed"
        />
        <Input
          label="Company"
          placeholder="Your company"
          value={formData.company}
          onChange={(e) => handleChange("company", e.target.value)}
        />
        <Input
          label="Role"
          placeholder="e.g. Recruiter, Hiring Manager"
          value={formData.role}
          onChange={(e) => handleChange("role", e.target.value)}
        />
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" loading={isSaving} disabled={isSaving}>
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
        {saved && (
          <span className="text-xs text-emerald-400">
            Profile updated successfully.
          </span>
        )}
      </div>
    </form>
  );
}
