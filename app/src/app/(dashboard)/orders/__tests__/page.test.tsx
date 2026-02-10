import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import OrdersPage from "../page";

describe("OrdersPage", () => {
  it("renders the Órdenes heading", () => {
    render(<OrdersPage />);
    expect(screen.getByText("Órdenes")).toBeInTheDocument();
  });

  it("renders the placeholder message", () => {
    render(<OrdersPage />);
    expect(
      screen.getByText("Esta sección se implementará en el próximo milestone.")
    ).toBeInTheDocument();
  });
});
