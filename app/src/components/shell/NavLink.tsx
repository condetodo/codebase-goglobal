"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

interface NavLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  collapsed?: boolean;
}

export function NavLink({ href, label, icon, collapsed }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={clsx(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive
          ? "bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-300"
          : "text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-700"
      )}
      title={collapsed ? label : undefined}
    >
      <span className="w-5 h-5 shrink-0">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
