"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api, ApiError, dashboardPathFor, type Role } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";

type SignupRole = "freelancer" | "klient";

const STRINGS = {
  sq: {
    title: "Krijoni llogarinë tuaj.",
    subtitle: "Pa pagesë. Pa angazhim. Filloni në më pak se një minutë.",
    tabClientTitle: "Jam Klient",
    tabClientSubtitle: "Kërkoj një profesionist",
    tabFreelancerTitle: "Jam Profesionist",
    tabFreelancerSubtitle: "Ofroj shërbime",
    firstName: "Emri",
    lastName: "Mbiemri",
    email: "Email",
    phone: "Numri i telefonit",
    phoneHint: "Klientët do t’ju kontaktojnë në këtë numër.",
    companyName: "Emri i kompanisë",
    companyPlaceholder: "Opsionale, nëse punoni si kompani",
    companyHint: "Lëre bosh nëse punon si individ.",
    password: "Fjalëkalimi",
    passwordHint: "Të paktën 8 karaktere.",
    submitting: "Duke krijuar...",
    submit: "Krijo llogarinë",
    hasAccount: "Keni tashmë llogari?",
    login: "Hyni këtu",
    genericError: "Diçka shkoi keq. Provoni përsëri.",
  },
  en: {
    title: "Create your account.",
    subtitle: "Free. No commitment. Get started in under a minute.",
    tabClientTitle: "I'm a Client",
    tabClientSubtitle: "I'm looking for a professional",
    tabFreelancerTitle: "I'm a Professional",
    tabFreelancerSubtitle: "I offer services",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone number",
    phoneHint: "Clients will contact you on this number.",
    companyName: "Company name",
    companyPlaceholder: "Optional, if you work as a company",
    companyHint: "Leave blank if you work as an individual.",
    password: "Password",
    passwordHint: "At least 8 characters.",
    submitting: "Creating...",
    submit: "Create account",
    hasAccount: "Already have an account?",
    login: "Log in here",
    genericError: "Something went wrong. Please try again.",
  },
};

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { signIn } = useAuth();
  const locale = params.get("locale") === "en" ? "en" : "sq";
  const t = STRINGS[locale];
  const loginHref = locale === "en" ? "/hyr?locale=en" : "/hyr";

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

      <RoleTabs value={role} onChange={setRole} t={t} />

      <form
        onSubmit={onSubmit}
        autoComplete="off"
        className="mt-6 flex flex-col gap-4"
      >
        {errors.detail && (
          <div className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {errors.detail}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field
            label={t.firstName}
            name="first_name"
            autoComplete="off"
            required
            value={form.first_name}
            onChange={(e) => update("first_name", e.target.value)}
            error={errors.first_name}
          />
          <Field
            label={t.lastName}
            name="last_name"
            autoComplete="off"
            required
            value={form.last_name}
            onChange={(e) => update("last_name", e.target.value)}
            error={errors.last_name}
          />
        </div>

        <Field
          label={t.email}
          type="email"
          name="email"
          autoComplete="off"
          required
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          error={errors.email}
        />

        <Field
          label={t.phone}
          type="tel"
          name="phone"
          autoComplete="off"
          placeholder={locale === "en" ? undefined : "+355 ..."}
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          error={errors.phone}
          hint={role === "freelancer" ? t.phoneHint : undefined}
        />

        {role === "freelancer" && (
          <Field
            label={t.companyName}
            name="company_name"
            autoComplete="off"
            placeholder={t.companyPlaceholder}
            value={form.company_name}
            onChange={(e) => update("company_name", e.target.value)}
            error={errors.company_name}
            hint={t.companyHint}
          />
        )}

        <Field
          label={t.password}
          type="password"
          name="password"
          autoComplete="new-password"
          required
          value={form.password}
          onChange={(e) => update("password", e.target.value)}
          error={errors.password}
          hint={t.passwordHint}
        />

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
        {t.hasAccount}{" "}
        <Link href={loginHref} className="text-forest font-medium hover:underline">
          {t.login}
        </Link>
      </p>
    </div>
  );
}

function RoleTabs({
  value,
  onChange,
  t,
}: {
  value: SignupRole;
  onChange: (v: SignupRole) => void;
  t: (typeof STRINGS)["sq"];
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
      {tab("klient", t.tabClientTitle, t.tabClientSubtitle)}
      {tab("freelancer", t.tabFreelancerTitle, t.tabFreelancerSubtitle)}
    </div>
  );
}
