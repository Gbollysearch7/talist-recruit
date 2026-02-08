"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Avatar                                                             */
/* ------------------------------------------------------------------ */

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const sizeStyles: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--mono-border)] bg-white/10",
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
);
Avatar.displayName = "Avatar";

/* ------------------------------------------------------------------ */
/*  AvatarImage                                                        */
/* ------------------------------------------------------------------ */

export interface AvatarImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, alt, onError, ...props }, ref) => {
    const [hasError, setHasError] = React.useState(false);

    if (hasError) return null;

    return (
      <img
        ref={ref}
        alt={alt}
        className={cn("aspect-square h-full w-full object-cover", className)}
        onError={(e) => {
          setHasError(true);
          onError?.(e);
        }}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

/* ------------------------------------------------------------------ */
/*  AvatarFallback                                                     */
/* ------------------------------------------------------------------ */

export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLSpanElement> {}

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "absolute inset-0 flex items-center justify-center font-medium text-[var(--mono-muted)]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
