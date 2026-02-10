import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedSession,
  unauthorized,
  badRequest,
  serverError,
} from "@/lib/api-helpers";
import { prisma } from "@/lib/prisma";
import { getOrderById } from "@/lib/orders";

interface VendorItem {
  vendorId: string;
  estimatedMinutes: number;
}

interface AssignmentInput {
  phase: string;
  deadline: string;
  vendors: VendorItem[];
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthenticatedSession();
  if (!session) return unauthorized();

  const { id } = await params;

  try {
    const body = await request.json();
    const { assignments } = body as { assignments: AssignmentInput[] };

    if (!assignments || !Array.isArray(assignments)) {
      return badRequest("assignments array is required");
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete all existing OrderVendorAssignment records for this order
      //    (cascade deletes OrderVendorAssignmentItem records)
      await tx.orderVendorAssignment.deleteMany({
        where: { orderId: id },
      });

      // 2. Delete all non-override Assignment records for ALL episodes of this order
      const episodes = await tx.episode.findMany({
        where: { orderId: id },
        select: { id: true },
      });
      const episodeIds = episodes.map((e) => e.id);

      if (episodeIds.length > 0) {
        await tx.assignment.deleteMany({
          where: {
            episodeId: { in: episodeIds },
            isOverride: false,
          },
        });
      }

      // 3. Create new OrderVendorAssignment records with their items
      for (const assignment of assignments) {
        const ova = await tx.orderVendorAssignment.create({
          data: {
            orderId: id,
            phase: assignment.phase,
            deadline: new Date(assignment.deadline),
          },
        });

        for (const vendor of assignment.vendors) {
          await tx.orderVendorAssignmentItem.create({
            data: {
              orderVendorAssignmentId: ova.id,
              vendorId: vendor.vendorId,
              estimatedMinutes: vendor.estimatedMinutes,
            },
          });
        }

        // 4. For each episode of the order, create new Assignment records (isOverride: false)
        for (const episodeId of episodeIds) {
          for (const vendor of assignment.vendors) {
            await tx.assignment.create({
              data: {
                episodeId,
                vendorId: vendor.vendorId,
                phase: assignment.phase,
                deadline: new Date(assignment.deadline),
                isOverride: false,
              },
            });
          }
        }
      }
    });

    const updatedOrder = await getOrderById(id);
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating vendor assignments:", error);
    return serverError("Failed to update vendor assignments");
  }
}
