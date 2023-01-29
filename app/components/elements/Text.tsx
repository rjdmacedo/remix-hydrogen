import clsx from "clsx";
import React from "react";
import { missingClass, formatText } from "~/lib/utils";
import type { ComponentSize, ComponentStatus } from "~/types/theme";

export function Text({
  as: Component = "span",
  size = "copy",
  color = "default",
  width = "default",
  format,
  children,
  className,
  ...props
}: TextProps) {
  const colors: Record<string, string> = {
    default: "inherit",
    primary: "text-primary/90",
    subtle: "text-primary/50",
    notice: "text-notice",
    contrast: "text-contrast/90",
    info: "text-info",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  };

  const sizes: Record<string, string> = {
    lead: "text-lead font-medium",
    copy: "text-copy",
    fine: "text-fine subpixel-antialiased",
    xs: "text-xs",
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
  };

  const widths: Record<string, string> = {
    wide: "max-w-prose-wide",
    narrow: "max-w-prose-narrow",
    default: "max-w-prose",
  };

  const styles = clsx(
    missingClass(className, "max-w-") && widths[width],
    missingClass(className, "whitespace-") && "whitespace-pre-wrap",
    missingClass(className, "text-") && colors[color],
    sizes[size],
    className
  );

  return (
    <Component {...props} className={styles}>
      {format ? formatText(children) : children}
    </Component>
  );
}

type TextProps = {
  as?: React.ElementType;
  size?: "lead" | "copy" | "fine" | ComponentSize;
  color?: "default" | "primary" | "subtle" | "notice" | "contrast" | ComponentStatus;
  width?: "default" | "narrow" | "wide";
  format?: boolean;
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
};
