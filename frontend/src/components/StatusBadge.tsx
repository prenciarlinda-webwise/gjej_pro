import type { JobStatus, QuoteStatus } from "@/lib/api";

const TONE: Record<string, string> = {
  open: "bg-emerald/10 text-emerald border-emerald/30",
  in_progress: "bg-forest/10 text-forest border-forest/30",
  completed: "bg-surface-2 text-ink-muted border-line",
  cancelled: "bg-danger/10 text-danger border-danger/30",
  pending: "bg-emerald/10 text-emerald border-emerald/30",
  accepted: "bg-forest text-white border-forest",
  rejected: "bg-surface-2 text-stone border-line",
  withdrawn: "bg-surface-2 text-stone border-line",
};

const LABELS: Record<JobStatus | QuoteStatus, string> = {
  open: "E hapur",
  in_progress: "Në proces",
  completed: "Përfunduar",
  cancelled: "Anuluar",
  pending: "Në pritje",
  accepted: "Pranuar",
  rejected: "Refuzuar",
  withdrawn: "Tërhequr",
};

export function StatusBadge({
  status,
  label,
}: {
  status: JobStatus | QuoteStatus;
  label?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider rounded-md border px-2 py-0.5 ${TONE[status] ?? ""}`}
    >
      {label ?? LABELS[status] ?? status}
    </span>
  );
}
