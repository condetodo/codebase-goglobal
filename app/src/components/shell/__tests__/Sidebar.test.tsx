import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { Sidebar } from "../Sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/orders",
}));

describe("Sidebar", () => {
  it("renders all 5 navigation links", () => {
    render(<Sidebar />);

    expect(screen.getByText("Órdenes")).toBeInTheDocument();
    expect(screen.getByText("Nueva Orden")).toBeInTheDocument();
    expect(screen.getByText("Vendors")).toBeInTheDocument();
    expect(screen.getByText("Tarifas")).toBeInTheDocument();
    expect(screen.getByText("Liquidación")).toBeInTheDocument();
  });

  it("renders links with correct hrefs", () => {
    render(<Sidebar />);

    expect(screen.getByText("Órdenes").closest("a")).toHaveAttribute("href", "/orders");
    expect(screen.getByText("Nueva Orden").closest("a")).toHaveAttribute("href", "/assignment");
    expect(screen.getByText("Vendors").closest("a")).toHaveAttribute("href", "/vendors");
    expect(screen.getByText("Tarifas").closest("a")).toHaveAttribute("href", "/rates");
    expect(screen.getByText("Liquidación").closest("a")).toHaveAttribute("href", "/settlement");
  });

  it("highlights the active link", () => {
    render(<Sidebar />);

    const activeLink = screen.getByText("Órdenes").closest("a");
    expect(activeLink).toHaveClass("bg-blue-50");
    expect(activeLink).toHaveClass("text-blue-900");
  });

  it("does not highlight inactive links", () => {
    render(<Sidebar />);

    const inactiveLink = screen.getByText("Vendors").closest("a");
    expect(inactiveLink).toHaveClass("text-stone-600");
    expect(inactiveLink).not.toHaveClass("bg-blue-50");
  });
});
