"use client";

import * as React from "react";
import { Lock, Trash2, AlertTriangle, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

interface AccountSettingsProps {
  onChangePassword?: (current: string, next: string) => Promise<void>;
  onDeleteAccount?: () => Promise<void>;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function AccountSettings({
  onChangePassword,
  onDeleteAccount,
  className,
}: AccountSettingsProps) {
  // Password state
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = React.useState(false);
  const [passwordSaved, setPasswordSaved] = React.useState(false);

  // Delete confirmation
  const [deleteConfirmText, setDeleteConfirmText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    if (!onChangePassword) return;

    setIsSavingPassword(true);
    try {
      await onChangePassword(currentPassword, newPassword);
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSaved(false), 2000);
    } catch {
      setPasswordError("Failed to change password. Please try again.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!onDeleteAccount) return;

    setIsDeleting(true);
    try {
      await onDeleteAccount();
    } catch {
      // Error handling
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* Change Password */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-white" />
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Change Password
          </h3>
        </div>

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setPasswordError(null);
            }}
            hint="Minimum 8 characters"
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setPasswordError(null);
            }}
            error={passwordError ?? undefined}
          />

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              size="sm"
              loading={isSavingPassword}
              disabled={
                isSavingPassword ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword
              }
            >
              {passwordSaved ? (
                <>
                  <Check className="h-4 w-4" />
                  Updated
                </>
              ) : (
                "Update Password"
              )}
            </Button>
            {passwordSaved && (
              <span className="text-xs text-emerald-400">
                Password changed successfully.
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="flex flex-col gap-4 border border-red-500/30 bg-red-500/5 p-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">
            Danger Zone
          </h3>
        </div>

        <p className="text-sm text-[var(--mono-muted,rgba(255,255,255,0.6))]">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger className="self-start">
            <Button variant="destructive" size="sm" type="button">
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                This will permanently delete your account, all candidates,
                searches, and pipeline data. This action cannot be reversed.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 my-4">
              <p className="text-sm text-white">
                Type{" "}
                <span className="font-mono font-bold text-red-400">
                  DELETE
                </span>{" "}
                to confirm:
              </p>
              <Input
                placeholder="Type DELETE to confirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
              />
            </div>

            <DialogFooter>
              <DialogClose>
                <Button variant="outline" size="sm" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                size="sm"
                disabled={deleteConfirmText !== "DELETE" || isDeleting}
                loading={isDeleting}
                onClick={handleDeleteAccount}
                type="button"
              >
                Permanently Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
