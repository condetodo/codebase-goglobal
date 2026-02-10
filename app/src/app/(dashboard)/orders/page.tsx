import { getAllOrders } from "@/lib/orders";
import { OrdersListClient } from "@/components/orders/OrdersListClient";

export default async function OrdersPage() {
  const orders = await getAllOrders();

  return <OrdersListClient orders={orders} />;
}
