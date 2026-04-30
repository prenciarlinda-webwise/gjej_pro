import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-forest text-white hover:bg-forest-deep active:bg-forest-deep disabled:bg-line-strong disabled:text-stone",
  secondary:
    "bg-surface text-ink border border-line hover:border-line-strong hover:bg-surface-2 disabled:opacity-50",
  ghost:
    "bg-transparent text-ink hover:bg-surface-2 disabled:opacity-50",
  danger:
    "bg-danger text-white hover:opacity-90 disabled:opacity-50",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-2",
        "rounded-md font-medium tracking-tight",
        "transition-colors disabled:cursor-not-allowed",
        fullWidth ? "w-full" : "",
        variantStyles[variant],
        sizeStyles[size],
        className ?? "",
      ].join(" ")}
      {...rest}
    >
      {children}
    </button>
  );
}
