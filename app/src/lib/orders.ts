import { prisma } from "@/lib/prisma";
import type { Order, Episode, OrderVendorAssignment, AssignedVendor } from "@/types";

// Prisma include for Order with nested vendor assignments
const orderInclude = {
  show: true,
  vendorAssignments: {
    include: {
      vendors: {
        include: {
          vendor: true,
        },
      },
    },
  },
} as const;

// Prisma include for Episode with assignments
const episodeInclude = {
  show: true,
  order: {
    include: {
      show: true,
    },
  },
  assignments: {
    include: {
      vendor: true,
    },
  },
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformOrder(prismaOrder: any): Order {
  return {
    id: prismaOrder.id,
    orderNumber: prismaOrder.orderNumber,
    productType: prismaOrder.productType,
    showId: prismaOrder.showId,
    showName: prismaOrder.show.name,
    language: prismaOrder.language,
    status: prismaOrder.status,
    episodeCount: prismaOrder.episodeCount,
    createdAt: prismaOrder.createdAt.toISOString(),
    createdBy: prismaOrder.createdBy,
    vendorAssignments: prismaOrder.vendorAssignments?.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (va: any): OrderVendorAssignment => ({
        phase: va.phase,
        deadline: va.deadline.toISOString(),
        vendors: va.vendors?.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item: any) => ({
            vendorId: item.vendorId,
            vendorName: item.vendor.voiceTalent,
            estimatedMinutes: item.estimatedMinutes,
          })
        ) || [],
      })
    ) || [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformEpisode(prismaEpisode: any): Episode {
  return {
    id: prismaEpisode.id,
    orderId: prismaEpisode.orderId,
    episodeNumber: prismaEpisode.episodeNumber,
    title: prismaEpisode.title,
    duration: prismaEpisode.duration,
    status: prismaEpisode.status,
    showId: prismaEpisode.showId,
    showName: prismaEpisode.show.name,
    assignedVendors: prismaEpisode.assignments?.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (a: any): AssignedVendor => ({
        vendorId: a.vendorId,
        vendorName: a.vendor.voiceTalent,
        phase: a.phase,
        minutesWorked: a.minutesWorked,
        deadline: a.deadline?.toISOString(),
      })
    ) || [],
  };
}

export async function getAllOrders(): Promise<Order[]> {
  const orders = await prisma.order.findMany({
    include: orderInclude,
    orderBy: { createdAt: "desc" },
  });
  return orders.map(transformOrder);
}

export async function getOrderById(id: string): Promise<Order | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });
  if (!order) return null;
  return transformOrder(order);
}

export async function getEpisodesByOrderId(orderId: string): Promise<Episode[]> {
  const episodes = await prisma.episode.findMany({
    where: { orderId },
    include: episodeInclude,
    orderBy: { episodeNumber: "asc" },
  });
  return episodes.map(transformEpisode);
}

export async function getEpisodeById(id: string): Promise<Episode | null> {
  const episode = await prisma.episode.findUnique({
    where: { id },
    include: episodeInclude,
  });
  if (!episode) return null;
  return transformEpisode(episode);
}
