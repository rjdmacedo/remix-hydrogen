import { useScroll } from "react-use";
import { useRef, Suspense } from "react";

import { ProductCard } from "~/components/product";
import { Button, Heading, Skeleton, Text } from "~/components/elements";

export function CartEmpty({ onClose }: { onClose?: () => void }) {
  const scrollRef = useRef(null);
  const { y } = useScroll(scrollRef);

  return (
    <div
      ref={scrollRef}
      className={`grid h-screen-no-nav content-start gap-4 overflow-y-scroll px-6 pb-8 transition md:gap-12 md:px-12 md:pb-12 ${
        y > 0 && "border-t"
      }`}
    >
      <section className="grid gap-6">
        <Text format>Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you started!</Text>
        <div>
          <Button color="ghost" fullWidth onClick={onClose}>
            Continue shopping
          </Button>
        </div>
      </section>
      <section className="grid gap-8 pt-4">
        <Heading format size="copy">
          Shop Best Sellers
        </Heading>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8">
          <Suspense fallback={<Loading />}>
            <TopProducts onClose={onClose} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

function TopProducts({ onClose }: { onClose?: () => void }) {
  return (
    <>
      {[].map((product: any) => (
        <ProductCard product={product} key={product.id} onClick={onClose} />
      ))}
    </>
  );
}

function Loading() {
  return (
    <>
      {[...new Array(4)].map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className="grid gap-2">
          <Skeleton className="aspect-[3/4]" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </>
  );
}
