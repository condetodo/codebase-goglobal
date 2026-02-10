import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedSession,
  unauthorized,
  badRequest,
  notFound,
  serverError,
} from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { getEpisodesByOrderId } from "@/lib/orders";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorized();

  const { id } = await params;

  try {
    const episodes = await getEpisodesByOrderId(id);
    return NextResponse.json(episodes);
  } catch (error) {
    console.error("Error fetching episodes:", error);
    return serverError("Failed to fetch episodes");
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorized();

  const { id } = await params;

  try {
    const body = await request.json();
    const count = body.count ?? 1;
    const bodyShowId = body.showId;

    if (count < 1) {
      return badRequest("Count must be at least 1");
    }

    const episodes = await prisma.$transaction(async (tx) => {
      // 1. Get max episodeNumber for this order
      const maxEpResult = await tx.episode.aggregate({
        where: { orderId: id },
        _max: { episodeNumber: true },
      });
      const maxEp = maxEpResult._max.episodeNumber ?? 0;

      // 2. Get order with its vendorAssignments (including vendor items)
      const order = await tx.order.findUnique({
        where: { id },
        include: {
          show: true,
          vendorAssignments: {
            include: {
              vendors: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error("ORDER_NOT_FOUND");
      }

      const showId = bodyShowId || order.showId;

      // Get the show for episode title
      const show = await tx.show.findUnique({ where: { id: showId } });
      if (!show) {
        throw new Error("SHOW_NOT_FOUND");
      }

      // 3. Create `count` episodes
      const createdEpisodes = [];
      for (let i = 0; i < count; i++) {
        const episodeNumber = maxEp + i + 1;
        const episode = await tx.episode.create({
          data: {
            orderId: id,
            showId,
            episodeNumber,
            title: `${show.name} - Episodio ${episodeNumber}`,
            duration: 0,
            status: "pendiente",
          },
        });
        createdEpisodes.push(episode);

        // 4. For each new episode, create Assignment records mirroring OrderVendorAssignment items
        for (const ova of order.vendorAssignments) {
          for (const item of ova.vendors) {
            await tx.assignment.create({
              data: {
                episodeId: episode.id,
                vendorId: item.vendorId,
                phase: ova.phase,
                deadline: ova.deadline,
                isOverride: false,
              },
            });
          }
        }
      }

      // Update the order episodeCount
      await tx.order.update({
        where: { id },
        data: { episodeCount: { increment: count } },
      });

      return createdEpisodes;
    });

    // 5. Return the created episodes using getEpisodesByOrderId
    const allEpisodes = await getEpisodesByOrderId(id);
    return NextResponse.json(allEpisodes, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "ORDER_NOT_FOUND") {
        return notFound("Order not found");
      }
      if (error.message === "SHOW_NOT_FOUND") {
        return notFound("Show not found");
      }
    }
    console.error("Error creating episodes:", error);
    return serverError("Failed to create episodes");
  }
}
