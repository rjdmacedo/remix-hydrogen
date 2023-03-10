import { useRef } from "react";
import { useScroll } from "react-use";
import { Money, useCart } from "@shopify/storefront-kit-react";
import { CartEmpty } from "~/components/cart/CartEmpty";
// import { CartLineItem } from "~/components/cart/CartLineItem";
import { Text, Button } from "~/components/elements";
// import { CartLineProvider } from "@shopify/storefront-kit-react/dist/types/CartLineProvider";

export function CartDetails({ layout, onClose }: CartDetailsProps) {
  const { lines } = useCart();
  const scrollRef = useRef(null);

  const { y } = useScroll(scrollRef);

  if (lines?.length === 0) {
    return <CartEmpty onClose={onClose} />;
  }

  const container = {
    drawer: "grid grid-cols-1 h-screen-no-nav grid-rows-[1fr_auto]",
    page: "pb-12 max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-start gap-4 md:gap-8 lg:gap-12",
  };

  const content = {
    drawer: "overflow-auto transition p-6",
    page: "flex-grow md:translate-y-4",
  };

  const summary = {
    drawer: "grid gap-6 p-6 border-t md:px-12",
    page: "sticky top-nav grid gap-6 p-4 md:px-6 md:translate-y-4 bg-primary/5 rounded w-full max-w-md",
  };

  return (
    <form className={container[layout]}>
      <section
        ref={scrollRef}
        aria-labelledby="cart-contents"
        className={`${content[layout]} ${y > 0 ? "border-t" : ""}`}
      >
        <ul className="grid gap-6 md:gap-10">
          {lines &&
            lines.map((line) => (
              <span key={line?.id}>Todo</span>
              // <CartLineProvider key={line?.id} line={line as CartLine}>
              //   <CartLineItem />
              // </CartLineProvider>
            ))}
        </ul>
      </section>

      <section aria-labelledby="summary-heading" className={summary[layout]}>
        <h2 id="summary-heading" className="sr-only">
          Order summary
        </h2>
        <OrderSummary />
        <CartCheckoutActions />
      </section>
    </form>
  );
}

function CartCheckoutActions() {
  const { checkoutUrl } = useCart();
  return (
    <>
      <div className="grid gap-4">
        <Button to={checkoutUrl} color="ghost">
          Continue to Checkout
        </Button>
      </div>
    </>
  );
}

function OrderSummary() {
  const { cost } = useCart();
  return (
    <>
      <dl className="grid">
        <div className="flex items-center justify-between font-medium">
          <Text as="dt">Subtotal</Text>
          <Text as="dd">{cost?.subtotalAmount?.amount ? <Money data={cost?.subtotalAmount} /> : "-"}</Text>
        </div>
      </dl>
    </>
  );
}

interface CartDetailsProps {
  layout: "drawer" | "page";
  onClose?: () => void;
}
