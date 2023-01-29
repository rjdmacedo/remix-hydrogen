import type { ComponentSize, ComponentColor, IComponentBaseProps, ComponentStatus } from "~/types/theme";
import clsx from "clsx";
import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size,
      type,
      color,
      label,
      shadow,
      bordered = true,
      className,
      fullWidth,
      dataTheme,
      placeholder,
      defaultValue,
      borderOffset,
      ...props
    },
    ref
  ): JSX.Element => {
    const classes = clsx("input dark:border-neutral-content dark:shadow-none focus:outline-none", {
      [`${className}`]: !label,
      "w-full": fullWidth,
      "shadow-google": shadow,
      "input-bordered": bordered,
      [`input-${size}`]: size,
      [`input-${color}`]: color,
      [`focus:outline-offset-0`]: !borderOffset,
    });

    const input = (
      <input
        {...props}
        ref={ref}
        type={type}
        className={classes}
        data-theme={dataTheme}
        placeholder={placeholder}
        defaultValue={defaultValue}
      />
    );

    if (!label) {
      return input;
    }

    let _labels: Label[] = [];
    if (Array.isArray(label)) {
      _labels = label.map((l) => ({
        value: l.value,
        status: l.status,
        position: l.position,
      }));
    } else if (typeof label === "string") {
      _labels = [{ value: label, position: "top-left" }];
    } else {
      _labels = [
        {
          value: label.value,
          status: label.status,
          position: label.position,
        },
      ];
    }

    const topLeft = _labels.find((l) => l.position === "top-left");
    const topRight = _labels.find((l) => l.position === "top-right");
    const bottomLeft = _labels.find((l) => l.position === "bottom-left");
    const bottomRight = _labels.find((l) => l.position === "bottom-right");

    return (
      <div className={clsx("form-control", className, { "w-full": fullWidth })}>
        {topLeft || topRight ? (
          <label className="label" htmlFor={props?.id}>
            {topLeft && (
              <span
                className={clsx("label-text", {
                  [`text-${topLeft.status}`]: !!topLeft.status,
                })}
              >
                {topLeft.value}
              </span>
            )}
            {topRight && (
              <span
                className={clsx("label-text-alt", {
                  [`text-${topRight.status}`]: !!topRight.status,
                })}
              >
                {topRight.value}
              </span>
            )}
          </label>
        ) : null}
        {input}
        {bottomLeft || bottomRight ? (
          <label className="label" htmlFor={props?.id}>
            {bottomLeft && (
              <span
                className={clsx("label-text-alt", {
                  [`text-${bottomLeft.status}`]: !!bottomLeft.status,
                })}
              >
                {bottomLeft.value}
              </span>
            )}
            {bottomRight && (
              <span
                className={clsx("label-text-alt", {
                  [`text-${bottomRight.status}`]: !!bottomRight.status,
                })}
              >
                {bottomRight.value}
              </span>
            )}
          </label>
        ) : null}
      </div>
    );
  }
);

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color"> &
  IComponentBaseProps & {
    size?: ComponentSize;
    color?: ComponentColor;
    label?: string | Label | Label[];
    shadow?: boolean;
    bordered?: boolean;
    fullWidth?: boolean;
    borderOffset?: boolean;
  };

type Label = {
  value: string;
  status?: ComponentStatus;
  position: LabelPosition;
};

type LabelPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

Input.displayName = "Input";
