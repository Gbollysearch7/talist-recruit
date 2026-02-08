"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

type ToastAction =
  | { type: "ADD"; toast: Toast }
  | { type: "REMOVE"; id: string };

/* ------------------------------------------------------------------ */
/*  State management                                                   */
/* ------------------------------------------------------------------ */

const TOAST_LIMIT = 5;
const TOAST_DEFAULT_DURATION = 4000;

let toastCount = 0;

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER;
  return toastCount.toString(36);
}

const listeners: Array<(toasts: Toast[]) => void> = [];
let memoryToasts: Toast[] = [];

function dispatch(action: ToastAction) {
  switch (action.type) {
    case "ADD":
      memoryToasts = [action.toast, ...memoryToasts].slice(0, TOAST_LIMIT);
      break;
    case "REMOVE":
      memoryToasts = memoryToasts.filter((t) => t.id !== action.id);
      break;
  }
  listeners.forEach((l) => l(memoryToasts));
}

/* ------------------------------------------------------------------ */
/*  useToast hook                                                      */
/* ------------------------------------------------------------------ */

function useToast() {
  const [toasts, setToasts] = React.useState<Toast[]>(memoryToasts);

  React.useEffect(() => {
    listeners.push(setToasts);
    return () => {
      const idx = listeners.indexOf(setToasts);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const toast = React.useCallback(
    (props: Omit<Toast, "id">) => {
      const id = genId();
      const newToast: Toast = { id, ...props };
      dispatch({ type: "ADD", toast: newToast });

      const duration = props.duration ?? TOAST_DEFAULT_DURATION;
      if (duration > 0) {
        setTimeout(() => {
          dispatch({ type: "REMOVE", id });
        }, duration);
      }

      return id;
    },
    []
  );

  const dismiss = React.useCallback((id: string) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  return { toasts, toast, dismiss };
}

/* ------------------------------------------------------------------ */
/*  Variant config                                                     */
/* ------------------------------------------------------------------ */

const variantConfig: Record<
  ToastVariant,
  { icon: React.ElementType; containerClass: string }
> = {
  default: {
    icon: Info,
    containerClass: "border-[var(--mono-border)]",
  },
  success: {
    icon: CheckCircle,
    containerClass: "border-emerald-500/30",
  },
  error: {
    icon: AlertCircle,
    containerClass: "border-red-500/30",
  },
  warning: {
    icon: AlertTriangle,
    containerClass: "border-amber-500/30",
  },
  info: {
    icon: Info,
    containerClass: "border-blue-500/30",
  },
};

const iconColorMap: Record<ToastVariant, string> = {
  default: "text-[var(--mono-muted)]",
  success: "text-emerald-400",
  error: "text-red-400",
  warning: "text-amber-400",
  info: "text-blue-400",
};

/* ------------------------------------------------------------------ */
/*  ToastItem                                                          */
/* ------------------------------------------------------------------ */

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const variant = toast.variant ?? "default";
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full items-start gap-3 rounded-lg border bg-[#1a1a1a] p-4 shadow-lg transition-all",
        "animate-in slide-in-from-top-2 fade-in-0 duration-200",
        config.containerClass
      )}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", iconColorMap[variant])} />
      <div className="flex-1 space-y-1">
        {toast.title && (
          <p className="text-sm font-medium text-white">{toast.title}</p>
        )}
        {toast.description && (
          <p className="text-sm text-[var(--mono-muted)]">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="shrink-0 rounded-sm p-0.5 text-[var(--mono-muted)] transition-colors hover:text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ToastProvider                                                       */
/* ------------------------------------------------------------------ */

export interface ToastProviderProps {
  children: React.ReactNode;
}

function ToastProvider({ children }: ToastProviderProps) {
  const { toasts, dismiss } = useToast();

  return (
    <>
      {children}
      <div
        className="pointer-events-none fixed right-0 top-0 z-[100] flex max-h-screen w-full flex-col gap-2 p-4 sm:max-w-[420px]"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </>
  );
}

ToastProvider.displayName = "ToastProvider";

export { ToastProvider, useToast };
