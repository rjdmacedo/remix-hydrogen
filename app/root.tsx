import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { CartProvider } from "@shopify/storefront-kit-react";
import { LoaderArgs } from "@remix-run/server-runtime";
import { getCountryCode } from "~/utilities";
import { json } from "@remix-run/node";
import React from "react";
import { LocalizationProvider } from "~/provider/localization-provider";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: tailwindStylesheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Store",
  viewport: "width=device-width,initial-scale=1",
});

export const loader = async ({ request }: LoaderArgs) => {
  const countryCode = getCountryCode(request);

  return json({
    countryCode,
  });
};

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <LocalizationProvider country={data.countryCode}>
          <CartProvider countryCode={data.countryCode}>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </CartProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
