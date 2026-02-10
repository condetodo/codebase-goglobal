import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import { UserMenu } from "../UserMenu";

const { mockSignOut } = vi.hoisted(() => ({
  mockSignOut: vi.fn(),
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
          image: null,
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      status: "authenticated",
    }),
    signOut: mockSignOut,
  };
});

describe("UserMenu", () => {
  it("renders the user initial as avatar fallback", () => {
    render(<UserMenu />);

    const avatar = screen.getByText("T");
    expect(avatar).toBeInTheDocument();
  });

  it("opens dropdown when avatar is clicked", async () => {
    const user = userEvent.setup();
    render(<UserMenu />);

    expect(screen.queryByText("Test User")).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Menú de usuario"));

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("closes dropdown when avatar is clicked again", async () => {
    const user = userEvent.setup();
    render(<UserMenu />);

    await user.click(screen.getByLabelText("Menú de usuario"));
    expect(screen.getByText("Test User")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Menú de usuario"));
    expect(screen.queryByText("test@example.com")).not.toBeInTheDocument();
  });

  it("calls signOut when sign-out button is clicked", async () => {
    const user = userEvent.setup();
    render(<UserMenu />);

    await user.click(screen.getByLabelText("Menú de usuario"));
    await user.click(screen.getByText("Cerrar sesión"));

    expect(mockSignOut).toHaveBeenCalledWith({ callbackUrl: "/auth/signin" });
  });
});
