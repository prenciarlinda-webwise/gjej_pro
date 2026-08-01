"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";

const STRINGS = {
  sq: {
    mismatch: "Fjalëkalimet nuk përputhen.",
    genericError: "Diçka shkoi keq. Provoni përsëri.",
    successTitle: "Fjalëkalimi u ndryshua.",
    successBody: "Mund të hyni tani në llogarinë tuaj me fjalëkalimin e ri.",
    loginNow: "Hyr tani",
    title: "Vendosni fjalëkalim të ri.",
    subtitle: "Zgjidhni një fjalëkalim të ri për llogarinë tuaj.",
    newPassword: "Fjalëkalimi i ri",
    passwordHint: "Të paktën 8 karaktere.",
    confirmPassword: "Përsërisni fjalëkalimin",
    submitting: "Duke ruajtur...",
    submit: "Ruaj fjalëkalimin",
  },
  en: {
    mismatch: "Passwords don't match.",
    genericError: "Something went wrong. Please try again.",
    successTitle: "Password changed.",
    successBody: "You can now log in to your account with your new password.",
    loginNow: "Log in now",
    title: "Set a new password.",
    subtitle: "Choose a new password for your account.",
    newPassword: "New password",
    passwordHint: "At least 8 characters.",
    confirmPassword: "Confirm password",
    submitting: "Saving...",
    submit: "Save password",
  },
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const params = useParams<{ token: string }>();
  const token = params.token;
  const searchParams = useSearchParams();
  const locale = searchParams.get("locale") === "en" ? "en" : "sq";
  const t = STRINGS[locale];
  const loginHref = locale === "en" ? "/hyr?locale=en" : "/hyr";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: t.mismatch });
      return;
    }

    setSubmitting(true);
    try {
      await api.confirmPasswordReset(token, password);
      setSuccess(true);
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

  if (success) {
    return (
      <div>
        <h1 className="font-display text-4xl text-ink">{t.successTitle}</h1>
        <p className="mt-3 text-stone">{t.successBody}</p>
        <Link href={loginHref} className="mt-8 inline-block">
          <Button variant="primary">{t.loginNow}</Button>
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
        {errors.detail && (
          <div className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {errors.detail}
          </div>
        )}
        <Field
          label={t.newPassword}
          type="password"
          name="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          hint={t.passwordHint}
        />
        <Field
          label={t.confirmPassword}
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />
        <Button type="submit" fullWidth disabled={submitting} className="mt-2 py-3">
          {submitting ? t.submitting : t.submit}
        </Button>
      </form>
    </div>
  );
}
