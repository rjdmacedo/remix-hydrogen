import type { Order } from "~/gql/types";
import { Text, Button } from "~/components/elements";
import { OrderCard } from "~/components/cards/OrderCard";

export function AccountOrderHistory({ orders }: AccountOrderHistoryProps) {
  return (
    <div className="mt-6">
      <div className="grid w-full gap-4 p-4 py-6 md:gap-8 md:p-8 lg:p-12">
        <h2 className="text-lead font-bold">Order History</h2>
        {orders?.length ? <Orders orders={orders} /> : <EmptyOrders />}
      </div>
    </div>
  );
}

function EmptyOrders() {
  return (
    <div>
      <Text className="mb-1" size="fine" width="narrow" as="p">
        You haven&apos;t placed any orders yet.
      </Text>
      <div className="w-48">
        <Button wide color="primary" to="/">
          Start Shopping
        </Button>
      </div>
    </div>
  );
}

function Orders({ orders }: OrdersProps) {
  return (
    <ul className="grid grid-flow-row grid-cols-1 gap-2 gap-y-6 sm:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
      {orders.map((order) => (
        <OrderCard order={order} key={order.id} />
      ))}
    </ul>
  );
}

type AccountOrderHistoryProps = {
  orders: Order[];
};

type OrdersProps = {
  orders: Order[];
};
