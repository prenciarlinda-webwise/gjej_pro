"use client";

import { useState } from "react";

export function RateWarningBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="rounded-lg border border-gold/40 bg-gold/10 px-4 py-3 flex items-start justify-between gap-3">
      <p className="text-sm text-ink">
        Ky çmim është dukshëm nën mesataren e tregut për këtë shërbim në këtë
        zonë. Shumë profesionistë sakrifikojnë kohën me familjen për t’u
        siguruar fëmijëve një ditë më të mirë, arsim dhe një shtëpi më të mirë
        — mbajeni parasysh.
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Mbyll"
        className="shrink-0 text-stone hover:text-ink"
      >
        ✕
      </button>
    </div>
  );
}
