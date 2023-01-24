import type { ComponentSize, IComponentBaseProps, ComponentBrandColors } from "~/types/theme";
import clsx from "clsx";
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Text } from "~/components/elements/Text";
import { isReactComponent } from "~/utilities";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      size = "md",
      color = "primary",
      label,
      checked,
      dataTheme,
      className,
      indeterminate = false,
      labelPosition = "right",
      defaultChecked,
      ...props
    },
    ref
  ): JSX.Element => {
    if (checked === undefined) {
      defaultChecked = false;
    }

    const classes = clsx("checkbox", className, {
      [`checkbox-${size}`]: size,
      [`checkbox-${color}`]: color,
    });

    const checkboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (!checkboxRef.current) {
        return;
      }

      checkboxRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    useImperativeHandle(ref, () => checkboxRef.current as HTMLInputElement);

    const Component = () => (
      <input
        {...props}
        ref={checkboxRef}
        type="checkbox"
        checked={checked}
        className={classes}
        data-theme={dataTheme}
        defaultChecked={defaultChecked}
      />
    );

    if (!label) {
      return <Component />;
    }

    return (
      <div className="form-control">
        <label className="label cursor-pointer" htmlFor={props?.id}>
          {labelPosition === "left" &&
            (isReactComponent(label) ? <label /> : <Text className="label-text mr-2">{label}</Text>)}
          <Component />
          {labelPosition === "right" &&
            (isReactComponent(label) ? <label /> : <Text className="label-text ml-2">{label}</Text>)}
        </label>
      </div>
    );
  }
);

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  IComponentBaseProps & {
    label?: string | React.ReactNode;
    size?: ComponentSize;
    color?: ComponentBrandColors;
    indeterminate?: boolean;
    labelPosition?: "left" | "right";
  };

Checkbox.displayName = "Checkbox";
