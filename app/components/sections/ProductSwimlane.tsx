import React from "react";

import type { Product } from "~/gql/types";

import { Section } from "~/components/elements";
import { ProductCard } from "~/components/product/ProductCard";

const mockProducts = new Array(12).fill("");

export function ProductSwimlane({
  products = mockProducts,
  title = "Featured Products",
  count = 12,
  ...props
}: ProductSwimlaneProps) {
  return (
    <Section heading={title} padding="y" {...props}>
      <div className="swimlane hidden-scroll md:scroll-px-8 md:px-8 md:pb-8 lg:scroll-px-12 lg:px-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} className={"w-80 snap-start"} />
        ))}
      </div>
    </Section>
  );
}

type ProductSwimlaneProps = {
  products?: Product[];
  title?: string;
  count?: number;
  [key: string]: any;
};
