"use client";

import * as React from "react";
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────

interface PipelineStageDefault {
  id: string;
  name: string;
  color: string;
  position: number;
}

interface PipelineDefaultsProps {
  initialStages?: PipelineStageDefault[];
  onSave?: (stages: PipelineStageDefault[]) => Promise<void>;
  className?: string;
}

// ─── Preset colors ──────────────────────────────────────────────────────────

const PRESET_COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#eab308", // yellow
  "#f97316", // orange
  "#ef4444", // red
  "#a855f7", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#14b8a6", // teal
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#f43f5e", // rose
];

const DEFAULT_STAGES: PipelineStageDefault[] = [
  { id: "default-1", name: "New", color: "#3b82f6", position: 0 },
  { id: "default-2", name: "Screening", color: "#eab308", position: 1 },
  { id: "default-3", name: "Interview", color: "#a855f7", position: 2 },
  { id: "default-4", name: "Offer", color: "#22c55e", position: 3 },
  { id: "default-5", name: "Hired", color: "#14b8a6", position: 4 },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateId() {
  return `stage-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Color Picker Popover ───────────────────────────────────────────────────

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="h-7 w-7 border border-[var(--mono-border,#333333)] cursor-pointer hover:border-white/40 transition-colors duration-150"
        style={{ backgroundColor: value }}
        onClick={() => setOpen(!open)}
        aria-label="Pick color"
      />

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 grid grid-cols-6 gap-1 border border-[var(--mono-border,#333333)] bg-[var(--mono-bg,#121212)] p-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={cn(
                "h-6 w-6 cursor-pointer border transition-all duration-150",
                value === color
                  ? "border-white scale-110"
                  : "border-transparent hover:border-white/40"
              )}
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(color);
                setOpen(false);
              }}
              aria-label={`Select color ${color}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────

export function PipelineDefaults({
  initialStages,
  onSave,
  className,
}: PipelineDefaultsProps) {
  const [stages, setStages] = React.useState<PipelineStageDefault[]>(
    initialStages ?? DEFAULT_STAGES
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  // ── Reorder ────────────────────────────────────────────────────────────
  const moveStage = (index: number, direction: "up" | "down") => {
    const newStages = [...stages];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newStages.length) return;

    // Swap positions
    [newStages[index], newStages[targetIndex]] = [
      newStages[targetIndex],
      newStages[index],
    ];

    // Re-index positions
    const reIndexed = newStages.map((stage, i) => ({
      ...stage,
      position: i,
    }));

    setStages(reIndexed);
    setSaved(false);
  };

  // ── Add stage ──────────────────────────────────────────────────────────
  const addStage = () => {
    const nextColor = PRESET_COLORS[stages.length % PRESET_COLORS.length];
    setStages((prev) => [
      ...prev,
      {
        id: generateId(),
        name: "",
        color: nextColor,
        position: prev.length,
      },
    ]);
    setSaved(false);
  };

  // ── Remove stage ───────────────────────────────────────────────────────
  const removeStage = (id: string) => {
    setStages((prev) =>
      prev
        .filter((s) => s.id !== id)
        .map((s, i) => ({ ...s, position: i }))
    );
    setSaved(false);
  };

  // ── Update stage ───────────────────────────────────────────────────────
  const updateStage = (
    id: string,
    field: "name" | "color",
    value: string
  ) => {
    setStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
    setSaved(false);
  };

  // ── Save ───────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave(stages);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // Error handling
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <p className="text-sm text-[var(--mono-muted,rgba(255,255,255,0.6))]">
        Configure the default pipeline stages for new candidates. Drag to
        reorder, click the color swatch to change colors.
      </p>

      {/* Stage list */}
      <div className="flex flex-col gap-2">
        {stages.map((stage, index) => (
          <div
            key={stage.id}
            className="flex items-center gap-3 border border-[var(--mono-border,#333333)] bg-[var(--mono-bg,#121212)] px-3 py-2 group hover:border-white/20 transition-colors duration-150"
          >
            {/* Drag handle (visual indicator) */}
            <GripVertical className="h-4 w-4 shrink-0 text-[var(--mono-faint,rgba(255,255,255,0.4))] cursor-grab" />

            {/* Position badge */}
            <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-[var(--mono-border,#333333)] text-xs font-mono text-[var(--mono-muted,rgba(255,255,255,0.6))]">
              {index + 1}
            </span>

            {/* Color picker */}
            <ColorPicker
              value={stage.color}
              onChange={(color) => updateStage(stage.id, "color", color)}
            />

            {/* Stage name */}
            <input
              type="text"
              value={stage.name}
              onChange={(e) => updateStage(stage.id, "name", e.target.value)}
              placeholder="Stage name"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-[var(--mono-muted,rgba(255,255,255,0.6))] border-none outline-none focus:ring-0"
            />

            {/* Reorder buttons */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveStage(index, "up")}
                className="p-1 text-[var(--mono-muted,rgba(255,255,255,0.6))] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
                aria-label="Move up"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                disabled={index === stages.length - 1}
                onClick={() => moveStage(index, "down")}
                className="p-1 text-[var(--mono-muted,rgba(255,255,255,0.6))] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
                aria-label="Move down"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeStage(stage.id)}
              disabled={stages.length <= 1}
              className="p-1 text-[var(--mono-muted,rgba(255,255,255,0.6))] hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
              aria-label="Remove stage"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add stage */}
      <button
        type="button"
        onClick={addStage}
        className="flex items-center gap-2 self-start text-sm text-[var(--mono-muted,rgba(255,255,255,0.6))] hover:text-white transition-colors duration-150 cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        Add stage
      </button>

      {/* Save */}
      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          size="sm"
          loading={isSaving}
          disabled={isSaving || stages.some((s) => !s.name.trim())}
          onClick={handleSave}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" />
              Saved
            </>
          ) : (
            "Save Stages"
          )}
        </Button>
        {saved && (
          <span className="text-xs text-emerald-400">
            Pipeline defaults updated.
          </span>
        )}
        {stages.some((s) => !s.name.trim()) && (
          <span className="text-xs text-amber-400">
            All stages need a name.
          </span>
        )}
      </div>
    </div>
  );
}
