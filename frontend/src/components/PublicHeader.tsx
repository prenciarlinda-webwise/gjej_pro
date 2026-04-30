"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { useAuth } from "@/lib/auth-context";
import { dashboardPathFor } from "@/lib/api";

export function PublicHeader() {
  const { user, loading } = useAuth();

  return (
    <header className="border-b border-line bg-bg/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between gap-4">
        <Logo size={44} />
        <nav className="flex items-center gap-1.5 flex-wrap justify-end">
          <Link href="/profesionistet" className="hidden sm:inline-block">
            <Button variant="ghost" size="md">
              Profesionistët
            </Button>
          </Link>
          <Link href="/kategorite" className="hidden md:inline-block">
            <Button variant="ghost" size="md">
              Kategoritë
            </Button>
          </Link>
          <Link href="/si-funksionon" className="hidden md:inline-block">
            <Button variant="ghost" size="md">
              Si funksionon
            </Button>
          </Link>
          {!loading && user ? (
            <Link href={dashboardPathFor(user.role)}>
              <Button variant="primary" size="md">
                Paneli
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/hyr">
                <Button variant="ghost" size="md">Hyr</Button>
              </Link>
              <Link href="/regjistrohu">
                <Button variant="primary" size="md">Regjistrohu</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
