import clsx from "clsx";
import type { LabelHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

import type { IComponentBaseProps } from "~/types/theme";
import { wrapWithElementIfInvalid } from "~/utilities";

export const Swap = forwardRef<HTMLLabelElement, SwapProps>(
  (
    {
      flip,
      active,
      rotate,
      onElement,
      offElement,
      dataTheme,
      className,
      ...props
    },
    ref
  ): JSX.Element => {
    const classes = clsx("swap", className, {
      "swap-active": active,
      "swap-rotate": rotate,
      "swap-flip": flip,
    });

    // These next two pieces allow classname to be added to valid elements, or wrap invalid elements with a div and the classname
    const onEl = wrapWithElementIfInvalid({
      node: onElement,
      wrapper: <div></div>,
      props: { className: "swap-on" },
    });

    const offEl = wrapWithElementIfInvalid({
      node: offElement,
      wrapper: <div></div>,
      props: { className: "swap-off" },
    });

    return (
      <label {...props} data-theme={dataTheme} className={classes} ref={ref}>
        <input type="checkbox" />
        {onEl}
        {offEl}
      </label>
    );
  }
);

export type SwapProps = LabelHTMLAttributes<HTMLLabelElement> &
  IComponentBaseProps & {
    onElement: ReactNode | ReactNode[];
    offElement: ReactNode | ReactNode[];
    active?: boolean;
    rotate?: boolean;
    flip?: boolean;
  };

Swap.displayName = "Swap";
