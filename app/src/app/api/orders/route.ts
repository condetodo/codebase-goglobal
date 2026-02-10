import { NextResponse } from "next/server";
import { getAuthenticatedSession, unauthorized, serverError } from "@/lib/api-helpers";
import { getAllOrders } from "@/lib/orders";

export async function GET() {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorized();

  try {
    const orders = await getAllOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return serverError("Failed to fetch orders");
  }
}
