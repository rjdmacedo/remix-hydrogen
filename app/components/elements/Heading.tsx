import clsx from "clsx";

import { missingClass, formatText } from "~/lib/utils";
import React from "react";

export function Heading({
  as: Component = "h2",
  size = "heading",
  width = "default",
  format,
  children,
  className = "",
  ...props
}: {
  as?: React.ElementType;
  children: React.ReactNode;
  format?: boolean;
  size?: "display" | "heading" | "lead" | "copy";
  width?: "default" | "narrow" | "wide";
} & React.HTMLAttributes<HTMLHeadingElement>) {
  const sizes = {
    display: "font-bold text-display",
    heading: "font-bold text-heading",
    lead: "font-bold text-lead",
    copy: "font-medium text-copy",
  };

  const widths = {
    default: "max-w-prose",
    narrow: "max-w-prose-narrow",
    wide: "max-w-prose-wide",
  };

  const styles = clsx(
    missingClass(className, "whitespace-") && "whitespace-pre-wrap",
    missingClass(className, "max-w-") && widths[width],
    missingClass(className, "font-") && sizes[size],
    className
  );

  return (
    <Component {...props} className={styles}>
      {format ? formatText(children) : children}
    </Component>
  );
}
