"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";

const STRINGS = {
  sq: {
    sentTitle: "Kontrolloni emailin.",
    sentBody:
      "Nëse ky email ekziston, ju kemi dërguar një link për rivendosjen e fjalëkalimit. Linku skadon për 1 orë.",
    backToLogin: "Kthehu te hyrja",
    title: "Keni harruar fjalëkalimin?",
    subtitle: "Vendosni emailin tuaj dhe do t’ju dërgojmë një link për ta rivendosur.",
    email: "Email",
    submitting: "Duke dërguar...",
    submit: "Dërgo linkun",
    remembered: "E kujtuat fjalëkalimin?",
    login: "Hyni këtu",
    genericError: "Diçka shkoi keq. Provoni përsëri.",
  },
  en: {
    sentTitle: "Check your email.",
    sentBody:
      "If this email exists, we've sent you a link to reset your password. The link expires in 1 hour.",
    backToLogin: "Back to login",
    title: "Forgot your password?",
    subtitle: "Enter your email and we'll send you a link to reset it.",
    email: "Email",
    submitting: "Sending...",
    submit: "Send link",
    remembered: "Remembered your password?",
    login: "Log in here",
    genericError: "Something went wrong. Please try again.",
  },
};

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordForm />
    </Suspense>
  );
}

function ForgotPasswordForm() {
  const params = useSearchParams();
  const locale = params.get("locale") === "en" ? "en" : "sq";
  const t = STRINGS[locale];
  const loginHref = locale === "en" ? "/hyr?locale=en" : "/hyr";

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.genericError);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div>
        <h1 className="font-display text-4xl text-ink">{t.sentTitle}</h1>
        <p className="mt-3 text-stone">{t.sentBody}</p>
        <Link href={loginHref} className="mt-8 inline-block">
          <Button variant="secondary">{t.backToLogin}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">{t.title}</h1>
      <p className="mt-2 text-stone">{t.subtitle}</p>

      <form
        onSubmit={onSubmit}
        autoComplete="off"
        className="mt-8 flex flex-col gap-4"
      >
        {error && (
          <div className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}
        <Field
          label={t.email}
          type="email"
          name="email"
          autoComplete="off"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" fullWidth disabled={submitting} className="mt-2 py-3">
          {submitting ? t.submitting : t.submit}
        </Button>
      </form>

      <p className="mt-8 text-sm text-stone">
        {t.remembered}{" "}
        <Link href={loginHref} className="text-forest font-medium hover:underline">
          {t.login}
        </Link>
      </p>
    </div>
  );
}
