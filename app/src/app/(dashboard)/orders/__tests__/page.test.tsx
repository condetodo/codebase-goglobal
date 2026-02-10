import { describe, it, expect, vi } from "vitest";

// Mock the data layer
vi.mock("@/lib/orders", () => ({
  getAllOrders: vi.fn().mockResolvedValue([
    {
      id: "ord-1",
      orderNumber: "ORD-2024-001",
      productType: "miniserie",
      showId: "show-1",
      showName: "Dark Secrets",
      language: "es-AR",
      status: "en_proceso",
      episodeCount: 6,
      createdAt: "2024-01-15T10:30:00Z",
      createdBy: "María González",
      vendorAssignments: [],
    },
  ]),
}));

// Mock the client component
vi.mock("@/components/orders/OrdersListClient", () => ({
  OrdersListClient: ({ orders }: { orders: unknown[] }) => (
    <div data-testid="orders-list-client">
      {orders.length} orders loaded
    </div>
  ),
}));

import { render, screen } from "@testing-library/react";
import OrdersPage from "../page";

describe("OrdersPage", () => {
  it("renders OrdersListClient with fetched orders", async () => {
    const Page = await OrdersPage();
    render(Page);
    expect(screen.getByTestId("orders-list-client")).toBeInTheDocument();
    expect(screen.getByText("1 orders loaded")).toBeInTheDocument();
  });
});
