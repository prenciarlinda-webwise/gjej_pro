import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Field({ label, error, hint, id, className, ...rest }: FieldProps) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-xs font-medium uppercase tracking-wider text-ink-muted"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={[
          "w-full rounded-md border bg-surface px-3 py-2 text-sm text-ink",
          "placeholder:text-stone/70",
          "transition",
          error
            ? "border-danger focus:border-danger"
            : "border-line focus:border-forest",
          "focus:outline-none focus:ring-2 focus:ring-forest/15",
          className ?? "",
        ].join(" ")}
        {...rest}
      />
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-stone">{hint}</p>
      ) : null}
    </div>
  );
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function TextareaField({
  label,
  error,
  hint,
  id,
  className,
  ...rest
}: TextareaFieldProps) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-xs font-medium uppercase tracking-wider text-ink-muted"
      >
        {label}
      </label>
      <textarea
        id={inputId}
        className={[
          "w-full rounded-md border bg-surface px-3 py-2 text-sm text-ink",
          "placeholder:text-stone/70 resize-y min-h-24",
          "transition",
          error
            ? "border-danger focus:border-danger"
            : "border-line focus:border-forest",
          "focus:outline-none focus:ring-2 focus:ring-forest/15",
          className ?? "",
        ].join(" ")}
        {...rest}
      />
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-stone">{hint}</p>
      ) : null}
    </div>
  );
}
