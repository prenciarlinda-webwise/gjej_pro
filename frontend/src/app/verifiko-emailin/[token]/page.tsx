"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";

type State =
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "already" }
  | { kind: "error"; message: string };

export default function VerifyEmailPage() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const { user, refresh } = useAuth();
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    if (!token) return;

    api
      .verifyEmail(token)
      .then(async (res) => {
        if (cancelled) return;
        if (res.already) {
          setState({ kind: "already" });
        } else {
          setState({ kind: "success", message: res.detail });
        }
        // If the user is signed in, refresh `me` so banners update.
        await refresh();
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = err instanceof ApiError ? err.message : "Linku nuk u verifikua.";
        setState({ kind: "error", message: msg });
      });

    return () => {
      cancelled = true;
    };
  }, [token, refresh]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 sm:px-10 py-5 border-b border-line">
        <Logo size={32} />
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          {state.kind === "loading" && (
            <>
              <div className="font-display text-3xl text-ink">
                Po verifikohet…
              </div>
              <p className="mt-3 text-stone">
                Po e konfirmojmë linkun tuaj.
              </p>
            </>
          )}

          {state.kind === "success" && (
            <>
              <Badge tone="success">✓ Verifikuar</Badge>
              <h1 className="mt-4 font-display text-3xl text-ink">
                Emaili juaj u verifikua.
              </h1>
              <p className="mt-3 text-stone">{state.message}</p>
              <NextStep user={user} />
            </>
          )}

          {state.kind === "already" && (
            <>
              <Badge tone="info">Tashmë i verifikuar</Badge>
              <h1 className="mt-4 font-display text-3xl text-ink">
                Emaili juaj është verifikuar tashmë.
              </h1>
              <p className="mt-3 text-stone">
                Mund ta përdorni llogarinë tuaj normalisht.
              </p>
              <NextStep user={user} />
            </>
          )}

          {state.kind === "error" && (
            <>
              <Badge tone="danger">Linku nuk është i vlefshëm</Badge>
              <h1 className="mt-4 font-display text-3xl text-ink">
                Nuk arritëm ta verifikojmë emailin.
              </h1>
              <p className="mt-3 text-stone">{state.message}</p>
              <p className="mt-4 text-sm text-stone">
                Hyni në llogarinë tuaj dhe klikoni «Dërgo përsëri» nga banneri
                në krye të faqes.
              </p>
              <Link href="/hyr" className="mt-6 inline-block">
                <Button variant="primary">Hyr</Button>
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function NextStep({ user }: { user: ReturnType<typeof useAuth>["user"] }) {
  return (
    <Link
      href={user ? `/dashboard/${user.role}` : "/hyr"}
      className="mt-6 inline-block"
    >
      <Button variant="primary">
        {user ? "Shko te paneli" : "Hyr në llogari"}
      </Button>
    </Link>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: "success" | "info" | "danger";
  children: React.ReactNode;
}) {
  const cls =
    tone === "success"
      ? "bg-forest text-white"
      : tone === "info"
      ? "bg-surface-2 text-forest border border-line"
      : "bg-danger/10 text-danger border border-danger/30";
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium tracking-wide ${cls}`}
    >
      {children}
    </span>
  );
}
