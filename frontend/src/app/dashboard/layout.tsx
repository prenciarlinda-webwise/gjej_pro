"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { UnverifiedEmailBanner } from "@/components/UnverifiedEmailBanner";
import { useAuth } from "@/lib/auth-context";
import { dashboardPathFor } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.replace("/hyr");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-stone">Po ngarkohet…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 px-5 sm:px-8 lg:px-10 py-8 lg:py-10">
          <div className="max-w-5xl mx-auto space-y-6">
            {!user.is_email_verified && (
              <UnverifiedEmailBanner email={user.email} />
            )}
            <RoleGuard expectedRolePath={dashboardPathFor(user.role)}>
              {children}
            </RoleGuard>
          </div>
        </main>
      </div>
    </div>
  );
}

function RoleGuard({
  expectedRolePath,
  children,
}: {
  expectedRolePath: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.location.pathname.startsWith(expectedRolePath)) {
      router.replace(expectedRolePath);
    }
  }, [expectedRolePath, router]);
  return <>{children}</>;
}
