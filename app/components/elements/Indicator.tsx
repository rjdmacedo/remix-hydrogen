import { forwardRef } from "react";
import type { IComponentBaseProps } from "~/types/theme";
import type { Ref, ReactNode, HTMLAttributes } from "react";
import clsx from "clsx";

export const Indicator = forwardRef<HTMLDivElement, IndicatorProps>(
  (
    {
      item,
      children,
      vertical = "top",
      innerRef,
      dataTheme,
      className,
      horizontal = "end",
      ...props
    },
    ref
  ): JSX.Element => {
    const classes = clsx("indicator-item", className, {
      [`indicator-${horizontal}`]: horizontal,
      [`indicator-${vertical}`]: vertical,
    });

    return (
      <div data-theme={dataTheme} className="indicator" ref={ref}>
        <div
          aria-label="Indicator"
          {...props}
          ref={innerRef}
          className={classes}
        >
          {item}
        </div>
        {children}
      </div>
    );
  }
);

type IndicatorProps = HTMLAttributes<HTMLDivElement> &
  IComponentBaseProps & {
    item?: ReactNode;
    horizontal?: "start" | "center" | "end";
    vertical?: "top" | "middle" | "bottom";
    innerRef?: Ref<HTMLDivElement>;
  };

Indicator.displayName = "Indicator";
