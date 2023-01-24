import { statusMessage } from "~/lib/utils";
import { Heading, Text } from "~/components/elements";
import { Image, flattenConnection } from "@shopify/storefront-kit-react";
import type { Order, OrderLineItemConnection } from "~/gql/types";
import { Link } from "@remix-run/react";

export function OrderCard({ order }: OrderCardProps) {
  if (!order?.id) return null;
  const legacyOrderId = order!.id!.split("/").pop()!.split("?")[0];
  const lineItems = flattenConnection(order?.lineItems as OrderLineItemConnection);

  return (
    <li className="grid rounded border text-center">
      <Link
        className="grid items-center gap-4 p-4 md:grid-cols-2 md:gap-6 md:p-6"
        to={`/account/orders/${legacyOrderId}`}
      >
        {lineItems[0].variant?.image && (
          <div className="card-image aspect-square bg-primary/5">
            <Image
              width={168}
              height={168}
              widths={[168]}
              className="fade-in cover w-full"
              alt={lineItems[0].variant?.image?.altText ?? "Order image"}
              data={lineItems[0].variant?.image}
              loaderOptions={{ scale: 2, crop: "center" }}
            />
          </div>
        )}
        <div className={`flex-col justify-center text-left ${!lineItems[0].variant?.image && "md:col-span-2"}`}>
          <Heading as="h3" format size="copy">
            {lineItems.length > 1 ? `${lineItems[0].title} +${lineItems.length - 1} more` : lineItems[0].title}
          </Heading>
          <dl className="grid-gap-1 grid">
            <dt className="sr-only">Order ID</dt>
            <dd>
              <Text size="fine" color="subtle">
                Order No. {order.orderNumber}
              </Text>
            </dd>
            <dt className="sr-only">Order Date</dt>
            <dd>
              <Text size="fine" color="subtle">
                {new Date(order.processedAt).toDateString()}
              </Text>
            </dd>
            <dt className="sr-only">Fulfillment Status</dt>
            <dd className="mt-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  order.fulfillmentStatus === "FULFILLED"
                    ? "bg-green-100 text-green-800"
                    : "bg-primary/5 text-primary/50"
                }`}
              >
                <Text size="fine">{statusMessage(order.fulfillmentStatus)}</Text>
              </span>
            </dd>
          </dl>
        </div>
      </Link>
      <div className="self-end border-t">
        <Link className="block w-full p-2 text-center" to={`/account/orders/${legacyOrderId}`}>
          <Text color="subtle" className="ml-3">
            View Details
          </Text>
        </Link>
      </div>
    </li>
  );
}

type OrderCardProps = {
  order: Order;
};
