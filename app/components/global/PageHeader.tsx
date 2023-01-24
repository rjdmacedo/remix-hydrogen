import clsx from "clsx";

import React from "react";
import { Heading } from "~/components/elements";

export function PageHeader({
  heading,
  variant = "default",
  children,
  className,
  ...props
}: {
  heading?: string;
  variant?: "default" | "blogPost" | "allCollections";
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const variants: Record<string, string> = {
    default:
      "grid w-full gap-8 p-6 md:p-8 lg:px-12 lg:py-4 justify-items-start",
    blogPost:
      "grid md:text-center w-full gap-4 p-6 py-8 md:p-8 lg:px-12 lg:py-4 md:justify-items-center",
    allCollections:
      "flex justify-between items-baseline gap-8 p-6 md:p-8 lg:px-12 lg:py-4",
  };

  const styles = clsx(variants[variant], className);

  return (
    <header {...props} className={styles}>
      {heading && (
        <Heading as="h1" width="narrow" size="heading" className="inline-block">
          {heading}
        </Heading>
      )}
      {children}
    </header>
  );
}
