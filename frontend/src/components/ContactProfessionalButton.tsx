"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/Button";
import type { UiLocale } from "@/components/PublicHeader";

const STRINGS: Record<UiLocale, {
  onlyClients: string;
  message: string;
  loginToContact: string;
}> = {
  sq: {
    onlyClients: "Vetëm klientët mund të kontaktojnë profesionistët.",
    message: "Mesazh profesionistin",
    loginToContact: "Hyni për ta kontaktuar",
  },
  en: {
    onlyClients: "Only clients can contact professionals.",
    message: "Message the professional",
    loginToContact: "Log in to contact",
  },
};

export function ContactProfessionalButton({
  freelancerUserId,
  freelancerSlug,
  locale = "sq",
}: {
  freelancerUserId: number;
  freelancerSlug: string;
  locale?: UiLocale;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const t = STRINGS[locale];
  const localeSuffix = locale === "en" ? "&locale=en" : "";

  function start() {
    if (!user) {
      router.push(`/hyr?next=/profesionist/${freelancerSlug}${localeSuffix}`);
      return;
    }
    if (user.role !== "klient") {
      alert(t.onlyClients);
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
          ? t.message
          : t.onlyClients
        : t.loginToContact}
    </Button>
  );
}
