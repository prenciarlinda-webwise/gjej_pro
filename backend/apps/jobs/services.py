"""Job-domain side effects (currently: recomputing freelancer rating)."""
from decimal import Decimal

from django.db.models import Avg, Count

from apps.profiles.models import FreelancerProfile

from .models import Review


def recompute_freelancer_rating(profile: FreelancerProfile) -> None:
    """Refresh `avg_rating` and `review_count` from the source-of-truth Reviews."""
    agg = Review.objects.filter(reviewee=profile).aggregate(
        avg=Avg("rating"),
        count=Count("id"),
    )
    profile.avg_rating = (
        Decimal(agg["avg"]).quantize(Decimal("0.01"))
        if agg["avg"] is not None
        else Decimal("0")
    )
    profile.review_count = agg["count"] or 0
    profile.save(update_fields=["avg_rating", "review_count", "updated_at"])
