import Image from "next/image";

const COLORS = [
  "#1F4D3A", "#2E7D5B", "#143527", "#3A5F4B",
  "#5C615F", "#3D4148", "#7A8478", "#605F45",
];

function colorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function initialsOf(name: string): string {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
  ring?: boolean;
}

export function Avatar({
  name,
  src,
  size = 40,
  className = "",
  ring = false,
}: AvatarProps) {
  const px = size;
  const ringClass = ring ? "ring-2 ring-white shadow-sm" : "";
  const initials = initialsOf(name);
  const bg = colorFor(name || "?");
  const fontSize = Math.max(11, Math.round(px * 0.4));

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full overflow-hidden text-white font-medium select-none shrink-0 ${ringClass} ${className}`}
      style={{
        width: px,
        height: px,
        backgroundColor: bg,
        fontSize,
        letterSpacing: "-0.01em",
      }}
      aria-label={name}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          width={px}
          height={px}
          className="w-full h-full object-cover"
        />
      ) : (
        initials
      )}
    </span>
  );
}

// Optional helper for square cover-style avatars (used in card heroes)
export function AvatarCover({
  name,
  src,
  className = "",
}: {
  name: string;
  src?: string | null;
  className?: string;
}) {
  const initials = initialsOf(name);
  const bg = colorFor(name || "?");
  return (
    <div
      className={`w-full aspect-[4/3] flex items-center justify-center text-white font-display ${className}`}
      style={{ backgroundColor: bg }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span style={{ fontSize: "3rem", letterSpacing: "-0.04em" }}>
          {initials}
        </span>
      )}
    </div>
  );
}

// Used to decorate a quoted user (like a chat bubble or testimonial)
void Image; // (Image is reserved for a future next/image migration)
