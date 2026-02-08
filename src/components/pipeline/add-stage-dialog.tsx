"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── Preset Colors ──────────────────────────────────────────────────────────

const PRESET_COLORS = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Green", value: "#22C55E" },
  { name: "Yellow", value: "#EAB308" },
  { name: "Orange", value: "#F97316" },
  { name: "Red", value: "#EF4444" },
  { name: "Purple", value: "#A855F7" },
  { name: "Pink", value: "#EC4899" },
  { name: "Cyan", value: "#06B6D4" },
  { name: "Emerald", value: "#10B981" },
  { name: "Indigo", value: "#6366F1" },
];

// ─── Types ──────────────────────────────────────────────────────────────────

interface AddStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name: string; color: string; position: number }) => void;
  nextPosition: number;
  isSaving?: boolean;
}

// ─── Component ──────────────────────────────────────────────────────────────

export function AddStageDialog({
  open,
  onOpenChange,
  onSave,
  nextPosition,
  isSaving = false,
}: AddStageDialogProps) {
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState(PRESET_COLORS[0].value);
  const [error, setError] = React.useState("");

  function handleSave() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Stage name is required");
      return;
    }
    onSave({ name: trimmed, color, position: nextPosition });
    setName("");
    setColor(PRESET_COLORS[0].value);
    setError("");
  }

  function handleOpenChange(value: boolean) {
    if (!value) {
      setName("");
      setColor(PRESET_COLORS[0].value);
      setError("");
    }
    onOpenChange(value);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Pipeline Stage</DialogTitle>
          <DialogDescription>
            Create a new stage in your recruitment pipeline.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <Input
            label="Stage Name"
            placeholder="e.g. Technical Interview"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            error={error}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/80">Color</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  className={cn(
                    "h-8 w-8 transition-all cursor-pointer border-2",
                    color === preset.value
                      ? "border-white scale-110"
                      : "border-transparent hover:border-white/30"
                  )}
                  style={{ backgroundColor: preset.value }}
                  onClick={() => setColor(preset.value)}
                  title={preset.name}
                  aria-label={`Select ${preset.name}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="h-5 w-5 border border-[#333]"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-[rgba(255,255,255,0.6)] font-mono">
                {color}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave} loading={isSaving}>
            Add Stage
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
