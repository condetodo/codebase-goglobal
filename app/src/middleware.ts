export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/orders/:path*", "/assignment/:path*", "/vendors/:path*", "/rates/:path*", "/settlement/:path*"],
};
