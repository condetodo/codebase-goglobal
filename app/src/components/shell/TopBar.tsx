"use client";

import { UserMenu } from "./UserMenu";

interface TopBarProps {
  onMenuToggle: () => void;
  onSidebarCollapse?: () => void;
  sidebarCollapsed?: boolean;
}

export function TopBar({
  onMenuToggle,
  onSidebarCollapse,
  sidebarCollapsed,
}: TopBarProps) {
  return (
    <header className="flex items-center justify-between h-16 px-4 border-b border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-md text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700 lg:hidden"
          aria-label="Abrir menú"
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={onSidebarCollapse}
          className="hidden lg:block p-2 rounded-md text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700"
          aria-label={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <h1 className="text-lg font-heading font-semibold text-stone-900 dark:text-stone-100 hidden sm:block">
          Dubbing Manager
        </h1>
      </div>
      <UserMenu />
    </header>
  );
}
