import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedSession,
  unauthorized,
  badRequest,
  serverError,
} from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["pendiente", "en_proceso", "completada", "cancelada"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorized();

  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return badRequest(
        `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}`
      );
    }

    await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Error updating order status:", error);
    return serverError("Failed to update order status");
  }
}
