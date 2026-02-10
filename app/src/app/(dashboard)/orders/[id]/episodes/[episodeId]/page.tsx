import { notFound } from "next/navigation";
import { getOrderById, getEpisodeById } from "@/lib/orders";
import { EpisodeEditClient } from "@/components/orders/EpisodeEditClient";

export default async function EpisodeEditPage({
  params,
}: {
  params: Promise<{ id: string; episodeId: string }>;
}) {
  const { id, episodeId } = await params;

  const order = await getOrderById(id);
  if (!order) return notFound();

  const episode = await getEpisodeById(episodeId);
  if (!episode) return notFound();

  return <EpisodeEditClient episode={episode} order={order} />;
}
