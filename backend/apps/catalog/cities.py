"""City → coordinates lookup so ServiceAreas auto-geocode on save.

Coordinates are city-center approximations (lat, lng) — accurate enough for
'near me' radius search. Replace with a proper geocoding API later if the
business needs street-level precision.
"""
from typing import Optional


# City name (lowercased, NFKD-stripped via lower()) → (lat, lng)
ALBANIAN_CITY_COORDS: dict[str, tuple[float, float]] = {
    "tiranë":      (41.3275, 19.8189),
    "tirane":      (41.3275, 19.8189),
    "durrës":      (41.3231, 19.4414),
    "durres":      (41.3231, 19.4414),
    "vlorë":       (40.4660, 19.4900),
    "vlore":       (40.4660, 19.4900),
    "elbasan":     (41.1125, 20.0822),
    "shkodër":     (42.0683, 19.5126),
    "shkoder":     (42.0683, 19.5126),
    "fier":        (40.7239, 19.5567),
    "korçë":       (40.6186, 20.7808),
    "korce":       (40.6186, 20.7808),
    "berat":       (40.7058, 19.9522),
    "lushnjë":     (40.9419, 19.7050),
    "lushnje":     (40.9419, 19.7050),
    "pogradec":    (40.9028, 20.6500),
    "kavajë":      (41.1856, 19.5567),
    "kavaje":      (41.1856, 19.5567),
    "lezhë":       (41.7831, 19.6433),
    "lezhe":       (41.7831, 19.6433),
    "sarandë":     (39.8756, 20.0050),
    "sarande":     (39.8756, 20.0050),
    "kukës":       (42.0775, 20.4225),
    "kukes":       (42.0775, 20.4225),
    "gjirokastër": (40.0758, 20.1397),
    "gjirokaster": (40.0758, 20.1397),
    "patos":       (40.6831, 19.6217),
    "krujë":       (41.5089, 19.7944),
    "kruje":       (41.5089, 19.7944),
    "kuçovë":      (40.8003, 19.9131),
    "kucove":      (40.8003, 19.9131),
}


def lookup_city(name: str) -> Optional[tuple[float, float]]:
    """Return (lat, lng) for a known Albanian city name, or None."""
    if not name:
        return None
    return ALBANIAN_CITY_COORDS.get(name.strip().lower())


# Slug (ASCII, no diacritics) → canonical Albanian city name (with diacritics).
# Used to translate URL slugs back to the city name stored in service_areas.
SLUG_TO_CITY: dict[str, str] = {
    "tirane":       "Tiranë",
    "durres":       "Durrës",
    "vlore":        "Vlorë",
    "elbasan":      "Elbasan",
    "shkoder":      "Shkodër",
    "fier":         "Fier",
    "korce":        "Korçë",
    "berat":        "Berat",
    "lushnje":      "Lushnjë",
    "pogradec":     "Pogradec",
    "kavaje":       "Kavajë",
    "lezhe":        "Lezhë",
    "sarande":      "Sarandë",
    "kukes":        "Kukës",
    "gjirokaster":  "Gjirokastër",
    "patos":        "Patos",
    "kruje":        "Krujë",
    "kucove":       "Kuçovë",
}


def canonical_city(name_or_slug: str) -> str:
    """Best-effort: return the canonical (with-diacritics) Albanian city name.

    Accepts either the full name (already with or without diacritics) or a slug.
    Falls back to the input unchanged if no mapping exists.
    """
    if not name_or_slug:
        return ""
    raw = name_or_slug.strip()
    if raw in SLUG_TO_CITY:
        return SLUG_TO_CITY[raw]
    lower = raw.lower()
    if lower in SLUG_TO_CITY:
        return SLUG_TO_CITY[lower]
    return raw
