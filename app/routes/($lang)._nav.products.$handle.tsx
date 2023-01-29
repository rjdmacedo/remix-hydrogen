import React, { Suspense } from "react";
import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { flattenConnection, ProductProvider } from "@shopify/storefront-kit-react";

import client from "~/api/index.server";
import { getExcerpt } from "~/lib";
import { getCountryCode } from "~/utilities";
import { ProductSwimlane } from "~/components/sections";
import { Text, Heading, Section } from "~/components/elements";
import { ProductDetail, ProductForm, ProductGallery } from "~/components/product";
import type { Product, MediaImage, ProductConnection } from "~/gql/types";
import { ProductIdDocument, ProductWithRecommendationsDocument } from "~/gql/types";
import { getProductId, getProductWithRecommendations } from "~/api/products.server";

export async function loader({ params, request }: LoaderArgs) {
  invariant(params.handle, "product handle not found");

  const { product } = await getProductId({
    handle: params.handle,
    country: getCountryCode(request),
  });

  invariant(product, "Product not found");

  const data = await getProductWithRecommendations({
    id: product.id,
    count: 12,
    country: getCountryCode(request),
  });

  return json(data);
}
export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { shop, product, additional, recommended } = useLoaderData<typeof loader>();

  if (!product) {
    navigate("/not-found");
  }

  const { shippingPolicy, refundPolicy } = shop;
  const { media, title, vendor, description } = product || ({} as Product);

  const additionalProducts = flattenConnection(additional as ProductConnection);
  const recommendedProducts = recommended as Product[];

  const uniqueProducts = [...additionalProducts, ...recommendedProducts].filter(
    (product, index, array) => array.findIndex((p) => p.id === product.id) === index
  );

  return (
    <ProductProvider data={{ ...product }}>
      <Section className="px-0">
        <div className="grid items-start md:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-20">
          <ProductGallery media={media.nodes as MediaImage[]} className="w-screen md:w-full lg:col-span-2" />

          <div className="hidden-scroll sticky md:top-nav md:-mb-nav md:h-screen md:-translate-y-nav md:overflow-y-scroll md:pt-nav">
            <section className="flex w-full flex-col gap-8 p-6 md:mx-auto md:max-w-sm md:p-0 md:px-0">
              <div className="grid gap-2">
                <Heading as="h1" format className="prose truncate whitespace-normal">
                  {title}
                </Heading>
                {vendor && <Text className={"font-medium opacity-50"}>{vendor}</Text>}
              </div>
              <ProductForm />
              <div className="grid gap-4 py-4">
                {description && <ProductDetail defaultOpen title="Product Details" content={description} />}
                {shippingPolicy?.body && (
                  <ProductDetail
                    title="Shipping"
                    content={getExcerpt(shippingPolicy.body)}
                    learnMore={`/policies/${shippingPolicy.handle}`}
                  />
                )}
                {refundPolicy?.body && (
                  <ProductDetail
                    title="Returns"
                    content={getExcerpt(refundPolicy.body)}
                    learnMore={`/policies/${refundPolicy.handle}`}
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </Section>

      <Suspense>
        <ProductSwimlane title="Related Products" products={uniqueProducts} />
      </Suspense>
    </ProductProvider>
  );
}
