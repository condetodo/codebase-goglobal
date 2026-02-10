import { notFound } from "next/navigation";
import { getOrderById, getEpisodesByOrderId } from "@/lib/orders";
import { OrderDetailClient } from "@/components/orders/OrderDetailClient";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await getOrderById(id);
  if (!order) return notFound();

  const episodes = await getEpisodesByOrderId(id);

  return <OrderDetailClient order={order} episodes={episodes} />;
}
