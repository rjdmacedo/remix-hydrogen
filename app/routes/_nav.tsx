import React from "react";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import client from "~/api/index.server";
import { Layout } from "~/components/global";
import { AppHeaderAndFooterMenuDocument } from "~/gql/types";
import { FOOTER_MENU_HANDLE, HEADER_MENU_HANDLE } from "~/lib";

export async function loader() {
  const data = await client.request({
    document: AppHeaderAndFooterMenuDocument,
    variables: {
      footerMenuHandle: FOOTER_MENU_HANDLE,
      headerMenuHandle: HEADER_MENU_HANDLE,
    },
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
