import clsx from "clsx";
import type { ReactNode } from "react";
import React, { forwardRef } from "react";

import type { ComponentStatus, IComponentBaseProps } from "~/types/theme";

type AlertProps = React.HTMLAttributes<HTMLDivElement> &
  IComponentBaseProps & {
    icon?: ReactNode;
    status?: ComponentStatus;
    innerClassName?: string;
  };

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ children, icon, status, dataTheme, className, innerClassName, ...props }, ref): JSX.Element => {
    const classes = clsx(
      "alert",
      className,
      clsx({
        [`alert-${status}`]: status,
      })
    );

    return (
      <div role="alert" {...props} ref={ref} data-theme={dataTheme} className={classes}>
        <div className={clsx("flex-1", innerClassName)}>
          {icon}
          {children}
        </div>
      </div>
    );
  }
);

Alert.displayName = "Alert";
