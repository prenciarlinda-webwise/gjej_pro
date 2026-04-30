"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth-context";
import { useNotifications } from "@/lib/notifications-context";
import type { Role } from "@/lib/api";

interface NavItem {
  label: string;
  href: string;
  soon?: boolean;
  badgeKey?: "notifications";
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  admin: [
    { label: "Paneli", href: "/dashboard/admin" },
    { label: "Njoftimet", href: "/dashboard/admin/njoftimet", badgeKey: "notifications" },
    { label: "Përdoruesit", href: "/dashboard/admin/perdoruesit" },
    { label: "Kategoritë", href: "/dashboard/admin/kategorite", soon: true },
    { label: "Cilësimet", href: "/dashboard/admin/cilesimet" },
  ],
  freelancer: [
    { label: "Paneli", href: "/dashboard/freelancer" },
    { label: "Profili", href: "/dashboard/freelancer/profili" },
    { label: "Shërbimet", href: "/dashboard/freelancer/sherbime" },
    { label: "Zonat e punës", href: "/dashboard/freelancer/zonat" },
    { label: "Punët e hapura", href: "/dashboard/freelancer/punet" },
    { label: "Njoftimet", href: "/dashboard/freelancer/njoftimet", badgeKey: "notifications" },
    { label: "Mesazhet", href: "/dashboard/freelancer/mesazhet" },
    { label: "Cilësimet", href: "/dashboard/freelancer/cilesimet" },
  ],
  klient: [
    { label: "Paneli", href: "/dashboard/klient" },
    { label: "Profili", href: "/dashboard/klient/profili" },
    { label: "Kërko profesionistë", href: "/profesionistet" },
    { label: "Kërkesat e mia", href: "/dashboard/klient/kerkesat" },
    { label: "Njoftimet", href: "/dashboard/klient/njoftimet", badgeKey: "notifications" },
    { label: "Mesazhet", href: "/dashboard/klient/mesazhet" },
    { label: "Cilësimet", href: "/dashboard/klient/cilesimet" },
  ],
};

const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrator",
  freelancer: "Profesionist",
  klient: "Klient",
};

export function DashboardSidebar() {
  const { user, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (!user) return null;
  const items = NAV_ITEMS[user.role];

  function badgeFor(key?: string): number {
    if (key === "notifications") return unreadCount;
    return 0;
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-line bg-surface sticky top-0 z-20">
        <Logo size={26} />
        <button
          aria-label="Menu"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-line hover:bg-surface-2"
        >
          <span className="block w-4 h-px bg-ink mb-1" />
          <span className="block w-4 h-px bg-ink mb-1" />
          <span className="block w-4 h-px bg-ink" />
        </button>
      </header>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-ink/30 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar (drawer on mobile, static on desktop) */}
      <aside
        className={[
          "fixed lg:sticky inset-y-0 left-0 z-40 lg:z-0",
          "w-64 lg:w-60 bg-surface border-r border-line",
          "flex flex-col h-screen lg:h-screen lg:top-0",
          "transform transition-transform lg:transform-none",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="px-5 py-5 border-b border-line flex items-center justify-between">
          <Logo size={28} />
          <button
            onClick={() => setOpen(false)}
            aria-label="Mbyll"
            className="lg:hidden text-ink-muted hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-3 border-b border-line">
          <div className="text-[10px] uppercase tracking-wider text-stone">
            Roli
          </div>
          <div className="text-sm font-medium text-ink mt-0.5">
            {ROLE_LABEL[user.role]}
          </div>
        </div>

        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <NavLink
                key={item.href}
                item={item}
                active={active}
                badge={badgeFor(item.badgeKey)}
                onClick={() => setOpen(false)}
              />
            );
          })}
        </nav>

        <div className="border-t border-line p-3 space-y-2">
          <div className="px-3 py-1.5">
            <div className="text-sm font-medium text-ink truncate">
              {user.full_name}
            </div>
            <div className="text-xs text-stone truncate">{user.email}</div>
          </div>
          <button
            onClick={() => {
              signOut();
              router.push("/hyr");
            }}
            className="w-full text-left px-3 py-1.5 text-sm text-ink-muted hover:text-ink hover:bg-surface-2 rounded-md transition"
          >
            Dil
          </button>
        </div>
      </aside>
    </>
  );
}

function NavLink({
  item,
  active,
  badge = 0,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  badge?: number;
  onClick: () => void;
}) {
  const cls = [
    "group flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition relative",
    active
      ? "bg-surface-2 text-ink font-medium"
      : "text-ink-muted hover:text-ink hover:bg-surface-2",
    item.soon ? "opacity-60" : "",
  ].join(" ");

  const inner = (
    <>
      {active && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-forest" />
      )}
      <span className="flex-1">{item.label}</span>
      {badge > 0 && !item.soon && (
        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-forest text-white text-[10px] font-medium numeric">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
      {item.soon && (
        <span className="text-[9px] uppercase tracking-wider text-stone">
          Soon
        </span>
      )}
    </>
  );

  if (item.soon) {
    return <span className={cls}>{inner}</span>;
  }
  return (
    <Link href={item.href} className={cls} onClick={onClick}>
      {inner}
    </Link>
  );
}
