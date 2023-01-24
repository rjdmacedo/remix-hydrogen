import clsx from "clsx";
import React from "react";
import type { Tailwind } from "~/types/tailwind";
import { Badge } from "./Badge";

/**
 * A shared component and Suspense call that's used in `App.server.jsx` to let your app wait for code to load while declaring a loading state
 */
export function Skeleton({
  as: Component = "div",
  width,
  height,
  children,
  className,
  type = "text",
  ...props
}: SkeletonProps) {
  const styles = clsx(
    "animate-pulse",
    width && `w-${width}`,
    height ? `h-${height}` : type === "circular" && `h${width}`,
    type === "circular" && "rounded-full",
    className
  );

  if (type === "badge") {
    return (
      <Badge color="ghost" className={styles}>
        {children}
      </Badge>
    );
  }

  return <Component {...props} className={styles} />;
}

interface SkeletonProps {
  as?: React.ElementType;
  width?: Tailwind["sizes"];
  height?: Tailwind["sizes"];
  type?: "text" | "circular" | "rectangle" | "badge";
  className?: string;
  [key: string]: any;
}
