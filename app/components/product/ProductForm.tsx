import type { OptionWithValues } from "@shopify/storefront-kit-react/dist/types/ProductProvider";

import { Form } from "@remix-run/react";
import { useLocation } from "react-router-dom";
import { useEffectOnce } from "react-use";
import { useEffect, useCallback, useState } from "react";
import { AddToCartButton, Money, useProduct } from "@shopify/storefront-kit-react";

import { ProductOptions } from "~/components/product";
import { Heading, Text, Skeleton } from "~/components/elements";

export function ProductForm() {
  const { pathname, search } = useLocation();

  const [loaded, setLoaded] = useState(false);
  const [params, setParams] = useState(new URLSearchParams(search));

  const { options, setSelectedOption, selectedOptions } = useProduct();

  useEffect(() => {
    if (params || !search) return;
    setParams(new URLSearchParams(search));
  }, [params, search]);

  useEffectOnce(() => {
    setTimeout(() => {
      (options as OptionWithValues[]).forEach(({ name, values }) => {
        if (!params) return;
        const currentValue = params.get(name.toLowerCase()) || null;
        if (currentValue) {
          const matchedValue = values.filter((value) => encodeURIComponent(value.toLowerCase()) === currentValue);
          setSelectedOption(name, matchedValue[0]);
        } else {
          params.set(encodeURIComponent(name.toLowerCase()), encodeURIComponent(selectedOptions![name]!.toLowerCase()));
          window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
        }
      });
      setLoaded(true);
    }, 0);
  });

  const handleChange = useCallback(
    (name: string, value: string) => {
      try {
        setLoaded(false);
        setSelectedOption(name, value);
        if (!params) return;
        params.set(encodeURIComponent(name.toLowerCase()), encodeURIComponent(value.toLowerCase()));
        window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
      } finally {
        setLoaded(true);
      }
    },
    [setSelectedOption, params, pathname]
  );

  const productHasOptionWithMultipleValues = (options: OptionWithValues[] = []) =>
    options.some((option) => option.values.length > 1);

  return (
    <Form className="grid gap-10" method="post">
      {productHasOptionWithMultipleValues(options as OptionWithValues[]) && (
        <div className="grid gap-2">
          {(options as OptionWithValues[]).map(({ name, values }) => (
            <div key={name} className="mb-4 flex flex-col flex-wrap gap-y-2 last:mb-0">
              <Heading as="legend" size="lead" className="min-w-[4rem]">
                {name}
              </Heading>
              <div className="flex flex-wrap items-baseline gap-4">
                <ProductOptions name={name} loaded={loaded} values={values} handleChange={handleChange} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid items-stretch gap-4">{loaded ? <AddToCartBtn /> : <Skeleton className="btn" />}</div>
    </Form>
  );
}

function AddToCartBtn() {
  const { selectedVariant } = useProduct();

  const isOutOfStock = !selectedVariant?.availableForSale || false;
  const isOnSale =
    (selectedVariant?.priceV2?.amount || "") < (selectedVariant?.compareAtPriceV2?.amount || "") || false;

  return (
    <AddToCartButton
      quantity={1}
      disabled={isOutOfStock}
      className="btn-primary btn"
      variantId={selectedVariant?.id}
      accessibleAddingToCartLabel="Adding item to your cart"
    >
      {isOutOfStock ? (
        <Text>Sold out</Text>
      ) : (
        <Text as="span" className="flex items-center justify-center gap-2">
          <span>Add to bag</span>
          <span>&middot;</span>
          <Money as="span" withoutTrailingZeros data={selectedVariant.priceV2!} />
          {isOnSale && (
            <Money
              as="span"
              withoutTrailingZeros
              className="strike opacity-50"
              data={selectedVariant.compareAtPriceV2!}
            />
          )}
        </Text>
      )}
    </AddToCartButton>
  );
}
