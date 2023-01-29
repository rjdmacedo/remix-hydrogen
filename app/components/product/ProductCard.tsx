import clsx from "clsx";
import { Link } from "~/components/global";
import { Image, Money, useMoney, flattenConnection } from "@shopify/storefront-kit-react";

import { Text, Badge } from "~/components/elements";
import { isDiscounted, isNewArrival, getProductPlaceholder } from "~/lib";
import type { MoneyV2, Product, ProductVariantConnection } from "~/gql/types";

export function ProductCard({ label, loading, product, onClick, className }: ProductCardProps) {
  let cardLabel;

  const cardData = product?.variants ? product : getProductPlaceholder();

  const {
    image,
    priceV2: price,
    compareAtPriceV2: compareAtPrice,
  } = flattenConnection(cardData?.variants as ProductVariantConnection)[0] || {};

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2)) {
    cardLabel = "Sale";
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = "New";
  }

  const styles = clsx("grid gap-3", className);

  return (
    <Link onClick={onClick} to={`/products/${product.handle}`}>
      <div className={styles}>
        <div className="card-image aspect-[4/5] bg-primary/5">
          {cardLabel && (
            <Badge size="lg" color="primary" className="absolute top-0 right-0 z-10 mr-2 mt-2">
              <Text as="label" size="fine" className="text-notice text-right">
                {cardLabel}
              </Text>
            </Badge>
          )}
          {image && (
            <Image
              widths={[320]}
              sizes="320px"
              className="fade-in aspect-[4/5] w-full object-cover"
              loaderOptions={{
                crop: "center",
                scale: 2,
                width: 320,
                height: 400,
              }}
              // @ts-ignore Stock type has `src` as optional
              data={image}
              alt={image.altText || `Picture of ${product.title}`}
              loading={loading}
            />
          )}
        </div>
        <div className="grid gap-1">
          <Text as="h3" className="w-full overflow-hidden text-ellipsis whitespace-nowrap ">
            {product.title}
          </Text>
          <div className="flex gap-4">
            <Text className="flex gap-4">
              <Money withoutTrailingZeros data={price!} />
              {isDiscounted(price as MoneyV2, compareAtPrice as MoneyV2) && (
                <CompareAtPrice className={"opacity-50"} data={compareAtPrice as MoneyV2} />
              )}
            </Text>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CompareAtPrice({ data, className }: CompareAtPriceProps) {
  const { currencyNarrowSymbol, withoutTrailingZerosAndCurrency } = useMoney(data);

  const styles = clsx("strike", className);

  return (
    <span className={styles}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}

type ProductCardProps = {
  label?: string;
  loading?: HTMLImageElement["loading"];
  product: Product;
  onClick?: () => void;
  className?: string;
};

type CompareAtPriceProps = {
  data: MoneyV2;
  className?: string;
};
