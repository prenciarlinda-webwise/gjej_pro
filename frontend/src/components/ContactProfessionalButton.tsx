"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/Button";

export function ContactProfessionalButton({
  freelancerUserId,
  freelancerSlug,
}: {
  freelancerUserId: number;
  freelancerSlug: string;
}) {
  const router = useRouter();
  const { user } = useAuth();

  function start() {
    if (!user) {
      router.push(`/hyr?next=/profesionist/${freelancerSlug}`);
      return;
    }
    if (user.role !== "klient") {
      alert("Vetëm klientët mund të kontaktojnë profesionistët.");
      return;
    }
    router.push(`/dashboard/klient/mesazhet?peer=${freelancerUserId}`);
  }

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={start}
      disabled={!!user && user.role !== "klient"}
    >
      {user
        ? user.role === "klient"
          ? "Mesazh profesionistin"
          : "Vetëm klientët mund të kontaktojnë"
        : "Hyni për ta kontaktuar"}
    </Button>
  );
}
