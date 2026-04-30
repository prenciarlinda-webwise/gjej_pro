"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api, ApiError, dashboardPathFor } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";

export default function LoginPage() {
  const router = useRouter();
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
        setErrors({ detail: "Diçka shkoi keq. Provoni përsëri." });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-4xl text-ink">Mirë se vini.</h1>
      <p className="mt-2 text-stone">
        Hyni në llogarinë tuaj për të vazhduar.
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        {errors.detail && (
          <div className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {errors.detail}
          </div>
        )}
        <Field
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Field
          label="Fjalëkalimi"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Button
          type="submit"
          fullWidth
          disabled={submitting}
          className="mt-2 py-3"
        >
          {submitting ? "Duke hyrë..." : "Hyr"}
        </Button>
      </form>

      <p className="mt-8 text-sm text-stone">
        Nuk keni llogari?{" "}
        <Link
          href="/regjistrohu"
          className="text-forest font-medium hover:underline"
        >
          Regjistrohuni falas
        </Link>
      </p>
    </div>
  );
}
