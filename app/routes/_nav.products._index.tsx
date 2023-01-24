import React from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { LoaderArgs } from "@remix-run/node";

import client from "~/api/index.server";
import { PageHeader } from "~/components/global/PageHeader";
import { ProductGrid } from "~/components/product/ProductGrid";
import { getCountryCode } from "~/utilities";
import type { Collection } from "~/gql/types";
import { AllProductsDocument } from "~/gql/types";
import { FILTERABLE_COLLECTION_NAME, PAGINATION_SIZE } from "~/lib/const";

export async function loader({ request }: LoaderArgs) {
  const data = await client.request({
    document: AllProductsDocument,
    variables: {
      pageBy: PAGINATION_SIZE,
      filters: [],
      country: getCountryCode(request.url),
      collectionName: FILTERABLE_COLLECTION_NAME,
    },
  });

  return json(data);
}
export default function ProductIndexPage() {
  const { collection } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeader heading="All Products" variant="allCollections" />
      <ProductGrid
        key="products"
        url={`/products`}
        collection={collection as Collection}
        className="mt-6 lg:col-span-3 lg:mt-0 xl:col-span-4"
      />
    </>
  );
}
