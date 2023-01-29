import clsx from "clsx";
import type { Navigation } from "@remix-run/router";
import type { ReactNode, ReactElement } from "react";
import { Fragment, cloneElement, isValidElement } from "react";

import type { CountryCode } from "~/gql/types";
import { useLocalization } from "~/hooks";

export const isNavigation = (navigation: Navigation) => ({
  loading: navigation.state === "loading" && navigation.formData == null,
  reloading:
    navigation.state === "loading" &&
    navigation.formData != null &&
    navigation.formAction === navigation.location.pathname,
  submitting: navigation.state === "submitting",
  redirecting:
    navigation.state === "loading" &&
    navigation.formData != null &&
    navigation.formAction !== navigation.location.pathname,
});

const isClassComponent = (component: unknown) =>
  typeof component === "function" && !!component.prototype.isReactComponent;

const isFunctionComponent = (component: unknown) =>
  typeof component === "function" && String(component).includes("return React.createElement");

export const isReactComponent = (component: unknown): component is ReactNode =>
  isClassComponent(component) || isFunctionComponent(component);

export const isHome = (pathname: string, countryCode?: CountryCode) =>
  pathname === `/${countryCode ? countryCode.toLowerCase() : ""}`;

export const getCountryCode = (request: Request) => {
  if (!request.url) return;

  const pathname = new URL(request.url).pathname;
  const localeMatch = /^\/([a-z]{2})(\/|$)/i.exec(pathname);
  return localeMatch ? (localeMatch[1].toUpperCase() as CountryCode) : undefined;
};

const getData = (value?: string) => {
  if (value === "true" || value === "false") {
    return JSON.parse(value);
  }
  if (value === "undefined" || !value) {
    return "";
  }
  return value;
};

// Returns true if an element is a react fragment
export const isReactFragment = (node: ReactNode) => {
  if (!node) return false;

  if ((node as ReactElement)?.type) {
    return (node as ReactElement)?.type === Fragment;
  }

  // @ts-ignore
  return node === Fragment;
};

// If an invalid element or fragment is passed in as the node, wrap it with the wrapper and add props
// If a valid element is passed, add the props
export const wrapWithElementIfInvalid = ({
  node,
  wrapper,
  props = {},
}: {
  node: ReactNode;
  wrapper: ReactElement;
  props?: any;
}) => {
  if (!node) {
    return cloneElement(wrapper, props);
  } else if (!isValidElement(node)) {
    return cloneElement(wrapper, props, node);
  } else if (isReactFragment(node)) {
    return cloneElement(
      wrapper,
      { ...props, className: clsx(node.props?.className, props?.className) },
      node.props.children
    );
  } else {
    return cloneElement(node, {
      ...props,
      className: clsx(node.props?.className, props?.className),
    });
  }
};

export const classNames = (...classes: string[]) => classes.filter(Boolean).join(" ");
