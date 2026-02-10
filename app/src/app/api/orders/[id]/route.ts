import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedSession,
  unauthorized,
  notFound,
  badRequest,
  serverError,
} from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { getOrderById } from "@/lib/orders";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorized();

  const { id } = await params;

  try {
    const order = await getOrderById(id);
    if (!order) return notFound("Order not found");
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return serverError("Failed to fetch order");
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorized();

  const { id } = await params;

  try {
    const body = await request.json();
    const { orderNumber, productType, showId, language, status, episodeCount, createdBy } = body;

    const data: Record<string, unknown> = {};
    if (orderNumber !== undefined) data.orderNumber = orderNumber;
    if (productType !== undefined) data.productType = productType;
    if (showId !== undefined) data.showId = showId;
    if (language !== undefined) data.language = language;
    if (status !== undefined) data.status = status;
    if (episodeCount !== undefined) data.episodeCount = episodeCount;
    if (createdBy !== undefined) data.createdBy = createdBy;

    if (Object.keys(data).length === 0) {
      return badRequest("No fields to update");
    }

    await prisma.order.update({
      where: { id },
      data,
    });

    const updatedOrder = await getOrderById(id);
    if (!updatedOrder) return notFound("Order not found after update");

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return serverError("Failed to update order");
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorized();

  const { id } = await params;

  try {
    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting order:", error);
    return serverError("Failed to delete order");
  }
}
