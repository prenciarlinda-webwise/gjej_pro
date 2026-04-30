import type { ReactNode } from "react";

/**
 * Tiny SVG icon set keyed by Category.icon slug. Stays inline so we don't
 * pull in an icon library; each one is hand-tuned to feel coherent.
 */
const ICONS: Record<string, ReactNode> = {
  bolt: (
    <path d="M13 2 L3 14 L11 14 L11 22 L21 10 L13 10 Z" />
  ),
  droplet: (
    <path d="M12 3 C 9 7, 5 11, 5 15 a7 7 0 0 0 14 0 C 19 11, 15 7, 12 3 Z" />
  ),
  key: (
    <path d="M14 8 a4 4 0 1 0 -3.46 6 L 14 18 L 16 16 L 14 14 L 17 11 Z M 14 7 a1 1 0 1 1 0.01 0 Z" />
  ),
  "hard-hat": (
    <path d="M4 18 h16 v2 H4 z M 6 16 a 6 6 0 0 1 12 0 H 6 z M 11 6 h 2 v 5 h -2 z" />
  ),
  brush: (
    <path d="M19 3 a2 2 0 0 1 2 2 v6 H11 V7 a4 4 0 0 1 4 -4 z M 8 13 h 5 v 5 a 2.5 2.5 0 0 1 -5 0 z" />
  ),
  hammer: (
    <path d="M14 6 L19 1 L23 5 L18 10 L 16 8 L 6 18 a 2 2 0 0 1 -3 -3 L 13 5 Z" />
  ),
  thermometer: (
    <path d="M11 4 a 2 2 0 0 1 4 0 v 9.5 a 4 4 0 1 1 -4 0 z M 12 13 a 2 2 0 1 0 1 3.7 V 7 h -1 z" />
  ),
  spray: (
    <path d="M9 3 h6 v3 H9 z M 5 8 h 14 v 12 a 2 2 0 0 1 -2 2 H 7 a 2 2 0 0 1 -2 -2 z M 9 12 h 6 v 6 H 9 z" />
  ),
  utensils: (
    <path d="M5 3 v 8 a 2 2 0 0 0 2 2 v 8 h 2 V 3 H 5 z M 17 3 a 4 4 0 0 0 -4 4 v 5 h 3 v 9 h 2 V 3 z" />
  ),
  cake: (
    <path d="M12 3 a1 1 0 0 1 2 0 v 2 a 1 1 0 1 1 -2 0 z M 5 9 h 14 v 5 H 5 z M 4 16 h 16 v 4 H 4 z" />
  ),
  truck: (
    <path d="M3 6 h11 v8 H3 z M 14 9 h4 l 3 3 v 4 h -1 a 2 2 0 1 1 -4 0 h -2 z M 6 17 a 2 2 0 1 1 4 0 a 2 2 0 0 1 -4 0 z" />
  ),
  book: (
    <path d="M5 4 h 9 a 4 4 0 0 1 4 4 v 12 h -13 a 0 0 0 0 1 0 0 z M 8 7 h 7 M 8 10 h 7" />
  ),
  scissors: (
    <path d="M8 6 a 2 2 0 1 1 0.01 0 z M 8 18 a 2 2 0 1 1 0.01 0 z M 9.5 8 L 21 19 M 9.5 16 L 21 5" />
  ),
  monitor: (
    <path d="M3 4 h 18 a 1 1 0 0 1 1 1 v 11 a 1 1 0 0 1 -1 1 H 3 a 1 1 0 0 1 -1 -1 V 5 a 1 1 0 0 1 1 -1 z M 9 20 h 6 M 12 17 v 3" />
  ),
  camera: (
    <path d="M9 4 h 6 l 2 2 h 3 a 1 1 0 0 1 1 1 v 11 a 1 1 0 0 1 -1 1 H 4 a 1 1 0 0 1 -1 -1 V 7 a 1 1 0 0 1 1 -1 h 3 z M 12 16 a 4 4 0 1 1 0 -8 a 4 4 0 0 1 0 8 z" />
  ),
  leaf: (
    <path d="M5 19 c 8 -3, 12 -7, 14 -16 c -8 1, -13 5, -14 12 z M 5 19 l 4 -4" />
  ),
  wrench: (
    <path d="M14 3 a5 5 0 0 1 4 7 L 21 13 L 18 16 L 15 13 a 5 5 0 0 1 -7 -4 z M 14 13 L 5 22 a 1.5 1.5 0 0 1 -2 -2 L 12 11" />
  ),
  spark: (
    <path d="M12 2 v 6 M 12 16 v 6 M 2 12 h 6 M 16 12 h 6 M 5 5 l 4 4 M 15 15 l 4 4 M 5 19 l 4 -4 M 15 9 l 4 -4" />
  ),
};

const FALLBACK = <circle cx="12" cy="12" r="9" />;

export function CategoryIcon({
  slug,
  size = 24,
  className = "",
}: {
  slug: string;
  size?: number;
  className?: string;
}) {
  const path = ICONS[slug] ?? FALLBACK;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
