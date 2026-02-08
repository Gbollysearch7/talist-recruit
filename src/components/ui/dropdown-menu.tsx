"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const ctx = React.useContext(DropdownMenuContext);
  if (!ctx) throw new Error("DropdownMenu compound components must be used within <DropdownMenu>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  DropdownMenu (root)                                                */
/* ------------------------------------------------------------------ */

export interface DropdownMenuProps {
  children: React.ReactNode;
}

function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  );
}
DropdownMenu.displayName = "DropdownMenu";

/* ------------------------------------------------------------------ */
/*  DropdownMenuTrigger                                                */
/* ------------------------------------------------------------------ */

export interface DropdownMenuTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ onClick, children, ...props }, ref) => {
    const { setOpen, triggerRef } = useDropdownMenuContext();

    const mergedRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref, triggerRef]
    );

    return (
      <button
        ref={mergedRef}
        type="button"
        onClick={(e) => {
          setOpen((prev) => !prev);
          onClick?.(e);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

/* ------------------------------------------------------------------ */
/*  DropdownMenuContent                                                */
/* ------------------------------------------------------------------ */

export interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, align = "start", children, ...props }, ref) => {
    const { open } = useDropdownMenuContext();

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border border-[var(--mono-border)] bg-[#1a1a1a] p-1 text-white shadow-lg",
          align === "start" && "left-0",
          align === "center" && "left-1/2 -translate-x-1/2",
          align === "end" && "right-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

/* ------------------------------------------------------------------ */
/*  DropdownMenuItem                                                   */
/* ------------------------------------------------------------------ */

export interface DropdownMenuItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
}

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ className, destructive = false, onClick, children, ...props }, ref) => {
    const { setOpen } = useDropdownMenuContext();

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex w-full items-center rounded-sm px-2 py-1.5 text-sm transition-colors",
          "focus:outline-none focus:bg-white/5",
          "hover:bg-white/5",
          "disabled:pointer-events-none disabled:opacity-50",
          destructive && "text-red-400 hover:bg-red-500/10 focus:bg-red-500/10",
          className
        )}
        onClick={(e) => {
          onClick?.(e);
          setOpen(false);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

/* ------------------------------------------------------------------ */
/*  DropdownMenuSeparator                                              */
/* ------------------------------------------------------------------ */

function DropdownMenuSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-[var(--mono-border)]", className)}
      {...props}
    />
  );
}
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

/* ------------------------------------------------------------------ */
/*  DropdownMenuLabel                                                  */
/* ------------------------------------------------------------------ */

function DropdownMenuLabel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-2 py-1.5 text-xs font-semibold text-[var(--mono-muted)]", className)}
      {...props}
    />
  );
}
DropdownMenuLabel.displayName = "DropdownMenuLabel";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
};
