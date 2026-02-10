import { NextResponse } from "next/server";
import { getAuthenticatedSession, unauthorized, serverError } from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorized();

  try {
    const shows = await prisma.show.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, description: true },
    });
    return NextResponse.json(shows);
  } catch (error) {
    console.error("Error fetching shows:", error);
    return serverError("Failed to fetch shows");
  }
}
