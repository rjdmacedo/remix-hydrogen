import clsx from "clsx";
import React from "react";

export function Grid({
  as: Component = "div",
  gap = "default",
  flow = "row",
  items = 4,
  layout = "default",
  className,
  ...props
}: Props) {
  const layouts = {
    default: `grid-cols-1
    ${items === 2 ? "md:grid-cols-2" : ""}
    ${items === 3 ? "sm:grid-cols-3" : ""}
    ${items > 3 ? "md:grid-cols-3" : ""}
    ${items >= 4 ? "lg:grid-cols-4" : ""}`,
    products: `grid-cols-2
    ${items >= 3 ? "md:grid-cols-3" : ""}
    ${items >= 4 ? "lg:grid-cols-4" : ""}`,
    auto: "auto-cols-auto",
    blog: `grid-cols-2 pt-24`,
  };

  const gaps = {
    blog: "grid gap-6",
    default: "grid gap-2 gap-y-6 md:gap-4 lg:gap-6",
  };

  const flows = {
    row: "grid-flow-row",
    col: "grid-flow-col",
  };

  const styles = clsx(flows[flow], gaps[gap], layouts[layout], className);

  return <Component {...props} className={styles} />;
}

type Props = {
  as?: React.ElementType;
  gap?: "default" | "blog";
  flow?: "row" | "col";
  items?: number;
  layout?: "default" | "products" | "auto" | "blog";
  className?: string;
  [key: string]: any;
};
