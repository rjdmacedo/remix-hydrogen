import type { LinkProps } from "@remix-run/react";
import { Link as RemixLink } from "@remix-run/react";

import { useLocalization } from "~/hooks";

export const Link = (props: LinkProps) => {
  const { state } = useLocalization();

  const basePath = state?.country?.toLowerCase() || "";

  return <RemixLink {...props} to={addBasePathToLink(basePath, props.to)} />;
};

function addBasePathToLink(basePath: string, to: LinkProps["to"]): LinkProps["to"] {
  if (!basePath) return to;

  if (typeof to === "object" && "pathname" in to) {
    return {
      ...to,
      pathname: ["", basePath, to.pathname].join("/").replace(/\/{2,}/g, "/"),
    };
  }
  return ["/", basePath, to].join("/").replace(/\/{2,}/g, "/");
}
