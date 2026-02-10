import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import { OrdersList } from "../OrdersList";
import type { Order } from "@/types";

const mockOrders: Order[] = [
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
  {
    id: "ord-2",
    orderNumber: "ORD-2024-002",
    productType: "serie",
    showId: "show-2",
    showName: "City Lights",
    language: "es-MX",
    status: "completada",
    episodeCount: 12,
    createdAt: "2024-01-10T14:20:00Z",
    createdBy: "Carlos Mendoza",
    vendorAssignments: [],
  },
  {
    id: "ord-3",
    orderNumber: "ORD-2024-003",
    productType: "pelicula",
    showId: "show-3",
    showName: "The Last Journey",
    language: "es-AR",
    status: "pendiente",
    episodeCount: 1,
    createdAt: "2024-01-20T09:15:00Z",
    createdBy: "Ana Rodríguez",
    vendorAssignments: [],
  },
];

describe("OrdersList", () => {
  it("renders the heading", () => {
    render(<OrdersList orders={mockOrders} />);
    expect(screen.getByText("Órdenes de Doblaje")).toBeInTheDocument();
  });

  it("renders table rows for each order", () => {
    render(<OrdersList orders={mockOrders} />);
    expect(screen.getByText("ORD-2024-001")).toBeInTheDocument();
    expect(screen.getByText("ORD-2024-002")).toBeInTheDocument();
    expect(screen.getByText("ORD-2024-003")).toBeInTheDocument();
  });

  it("displays empty state when no orders", () => {
    render(<OrdersList orders={[]} />);
    expect(screen.getByText("No se encontraron órdenes")).toBeInTheDocument();
    expect(screen.getByText("Crea tu primera orden para comenzar")).toBeInTheDocument();
  });

  it("filters orders by search query", async () => {
    const user = userEvent.setup();
    render(<OrdersList orders={mockOrders} />);

    const searchInput = screen.getByPlaceholderText(
      "Buscar por número de orden, show o creador..."
    );
    await user.type(searchInput, "Dark");

    expect(screen.getByText("ORD-2024-001")).toBeInTheDocument();
    expect(screen.queryByText("ORD-2024-002")).not.toBeInTheDocument();
    expect(screen.queryByText("ORD-2024-003")).not.toBeInTheDocument();
  });

  it("filters orders by status chip", async () => {
    const user = userEvent.setup();
    render(<OrdersList orders={mockOrders} />);

    const completadaChip = screen.getByRole("button", { name: "Completada" });
    await user.click(completadaChip);

    expect(screen.queryByText("ORD-2024-001")).not.toBeInTheDocument();
    expect(screen.getByText("ORD-2024-002")).toBeInTheDocument();
    expect(screen.queryByText("ORD-2024-003")).not.toBeInTheDocument();
  });

  it("calls onView when clicking view button", async () => {
    const user = userEvent.setup();
    const onView = vi.fn();
    render(<OrdersList orders={mockOrders} onView={onView} />);

    const viewButtons = screen.getAllByLabelText("Ver orden");
    await user.click(viewButtons[0]);

    expect(onView).toHaveBeenCalledWith("ord-1");
  });

  it("calls onCreate when clicking Nueva Orden button", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn();
    render(<OrdersList orders={mockOrders} onCreate={onCreate} />);

    await user.click(screen.getByText("Nueva Orden"));

    expect(onCreate).toHaveBeenCalled();
  });

  it("calls onDelete when clicking delete button", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<OrdersList orders={mockOrders} onDelete={onDelete} />);

    const deleteButtons = screen.getAllByLabelText("Eliminar orden");
    await user.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith("ord-1");
  });

  it("shows results count", () => {
    render(<OrdersList orders={mockOrders} />);
    expect(screen.getByText("Mostrando 3 de 3 órdenes")).toBeInTheDocument();
  });
});
