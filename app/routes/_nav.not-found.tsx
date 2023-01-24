import React from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { flattenConnection } from "@shopify/storefront-kit-react";
import type { LoaderArgs, MetaFunction } from "@remix-run/node";

import client from "~/api/index.server";
import { PageHeader } from "~/components/global";
import { Text, Button } from "~/components/elements";
import { getCountryCode } from "~/utilities";
import { ProductSwimlane, FeaturedCollections } from "~/components/sections";
import { FeaturedCollectionsAndProductsDocument } from "~/gql/types";
import type { CollectionConnection, ProductConnection } from "~/gql/types";

export const meta: MetaFunction = () => ({
  title: "Couldn't find anything",
});

export async function loader({ request }: LoaderArgs) {
  const data = await client.request({
    document: FeaturedCollectionsAndProductsDocument,
    variables: {
      country: getCountryCode(request.url),
    },
  });

  return json(data);
}

export default function NotFoundPage({ type = "page" }: NotFoundProps) {
  const { featuredProducts, featuredCollections } = useLoaderData<typeof loader>();

  const heading = `We’ve lost this ${type}`;
  const description = `We couldn't find the ${type} you’re looking for. Try checking the URL or heading back to the home page.`;

  const products = flattenConnection(featuredProducts as ProductConnection);
  const collections = flattenConnection(featuredCollections as CollectionConnection);

  return (
    <>
      <PageHeader heading={heading}>
        <Text width="narrow" as="p">
          {description}
        </Text>
        <Button to="/" color="primary">
          Take me to the home page
        </Button>
      </PageHeader>

      {featuredCollections.nodes.length < 2 && <FeaturedCollections title="Popular Collections" data={collections} />}

      <ProductSwimlane products={products} />
    </>
  );
}

type NotFoundProps = {
  type?: string;
};
