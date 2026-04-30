"use client";

import { useState } from "react";

export function StarRating({
  value,
  onChange,
  size = 22,
  readOnly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div
      className="inline-flex items-center gap-0.5"
      onMouseLeave={() => setHover(null)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          aria-label={`${n} ${n === 1 ? "yll" : "yje"}`}
          onMouseEnter={() => !readOnly && setHover(n)}
          onClick={() => !readOnly && onChange?.(n)}
          className={[
            "p-0.5",
            readOnly ? "cursor-default" : "cursor-pointer",
          ].join(" ")}
          style={{ lineHeight: 0 }}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={n <= display ? "var(--color-gold)" : "transparent"}
            stroke="var(--color-gold)"
            strokeWidth="1.5"
            className="transition-colors"
          >
            <path d="M12 2 L14.5 9 L22 9 L16 13.5 L18.5 21 L12 16.5 L5.5 21 L8 13.5 L2 9 L9.5 9 Z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export function ReadOnlyStars({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={n <= rating ? "var(--color-gold)" : "transparent"}
          stroke="var(--color-gold)"
          strokeWidth="1.5"
        >
          <path d="M12 2 L14.5 9 L22 9 L16 13.5 L18.5 21 L12 16.5 L5.5 21 L8 13.5 L2 9 L9.5 9 Z" />
        </svg>
      ))}
    </span>
  );
}
