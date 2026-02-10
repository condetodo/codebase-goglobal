"use client";

import { NavLink } from "./NavLink";

interface SidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
  mobile?: boolean;
}

const navItems = [
  {
    href: "/orders",
    label: "Órdenes",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    href: "/assignment",
    label: "Nueva Orden",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    href: "/vendors",
    label: "Vendors",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    ),
  },
  {
    href: "/rates",
    label: "Tarifas",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    href: "/settlement",
    label: "Liquidación",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

export function Sidebar({ collapsed, onClose, mobile }: SidebarProps) {
  const sidebarContent = (
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => (
        <div key={item.href} onClick={mobile ? onClose : undefined}>
          <NavLink
            href={item.href}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
          />
        </div>
      ))}
    </nav>
  );

  if (mobile) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-stone-800 border-r border-stone-200 dark:border-stone-700 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 border-b border-stone-200 dark:border-stone-700">
            <span className="font-heading font-bold text-stone-900 dark:text-stone-100">
              Go Global
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {sidebarContent}
        </aside>
      </>
    );
  }

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 transition-all ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div
        className={`flex items-center h-16 border-b border-stone-200 dark:border-stone-700 ${
          collapsed ? "justify-center px-2" : "px-4"
        }`}
      >
        {collapsed ? (
          <span className="font-heading font-bold text-stone-900 dark:text-stone-100 text-lg">
            G
          </span>
        ) : (
          <span className="font-heading font-bold text-stone-900 dark:text-stone-100">
            Go Global
          </span>
        )}
      </div>
      {sidebarContent}
    </aside>
  );
}
