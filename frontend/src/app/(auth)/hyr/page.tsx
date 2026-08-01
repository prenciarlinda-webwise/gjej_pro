"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, ApiError, dashboardPathFor } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";

const STRINGS = {
  sq: {
    title: "Mirë se vini.",
    subtitle: "Hyni në llogarinë tuaj për të vazhduar.",
    email: "Email",
    password: "Fjalëkalimi",
    forgot: "Keni harruar fjalëkalimin?",
    submitting: "Duke hyrë...",
    submit: "Hyr",
    noAccount: "Nuk keni llogari?",
    signup: "Regjistrohuni falas",
    genericError: "Diçka shkoi keq. Provoni përsëri.",
  },
  en: {
    title: "Welcome back.",
    subtitle: "Log in to your account to continue.",
    email: "Email",
    password: "Password",
    forgot: "Forgot your password?",
    submitting: "Logging in...",
    submit: "Log in",
    noAccount: "Don't have an account?",
    signup: "Sign up for free",
    genericError: "Something went wrong. Please try again.",
  },
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const locale = params.get("locale") === "en" ? "en" : "sq";
  const t = STRINGS[locale];
  const signupHref = locale === "en" ? "/regjistrohu?locale=en" : "/regjistrohu";
  const forgotHref =
    locale === "en" ? "/harrova-fjalekalimin?locale=en" : "/harrova-fjalekalimin";
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const { user, tokens } = await api.login(email, password);
      signIn(user, tokens.access, tokens.refresh);
      router.push(dashboardPathFor(user.role));
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldErrors: Record<string, string> = {};
        for (const [k, v] of Object.entries(err.fields)) {
          fieldErrors[k] = v[0] ?? "";
        }
        if (!Object.keys(fieldErrors).length) {
          fieldErrors.detail = err.message;
        }
        setErrors(fieldErrors);
      } else {
        setErrors({ detail: t.genericError });
      }
    } finally {
      setSubmitting(false);
    }
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
        {errors.detail && (
          <div className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {errors.detail}
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
          error={errors.email}
        />
        <Field
          label={t.password}
          type="password"
          name="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Link
          href={forgotHref}
          className="-mt-2 self-end text-sm text-forest font-medium hover:underline"
        >
          {t.forgot}
        </Link>
        <Button
          type="submit"
          fullWidth
          disabled={submitting}
          className="mt-2 py-3"
        >
          {submitting ? t.submitting : t.submit}
        </Button>
      </form>

      <p className="mt-8 text-sm text-stone">
        {t.noAccount}{" "}
        <Link
          href={signupHref}
          className="text-forest font-medium hover:underline"
        >
          {t.signup}
        </Link>
      </p>
    </div>
  );
}
