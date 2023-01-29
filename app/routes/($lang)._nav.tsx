import React from "react";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { Layout } from "~/components/global";
import type { LanguageCode } from "~/gql/types";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { getShopWithHeaderAndFooter } from "~/api/shop.server";

export async function loader({ params }: LoaderArgs) {
  const data = await getShopWithHeaderAndFooter({
    language: params.lang?.toUpperCase() as LanguageCode,
  });

  return json(data);
}

export default function NavLayout() {
  const data = useLoaderData<typeof loader>();
  return (
    <Layout data={data}>
      <Outlet />
    </Layout>
  );
}
