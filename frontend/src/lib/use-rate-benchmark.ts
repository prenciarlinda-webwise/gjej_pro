"use client";

import { useEffect, useState } from "react";
import { api, type RateBenchmark } from "@/lib/api";

const DEBOUNCE_MS = 400;
const WARNING_RATIO = 0.6;

export function useRateBenchmark(params: {
  category?: string;
  city?: string;
  country?: string;
  currency?: string;
}) {
  const { category, city, country, currency } = params;
  const [benchmark, setBenchmark] = useState<RateBenchmark | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!category) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      api
        .getRateBenchmark({ category, city, country, currency })
        .then((res) => {
          if (!cancelled) setBenchmark(res);
        })
        .catch(() => {
          if (!cancelled) setBenchmark(null);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, DEBOUNCE_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [category, city, country, currency]);

  return {
    benchmark: category ? benchmark : null,
    loading: category ? loading : false,
  };
}

export function isBelowMarket(
  price: number | string | undefined | null,
  benchmark: RateBenchmark | null,
): boolean {
  if (!benchmark || benchmark.scope === "insufficient" || benchmark.p25 == null) {
    return false;
  }
  const n = typeof price === "string" ? parseFloat(price) : price;
  if (n == null || Number.isNaN(n) || n <= 0) return false;
  return n < WARNING_RATIO * benchmark.p25;
}
