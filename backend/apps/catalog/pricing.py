"""Live market-rate benchmarks per category + area.

Powers a non-blocking "you're pricing way below market" warning on the
frontend — computed on the fly from real `Service` listings and `Quote`
submissions, not a static admin-maintained table.
"""
from decimal import Decimal

import statistics

from apps.jobs.models import Quote

from .cities import canonical_city
from .models import Service

MIN_SAMPLE_SIZE = 5
# A price below (WARNING_RATIO * p25) is "way below" market; anywhere between
# the median and a bit under p25 stays silent, so a small undercut is fine.
WARNING_RATIO = 0.6


def _quote_prices(category_id, currency, *, city=None, country=None):
    qs = (
        Quote.objects
        .exclude(status=Quote.Status.WITHDRAWN)
        .filter(job__category_id=category_id, currency=currency)
    )
    if city:
        qs = qs.filter(job__city__iexact=city)
    elif country:
        qs = qs.filter(job__country=country)
    return list(qs.values_list("price", flat=True))


def _service_prices(category_id, currency, *, city=None, country=None):
    qs = (
        Service.objects
        .filter(category_id=category_id, is_active=True, currency=currency)
        .exclude(pricing_model=Service.PricingModel.QUOTE)
    )
    if city:
        qs = qs.filter(freelancer__service_areas__city__iexact=city)
    elif country:
        qs = qs.filter(freelancer__service_areas__country=country)

    points = []
    for price_min, price_max in qs.values_list("price_min", "price_max"):
        if price_min is not None and price_max is not None:
            points.append((price_min + price_max) / 2)
        elif price_min is not None:
            points.append(price_min)
        elif price_max is not None:
            points.append(price_max)
    return points


def _sample(category_id, currency, **scope_kwargs) -> list[Decimal]:
    return (
        _quote_prices(category_id, currency, **scope_kwargs)
        + _service_prices(category_id, currency, **scope_kwargs)
    )


def compute_rate_benchmark(category_id, city: str, country: str, currency: str = "ALL") -> dict:
    """Returns market-rate stats for a category, scoped as tightly as the
    data allows (city → country → global), or `scope: "insufficient"` if
    even a global sample is too thin to say anything meaningful."""
    city = canonical_city(city) if city else ""
    country = (country or "").upper()
    currency = (currency or "ALL").upper()

    scopes = []
    if city:
        scopes.append(("city", {"city": city}))
    if country:
        scopes.append(("country", {"country": country}))
    scopes.append(("global", {}))

    for scope_name, scope_kwargs in scopes:
        prices = _sample(category_id, currency, **scope_kwargs)
        if len(prices) >= MIN_SAMPLE_SIZE:
            floats = sorted(float(p) for p in prices)
            return {
                "currency": currency,
                "sample_size": len(floats),
                "median": round(statistics.median(floats), 2),
                "p25": round(statistics.quantiles(floats, n=4)[0], 2),
                "scope": scope_name,
            }

    return {
        "currency": currency,
        "sample_size": 0,
        "median": None,
        "p25": None,
        "scope": "insufficient",
    }
