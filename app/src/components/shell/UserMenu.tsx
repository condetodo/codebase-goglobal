"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export function UserMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session?.user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
        aria-label="Menú de usuario"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name ?? "Avatar"}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm font-medium">
            {session.user.name?.charAt(0) ?? "U"}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-lg z-50">
          <div className="p-3 border-b border-stone-200 dark:border-stone-700">
            <p className="text-sm font-medium text-stone-900 dark:text-stone-100">
              {session.user.name}
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
              {session.user.email}
            </p>
          </div>
          <div className="p-1">
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="w-full text-left px-3 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-md transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
