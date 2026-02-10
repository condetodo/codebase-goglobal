import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import { EpisodeEdit } from "../EpisodeEdit";
import type { Order, Episode } from "@/types";

const mockOrder: Order = {
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

const mockEpisode: Episode = {
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
      vendorId: "v-override",
      vendorName: "Voice Override Studio",
      phase: "voice recording",
      minutesWorked: 30,
    },
  ],
};

describe("EpisodeEdit", () => {
  it("renders episode header info", () => {
    render(<EpisodeEdit episode={mockEpisode} order={mockOrder} />);
    expect(screen.getByText("Editar Episodio 1")).toBeInTheDocument();
    expect(
      screen.getByText("Dark Secrets - Episodio 1 - ORD-2024-001")
    ).toBeInTheDocument();
  });

  it("renders basic info fields with current values", () => {
    render(<EpisodeEdit episode={mockEpisode} order={mockOrder} />);
    const durationInput = screen.getByLabelText("Duración (minutos)");
    expect(durationInput).toHaveValue(45);

    const statusSelect = screen.getByLabelText("Estado");
    expect(statusSelect).toHaveValue("en_produccion");
  });

  it("renders inherited vendor assignments (read-only)", () => {
    render(<EpisodeEdit episode={mockEpisode} order={mockOrder} />);
    expect(
      screen.getByText("Vendors y Deadlines Heredados de la Order")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Solo lectura - Para modificar, edita desde la Order")
    ).toBeInTheDocument();
    expect(screen.getByText("Estudio Alpha")).toBeInTheDocument();
  });

  it("renders episode-specific vendors (exceptions)", () => {
    render(<EpisodeEdit episode={mockEpisode} order={mockOrder} />);
    expect(
      screen.getByText("Vendors Específicos del Episodio")
    ).toBeInTheDocument();
    expect(screen.getByText("Voice Override Studio")).toBeInTheDocument();
  });

  it("shows no exceptions message when episode has no overrides", () => {
    const noOverrideEpisode: Episode = {
      ...mockEpisode,
      assignedVendors: [],
    };
    render(<EpisodeEdit episode={noOverrideEpisode} order={mockOrder} />);
    expect(
      screen.getByText("No hay excepciones para este episodio")
    ).toBeInTheDocument();
  });

  it("calls onSave with updated episode data", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(
      <EpisodeEdit episode={mockEpisode} order={mockOrder} onSave={onSave} />
    );

    await user.click(screen.getByText("Guardar Cambios"));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "ep-1",
        duration: 45,
        status: "en_produccion",
      })
    );
  });

  it("calls onCancel when clicking cancel", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(
      <EpisodeEdit
        episode={mockEpisode}
        order={mockOrder}
        onCancel={onCancel}
      />
    );

    await user.click(screen.getByText("Cancelar"));

    expect(onCancel).toHaveBeenCalled();
  });

  it("calls onRemoveVendor when clicking delete on a vendor", async () => {
    const user = userEvent.setup();
    const onRemoveVendor = vi.fn();
    render(
      <EpisodeEdit
        episode={mockEpisode}
        order={mockOrder}
        onRemoveVendor={onRemoveVendor}
      />
    );

    const deleteBtn = screen.getByLabelText("Eliminar vendor");
    await user.click(deleteBtn);

    expect(onRemoveVendor).toHaveBeenCalledWith(
      "ep-1",
      "v-override",
      "voice recording"
    );
  });
});
