import type { ComponentSize, ComponentColor, ComponentShape, IComponentBaseProps } from "~/types/theme";
import clsx from "clsx";
import type { ReactNode } from "react";
import React, { forwardRef } from "react";
import type { LinkProps } from "@remix-run/react";
import { Link } from "@remix-run/react";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      to,
      size,
      wide,
      shape,
      style,
      color,
      active,
      variant,
      endIcon,
      loading,
      children,
      disabled,
      dataTheme,
      className,
      startIcon,
      fullWidth,
      animation = true,
      responsive,
      ...props
    },
    ref
  ): JSX.Element => {
    const classes = clsx(((startIcon && !loading) || endIcon) && "gap-2", "btn", className, {
      [`btn-${size}`]: size,
      [`btn-${color}`]: color,
      [`btn-${shape}`]: shape,
      [`btn-${variant}`]: variant,
      "btn-wide": wide,
      "btn-block": fullWidth,
      "btn-active": active,
      "no-animation": !animation,
      "btn-disabled": disabled,
      "btn-xs md:btn-sm lg:btn-md xl:btn-lg": responsive,
      "shadow-google dark:border dark:border-neutral-content dark:shadow-none dark:shadow-2xl":
        variant !== "link" && color !== "ghost",
      loading,
    });

    if (to) {
      return (
        <Link className={classes} style={style} to={to}>
          {startIcon && startIcon}
          {children}
          {endIcon && endIcon}
        </Link>
      );
    } else {
      return (
        <button {...props} ref={ref} style={style} disabled={disabled} className={classes} data-theme={dataTheme}>
          {startIcon && !loading && startIcon}
          {children}
          {endIcon && endIcon}
        </button>
      );
    }
  }
);

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> &
  IComponentBaseProps & {
    to?: LinkProps["to"];
    size?: ComponentSize;
    wide?: boolean;
    shape?: ComponentShape;
    color?: ComponentColor;
    active?: boolean;
    variant?: "outline" | "link";
    loading?: boolean;
    endIcon?: ReactNode;
    fullWidth?: boolean;
    animation?: boolean;
    startIcon?: ReactNode;
    responsive?: boolean;
  };

Button.displayName = "Button";
