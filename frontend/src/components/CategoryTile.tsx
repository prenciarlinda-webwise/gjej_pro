import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";

const TINTS = [
  { bg: "rgba(31, 77, 58, 0.08)",  fg: "#1F4D3A" }, // forest
  { bg: "rgba(46, 125, 91, 0.08)", fg: "#2E7D5B" }, // emerald
  { bg: "rgba(201, 169, 97, 0.10)", fg: "#A88847" }, // gold
  { bg: "rgba(58, 95, 75, 0.10)",  fg: "#3A5F4B" }, // mid-forest
  { bg: "rgba(96, 104, 112, 0.10)", fg: "#3D4148" }, // slate
  { bg: "rgba(168, 136, 71, 0.08)", fg: "#A88847" }, // gold-deep
];

function tintFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return TINTS[Math.abs(hash) % TINTS.length];
}

interface Props {
  slug: string;
  name: string;
  name_en?: string;
  icon: string;
  count?: number;
}

export function CategoryTile({ slug, name, name_en, icon, count }: Props) {
  const tint = tintFor(slug);
  return (
    <Link
      href={`/${slug}`}
      className="card card-link block p-6"
    >
      <div
        className="inline-flex items-center justify-center rounded-2xl"
        style={{
          width: 56,
          height: 56,
          backgroundColor: tint.bg,
          color: tint.fg,
        }}
      >
        <CategoryIcon slug={icon || "monitor"} size={28} />
      </div>

      <h3 className="mt-5 font-display text-xl text-ink leading-tight">
        {name}
      </h3>
      {name_en && (
        <p className="mt-1 text-xs text-stone italic">{name_en}</p>
      )}

      <div className="mt-4 pt-4 border-t border-line/70 flex items-center justify-between">
        <span className="text-xs text-stone numeric">
          {count ? `${count} ${count === 1 ? "profesionist" : "profesionistë"}` : "Të jesh i pari"}
        </span>
        <span className="text-xs text-forest font-medium">
          Shih →
        </span>
      </div>
    </Link>
  );
}
