"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface DialogContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error("Dialog compound components must be used within <Dialog>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Dialog (root)                                                      */
/* ------------------------------------------------------------------ */

export interface DialogProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Dialog({ children, defaultOpen = false, open: controlledOpen, onOpenChange }: DialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const dialogRef = React.useRef<HTMLDialogElement | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (value: React.SetStateAction<boolean>) => {
      const next = typeof value === "function" ? value(open) : value;
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [open, isControlled, onOpenChange]
  );

  React.useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  return (
    <DialogContext.Provider value={{ open, setOpen, dialogRef }}>
      {children}
    </DialogContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  DialogTrigger                                                      */
/* ------------------------------------------------------------------ */

export interface DialogTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ onClick, children, ...props }, ref) => {
    const { setOpen } = useDialogContext();

    return (
      <button
        ref={ref}
        type="button"
        onClick={(e) => {
          setOpen(true);
          onClick?.(e);
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DialogTrigger.displayName = "DialogTrigger";

/* ------------------------------------------------------------------ */
/*  DialogContent                                                      */
/* ------------------------------------------------------------------ */

export interface DialogContentProps
  extends React.HTMLAttributes<HTMLDialogElement> {}

const DialogContent = React.forwardRef<HTMLDialogElement, DialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const { setOpen, dialogRef } = useDialogContext();

    const mergedRef = React.useCallback(
      (node: HTMLDialogElement | null) => {
        (dialogRef as React.MutableRefObject<HTMLDialogElement | null>).current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDialogElement | null>).current = node;
      },
      [ref, dialogRef]
    );

    const handleCancel = React.useCallback(
      (e: React.SyntheticEvent<HTMLDialogElement>) => {
        e.preventDefault();
        setOpen(false);
      },
      [setOpen]
    );

    const handleBackdropClick = React.useCallback(
      (e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === e.currentTarget) {
          setOpen(false);
        }
      },
      [setOpen]
    );

    return (
      <dialog
        ref={mergedRef}
        className={cn(
          "m-auto max-h-[85vh] w-full max-w-lg rounded-lg border border-[var(--mono-border)] bg-[#1a1a1a] p-0 text-white shadow-xl",
          "backdrop:bg-black/60 backdrop:backdrop-blur-sm",
          "open:animate-in open:fade-in-0 open:zoom-in-95",
          className
        )}
        onCancel={handleCancel}
        onClick={handleBackdropClick}
        {...props}
      >
        <div className="relative p-6" onClick={(e) => e.stopPropagation()}>
          {children}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 rounded-sm p-1 text-[var(--mono-muted)] transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </dialog>
    );
  }
);
DialogContent.displayName = "DialogContent";

/* ------------------------------------------------------------------ */
/*  DialogHeader                                                       */
/* ------------------------------------------------------------------ */

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 pb-4", className)}
      {...props}
    />
  );
}
DialogHeader.displayName = "DialogHeader";

/* ------------------------------------------------------------------ */
/*  DialogTitle                                                        */
/* ------------------------------------------------------------------ */

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

/* ------------------------------------------------------------------ */
/*  DialogDescription                                                  */
/* ------------------------------------------------------------------ */

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[var(--mono-muted)]", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

/* ------------------------------------------------------------------ */
/*  DialogFooter                                                       */
/* ------------------------------------------------------------------ */

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}
DialogFooter.displayName = "DialogFooter";

/* ------------------------------------------------------------------ */
/*  DialogClose                                                        */
/* ------------------------------------------------------------------ */

const DialogClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, children, ...props }, ref) => {
  const { setOpen } = useDialogContext();

  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        setOpen(false);
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </button>
  );
});
DialogClose.displayName = "DialogClose";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
};
