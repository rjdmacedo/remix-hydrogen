import { Link } from "@remix-run/react";

import { Grid } from "~/components/elements/Grid";
import { ProductCard } from "./ProductCard";
import type { Collection } from "~/gql/types";
import { getImageLoadingPriority } from "~/lib/const";

export function ProductGrid({ url, className, collection }: Props) {
  const {
    products: {
      nodes: products = [],
      pageInfo: { endCursor = "", hasNextPage = false },
    },
  } = collection;

  if (products.length <= 0) {
    return (
      <>
        <p>No products found on this collection.</p>
        <Link to="/products">
          <p className="underline">Browse catalog</p>
        </Link>
      </>
    );
  }

  return (
    <div className={className}>
      <Grid layout="products">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} loading={getImageLoadingPriority(i)} />
        ))}
      </Grid>
    </div>
  );
}

interface Props {
  url: string;
  className?: string;
  collection: Collection;
}
