import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import { OrderDetail } from "../OrderDetail";
import type { Order, Episode } from "@/types";

const mockOrder: Order = {
  id: "ord-1",
  orderNumber: "ORD-2024-001",
  productType: "miniserie",
  showId: "show-1",
  showName: "Dark Secrets",
  language: "es-AR",
  status: "en_proceso",
  episodeCount: 2,
  createdAt: "2024-01-15T10:30:00Z",
  createdBy: "María González",
  vendorAssignments: [
    {
      phase: "adaptación",
      deadline: "2024-03-01T23:59:00Z",
      vendors: [
        { vendorId: "v1", vendorName: "Estudio Alpha", estimatedMinutes: 270 },
      ],
    },
  ],
};

const mockEpisodes: Episode[] = [
  {
    id: "ep-1",
    orderId: "ord-1",
    episodeNumber: 1,
    title: "Dark Secrets - Episodio 1",
    duration: 45,
    status: "en_produccion",
    showId: "show-1",
    showName: "Dark Secrets",
    assignedVendors: [
      {
        vendorId: "v1",
        vendorName: "Estudio Alpha",
        phase: "adaptación",
        minutesWorked: 45,
      },
    ],
  },
  {
    id: "ep-2",
    orderId: "ord-1",
    episodeNumber: 2,
    title: "Dark Secrets - Episodio 2",
    duration: 48,
    status: "pendiente",
    showId: "show-1",
    showName: "Dark Secrets",
    assignedVendors: [],
  },
];

describe("OrderDetail", () => {
  it("renders order information", () => {
    render(<OrderDetail order={mockOrder} episodes={mockEpisodes} />);
    expect(screen.getByText("ORD-2024-001")).toBeInTheDocument();
    expect(screen.getAllByText("Dark Secrets").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Miniserie")).toBeInTheDocument();
    expect(screen.getByText("es-AR")).toBeInTheDocument();
    expect(screen.getByText("María González")).toBeInTheDocument();
  });

  it("renders vendor assignments section", () => {
    render(<OrderDetail order={mockOrder} episodes={mockEpisodes} />);
    expect(
      screen.getByText("Vendors y Deadlines Asignados a Nivel de Order")
    ).toBeInTheDocument();
    expect(screen.getByText("Estudio Alpha")).toBeInTheDocument();
    expect(screen.getByText("(270 min)")).toBeInTheDocument();
  });

  it("renders episodes list", () => {
    render(<OrderDetail order={mockOrder} episodes={mockEpisodes} />);
    expect(screen.getByText("Episodios (2)")).toBeInTheDocument();
    expect(screen.getByText("Episodio 1")).toBeInTheDocument();
    expect(screen.getByText("Episodio 2")).toBeInTheDocument();
  });

  it("shows empty episodes message when no episodes", () => {
    render(<OrderDetail order={mockOrder} episodes={[]} />);
    expect(screen.getByText("No hay episodios")).toBeInTheDocument();
  });

  it("calls onEpisodeClick when clicking an episode", async () => {
    const user = userEvent.setup();
    const onEpisodeClick = vi.fn();
    render(
      <OrderDetail
        order={mockOrder}
        episodes={mockEpisodes}
        onEpisodeClick={onEpisodeClick}
      />
    );

    const viewButtons = screen.getAllByLabelText("Ver episodio");
    await user.click(viewButtons[0]);

    expect(onEpisodeClick).toHaveBeenCalledWith("ep-1");
  });

  it("calls onStatusChange when changing status", async () => {
    const user = userEvent.setup();
    const onStatusChange = vi.fn();
    render(
      <OrderDetail
        order={mockOrder}
        episodes={mockEpisodes}
        onStatusChange={onStatusChange}
      />
    );

    const select = screen.getByDisplayValue("En Proceso");
    await user.selectOptions(select, "completada");

    expect(onStatusChange).toHaveBeenCalledWith("ord-1", "completada");
  });

  it("calls onAddEpisode when clicking add episode button", async () => {
    const user = userEvent.setup();
    const onAddEpisode = vi.fn();
    render(
      <OrderDetail
        order={mockOrder}
        episodes={mockEpisodes}
        onAddEpisode={onAddEpisode}
      />
    );

    await user.click(screen.getByText("Agregar Episodio"));

    expect(onAddEpisode).toHaveBeenCalledWith("ord-1");
  });

  it("calls onDelete when clicking delete button", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(
      <OrderDetail
        order={mockOrder}
        episodes={mockEpisodes}
        onDelete={onDelete}
      />
    );

    await user.click(screen.getByText("Eliminar"));

    expect(onDelete).toHaveBeenCalledWith("ord-1");
  });
});
