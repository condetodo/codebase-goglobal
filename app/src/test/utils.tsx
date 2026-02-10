import { render, type RenderOptions } from "@testing-library/react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";

const mockSession: Session = {
  user: {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    image: "https://example.com/avatar.png",
  },
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
};

function AllProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider session={mockSession}>{children}</SessionProvider>
  );
}

function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export { customRender as render, mockSession };
export { screen, within, waitFor } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
