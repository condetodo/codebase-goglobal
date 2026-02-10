import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedSession,
  unauthorized,
  notFound,
  badRequest,
  serverError,
} from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { getEpisodeById } from "@/lib/orders";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; episodeId: string }> }
) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorized();

  const { id, episodeId } = await params;

  try {
    const body = await request.json();
    const { title, duration, status } = body;

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (duration !== undefined) data.duration = duration;
    if (status !== undefined) data.status = status;

    if (Object.keys(data).length === 0) {
      return badRequest("No fields to update");
    }

    await prisma.episode.update({
      where: { id: episodeId },
      data,
    });

    const updatedEpisode = await getEpisodeById(episodeId);
    if (!updatedEpisode) return notFound("Episode not found after update");

    return NextResponse.json(updatedEpisode);
  } catch (error) {
    console.error("Error updating episode:", error);
    return serverError("Failed to update episode");
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; episodeId: string }> }
) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorized();

  const { id, episodeId } = await params;

  try {
    await prisma.episode.delete({ where: { id: episodeId } });

    await prisma.order.update({
      where: { id },
      data: { episodeCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting episode:", error);
    return serverError("Failed to delete episode");
  }
}
