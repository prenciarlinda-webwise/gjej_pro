/**
 * Reusable decorative backdrops for hero sections. Pure SVG/CSS — no
 * external assets, no broken links. Pick a `variant` per page so the site
 * has visual variety without dropping in stock photos.
 */
type Variant = "warm" | "forest" | "mesh" | "minimal";

const VARIANTS: Record<Variant, { className: string; orbs: Array<{ x: string; y: string; size: number; color: string; opacity: number }> }> = {
  warm: {
    className: "bg-gradient-warm",
    orbs: [
      { x: "85%", y: "10%", size: 280, color: "rgba(46, 125, 91, 0.15)", opacity: 0.7 },
      { x: "-5%", y: "85%", size: 360, color: "rgba(201, 169, 97, 0.18)", opacity: 0.7 },
      { x: "60%", y: "70%", size: 180, color: "rgba(31, 77, 58, 0.10)", opacity: 0.5 },
    ],
  },
  forest: {
    className: "bg-gradient-forest text-white",
    orbs: [
      { x: "90%", y: "15%", size: 320, color: "rgba(255, 255, 255, 0.06)", opacity: 1 },
      { x: "-10%", y: "80%", size: 400, color: "rgba(201, 169, 97, 0.12)", opacity: 1 },
    ],
  },
  mesh: {
    className: "",
    orbs: [
      { x: "10%", y: "0%", size: 320, color: "rgba(46, 125, 91, 0.10)", opacity: 0.7 },
      { x: "85%", y: "25%", size: 280, color: "rgba(201, 169, 97, 0.10)", opacity: 0.7 },
      { x: "50%", y: "85%", size: 220, color: "rgba(31, 77, 58, 0.06)", opacity: 0.6 },
    ],
  },
  minimal: {
    className: "bg-surface",
    orbs: [
      { x: "92%", y: "10%", size: 220, color: "rgba(31, 77, 58, 0.06)", opacity: 0.6 },
    ],
  },
};

export function HeroDecoration({
  variant = "warm",
  showGrid = false,
}: {
  variant?: Variant;
  showGrid?: boolean;
}) {
  const conf = VARIANTS[variant];
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none ${conf.className}`}
    >
      {conf.orbs.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: o.x,
            top: o.y,
            width: o.size,
            height: o.size,
            transform: "translate(-50%, -50%)",
            opacity: o.opacity,
            background: `radial-gradient(closest-side, ${o.color}, transparent)`,
          }}
        />
      ))}
      {showGrid && (
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity: 0.4 }}
        >
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(11,16,20,0.04)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      )}
    </div>
  );
}

/**
 * Decorative dot pattern — useful as a thumbnail or accent background.
 */
export function DotPattern({
  className = "",
  color = "rgba(31, 77, 58, 0.15)",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

/**
 * Decorative line illustration for hero corners — abstract trade tool shape.
 */
export function CornerLines({
  position = "top-right",
  color = "rgba(31, 77, 58, 0.10)",
}: {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  color?: string;
}) {
  const corner = {
    "top-right": "top-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "bottom-left": "bottom-0 left-0",
  }[position];
  return (
    <svg
      aria-hidden="true"
      width="240"
      height="240"
      viewBox="0 0 240 240"
      className={`absolute pointer-events-none ${corner}`}
    >
      <g stroke={color} strokeWidth="1.5" fill="none">
        <circle cx="180" cy="60" r="40" />
        <circle cx="180" cy="60" r="80" />
        <line x1="120" y1="60" x2="220" y2="60" />
        <line x1="180" y1="0" x2="180" y2="120" />
      </g>
    </svg>
  );
}
