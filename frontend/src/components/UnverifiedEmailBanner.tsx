"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";

export function UnverifiedEmailBanner({ email }: { email: string }) {
  const [state, setState] = useState<
    { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; msg: string }
  >({ kind: "idle" });

  async function resend() {
    setState({ kind: "sending" });
    try {
      await api.resendVerification();
      setState({ kind: "sent" });
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Gabim gjatë dërgimit.";
      setState({ kind: "error", msg });
    }
  }

  return (
    <div className="rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-ink">
        <span className="font-medium">Verifikoni emailin tuaj.</span>{" "}
        Ju kemi dërguar një link verifikimi në{" "}
        <span className="font-medium">{email}</span>.
      </div>
      <div className="flex items-center gap-3">
        {state.kind === "sent" && (
          <span className="text-sm text-forest font-medium">Email u dërgua ✓</span>
        )}
        {state.kind === "error" && (
          <span className="text-sm text-danger">{state.msg}</span>
        )}
        <button
          onClick={resend}
          disabled={state.kind === "sending" || state.kind === "sent"}
          className="text-sm font-medium text-forest hover:underline disabled:text-stone disabled:no-underline"
        >
          {state.kind === "sending" ? "Po dërgohet…" : "Dërgo përsëri"}
        </button>
      </div>
    </div>
  );
}
