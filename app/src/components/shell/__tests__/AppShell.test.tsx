import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { AppShell } from "../AppShell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/orders",
}));

vi.mock("next-auth/react", async () => {
  const actual = await vi.importActual<typeof import("next-auth/react")>("next-auth/react");
  return {
    ...actual,
    useSession: () => ({
      data: {
        user: {
          id: "test-user-id",
          name: "Test User",
          email: "test@example.com",
          image: "https://example.com/avatar.png",
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      status: "authenticated",
    }),
    signOut: vi.fn(),
  };
});

describe("AppShell", () => {
  it("renders sidebar navigation", () => {
    render(
      <AppShell>
        <div>Test content</div>
      </AppShell>
    );

    expect(screen.getByText("Órdenes")).toBeInTheDocument();
    expect(screen.getByText("Vendors")).toBeInTheDocument();
  });

  it("renders the top bar with app title", () => {
    render(
      <AppShell>
        <div>Test content</div>
      </AppShell>
    );

    expect(screen.getByText("Dubbing Manager")).toBeInTheDocument();
  });

  it("renders children in the content area", () => {
    render(
      <AppShell>
        <div>Test content</div>
      </AppShell>
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders the user menu", () => {
    render(
      <AppShell>
        <div>Test content</div>
      </AppShell>
    );

    expect(screen.getByLabelText("Menú de usuario")).toBeInTheDocument();
  });
});
