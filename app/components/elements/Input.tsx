import type { ComponentSize, ComponentColor, IComponentBaseProps } from "~/types/theme";
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
    const classes = clsx("input dark:border-neutral-content dark:shadow-none focus:outline-none", className, {
      [`input-${size}`]: size,
      [`input-${color}`]: color,
      [`focus:outline-offset-0`]: !borderOffset,
      "w-full": fullWidth,
      "shadow-google": shadow,
      "input-bordered": bordered,
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

    const _label =
      typeof label === "string"
        ? { value: label, position: "top-left" }
        : {
            value: label.value,
            position: label.position || "top-left",
          };

    return (
      <div className={clsx("form-control", { "w-full": fullWidth })}>
        {_label.position?.includes("top") && (
          <label className="label" htmlFor={props?.id}>
            <span className="label-text">{_label.position.includes("left") && _label.value}</span>
            <span className="label-text-alt">{_label.position.includes("right") && _label.value}</span>
          </label>
        )}
        {input}
        {_label.position?.includes("bottom") && (
          <label className="label" htmlFor={props?.id}>
            <span className="label-text-alt">{_label.position.includes("left") && _label.value}</span>
            <span className="label-text-alt">{_label.position.includes("right") && _label.value}</span>
          </label>
        )}
      </div>
    );
  }
);

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color"> &
  IComponentBaseProps & {
    size?: ComponentSize;
    color?: ComponentColor;
    label?:
      | string
      | {
          value: string;
          position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
        };
    shadow?: boolean;
    bordered?: boolean;
    fullWidth?: boolean;
    borderOffset?: boolean;
  };

Input.displayName = "Input";
