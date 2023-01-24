import type { ComponentSize, ComponentColor, IComponentBaseProps } from "~/types/theme";
import clsx from "clsx";
import React, { forwardRef } from "react";

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ children, variant, size, color, responsive, dataTheme, className, ...props }, ref) => {
    const classes = clsx("badge", className, {
      [`badge-${size}`]: size,
      [`badge-${variant}`]: variant,
      [`badge-${color}`]: color,
      "badge-xs md:badge-sm lg:badge-md xl:badge-lg": responsive,
    });

    return (
      <div aria-label="Badge" {...props} data-theme={dataTheme} className={classes} ref={ref}>
        {children}
      </div>
    );
  }
);

export type BadgeProps = Omit<React.HTMLAttributes<HTMLDivElement>, "color"> &
  IComponentBaseProps & {
    variant?: "outline";
    size?: ComponentSize;
    color?: ComponentColor;
    responsive?: boolean;
  };

Badge.displayName = "Badge";
