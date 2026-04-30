"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError, dashboardPathFor, type Role } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";

type SignupRole = "freelancer" | "klient";

export default function RegisterPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { signIn } = useAuth();

  const initialRole: SignupRole =
    params.get("role") === "freelancer" ? "freelancer" : "klient";

  const [role, setRole] = useState<SignupRole>(initialRole);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    company_name: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const r = params.get("role");
    if (r === "freelancer" || r === "klient") setRole(r);
  }, [params]);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const payload = {
        ...form,
        role,
        ...(role === "klient" ? { company_name: undefined } : {}),
      };
      const { user, tokens } = await api.register(payload);
      signIn(user, tokens.access, tokens.refresh);
      router.push(dashboardPathFor(user.role as Role));
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
      <h1 className="font-display text-4xl text-ink">Krijoni llogarinë tuaj.</h1>
      <p className="mt-2 text-stone">
        Pa pagesë. Pa angazhim. Filloni në më pak se një minutë.
      </p>

      <RoleTabs value={role} onChange={setRole} />

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
        {errors.detail && (
          <div className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {errors.detail}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Emri"
            name="first_name"
            autoComplete="given-name"
            required
            value={form.first_name}
            onChange={(e) => update("first_name", e.target.value)}
            error={errors.first_name}
          />
          <Field
            label="Mbiemri"
            name="last_name"
            autoComplete="family-name"
            required
            value={form.last_name}
            onChange={(e) => update("last_name", e.target.value)}
            error={errors.last_name}
          />
        </div>

        <Field
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          error={errors.email}
        />

        <Field
          label="Numri i telefonit"
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder="+355 ..."
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          error={errors.phone}
          hint={role === "freelancer" ? "Klientët do t’ju kontaktojnë në këtë numër." : undefined}
        />

        {role === "freelancer" && (
          <Field
            label="Emri i kompanisë"
            name="company_name"
            autoComplete="organization"
            placeholder="Opsionale — nëse punoni si kompani"
            value={form.company_name}
            onChange={(e) => update("company_name", e.target.value)}
            error={errors.company_name}
            hint="Lëre bosh nëse punon si individ."
          />
        )}

        <Field
          label="Fjalëkalimi"
          type="password"
          name="password"
          autoComplete="new-password"
          required
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          error={errors.password}
          hint="Të paktën 8 karaktere."
        />

        <Button
          type="submit"
          fullWidth
          disabled={submitting}
          className="mt-2 py-3"
        >
          {submitting ? "Duke krijuar..." : "Krijo llogarinë"}
        </Button>
      </form>

      <p className="mt-8 text-sm text-stone">
        Keni tashmë llogari?{" "}
        <Link href="/hyr" className="text-forest font-medium hover:underline">
          Hyni këtu
        </Link>
      </p>
    </div>
  );
}

function RoleTabs({
  value,
  onChange,
}: {
  value: SignupRole;
  onChange: (v: SignupRole) => void;
}) {
  const tab = (
    key: SignupRole,
    title: string,
    subtitle: string,
  ) => {
    const active = value === key;
    return (
      <button
        type="button"
        onClick={() => onChange(key)}
        className={[
          "flex-1 text-left px-4 py-3 rounded-lg border transition",
          active
            ? "border-forest bg-forest/5 ring-1 ring-forest/20"
            : "border-line bg-white hover:border-stone/40",
        ].join(" ")}
      >
        <div
          className={[
            "text-sm font-medium",
            active ? "text-forest" : "text-ink",
          ].join(" ")}
        >
          {title}
        </div>
        <div className="text-xs text-stone mt-0.5">{subtitle}</div>
      </button>
    );
  };

  return (
    <div className="mt-6 flex gap-3">
      {tab("klient", "Jam Klient", "Kërkoj një profesionist")}
      {tab("freelancer", "Jam Profesionist", "Ofroj shërbime")}
    </div>
  );
}
