import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedSession,
  unauthorized,
  badRequest,
  notFound,
  serverError,
} from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; episodeId: string }> }
) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorized();

  const { id, episodeId } = await params;

  try {
    const body = await request.json();
    const { vendorId, phase, minutesWorked, deadline } = body;

    if (!vendorId || !phase) {
      return badRequest("vendorId and phase are required");
    }

    const assignment = await prisma.assignment.create({
      data: {
        episodeId,
        vendorId,
        phase,
        minutesWorked: minutesWorked ?? 0,
        deadline: deadline ? new Date(deadline) : null,
        isOverride: true,
      },
      include: {
        vendor: true,
      },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error("Error creating assignment:", error);
    return serverError("Failed to create assignment");
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; episodeId: string }> }
) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorized();

  const { id, episodeId } = await params;

  try {
    const body = await request.json();
    const { vendorId, phase, minutesWorked } = body;

    if (!vendorId || !phase) {
      return badRequest("vendorId and phase are required");
    }

    const existing = await prisma.assignment.findFirst({
      where: {
        episodeId,
        vendorId,
        phase,
      },
    });

    if (!existing) {
      return notFound("Assignment not found");
    }

    const data: Record<string, unknown> = {};
    if (minutesWorked !== undefined) data.minutesWorked = minutesWorked;

    await prisma.assignment.update({
      where: { id: existing.id },
      data,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating assignment:", error);
    return serverError("Failed to update assignment");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; episodeId: string }> }
) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorized();

  const { id, episodeId } = await params;

  try {
    const body = await request.json();
    const { vendorId, phase } = body;

    if (!vendorId || !phase) {
      return badRequest("vendorId and phase are required");
    }

    const existing = await prisma.assignment.findFirst({
      where: {
        episodeId,
        vendorId,
        phase,
      },
    });

    if (!existing) {
      return notFound("Assignment not found");
    }

    await prisma.assignment.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    return serverError("Failed to delete assignment");
  }
}
