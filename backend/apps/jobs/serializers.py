from rest_framework import serializers

from apps.catalog.models import Category
from apps.catalog.serializers import CategorySerializer

from .models import JobRequest, Quote, Review


# ---------------------------------------------------------------------------
# Quotes
# ---------------------------------------------------------------------------

class QuoteOnJobSerializer(serializers.ModelSerializer):
    """Quote as viewed by the klient looking at their job."""
    freelancer_id = serializers.IntegerField(source="freelancer.user.id", read_only=True)
    freelancer_name = serializers.CharField(source="freelancer.user.full_name", read_only=True)
    freelancer_headline = serializers.CharField(source="freelancer.headline", read_only=True)
    freelancer_avg_rating = serializers.DecimalField(
        source="freelancer.avg_rating", max_digits=3, decimal_places=2, read_only=True,
    )
    freelancer_review_count = serializers.IntegerField(
        source="freelancer.review_count", read_only=True,
    )
    freelancer_is_verified = serializers.BooleanField(
        source="freelancer.is_verified", read_only=True,
    )
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Quote
        fields = (
            "id", "price", "currency", "message", "status", "status_label",
            "created_at",
            "freelancer_id", "freelancer_name", "freelancer_headline",
            "freelancer_avg_rating", "freelancer_review_count",
            "freelancer_is_verified",
        )


class MyQuoteSerializer(serializers.ModelSerializer):
    """Quote as viewed by the freelancer who submitted it."""
    job_id = serializers.IntegerField(source="job.id", read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)
    job_status = serializers.CharField(source="job.status", read_only=True)
    job_city = serializers.CharField(source="job.city", read_only=True)
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Quote
        fields = (
            "id", "price", "currency", "message", "status", "status_label",
            "created_at", "updated_at",
            "job_id", "job_title", "job_status", "job_city",
        )


class QuoteWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = ("price", "currency", "message")

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Çmimi duhet të jetë pozitiv.")
        return value


# ---------------------------------------------------------------------------
# Jobs (klient view of their own job)
# ---------------------------------------------------------------------------

class MyJobReadSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    quote_count = serializers.IntegerField(source="quotes.count", read_only=True)
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = JobRequest
        fields = (
            "id", "title", "description",
            "category", "city", "address", "country",
            "budget_min", "budget_max", "currency",
            "status", "status_label",
            "scheduled_at", "created_at", "updated_at",
            "quote_count",
        )


class MyJobDetailSerializer(MyJobReadSerializer):
    quotes = QuoteOnJobSerializer(many=True, read_only=True)
    accepted_quote_id = serializers.IntegerField(read_only=True, allow_null=True)
    my_review = serializers.SerializerMethodField()
    can_review = serializers.SerializerMethodField()

    class Meta(MyJobReadSerializer.Meta):
        fields = MyJobReadSerializer.Meta.fields + (
            "quotes", "accepted_quote_id", "my_review", "can_review",
        )

    def get_my_review(self, obj):
        rev = getattr(obj, "review", None)
        if not rev:
            return None
        return {
            "id": rev.id,
            "rating": rev.rating,
            "comment": rev.comment,
            "created_at": rev.created_at.isoformat(),
        }

    def get_can_review(self, obj) -> bool:
        return (
            obj.status == JobRequest.Status.COMPLETED
            and not getattr(obj, "review", None)
        )


class JobWriteSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.filter(is_active=True),
        source="category",
        write_only=True,
    )

    class Meta:
        model = JobRequest
        fields = (
            "id", "title", "description",
            "category_id", "city", "address",
            "budget_min", "budget_max", "currency",
            "scheduled_at",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        bmin = attrs.get("budget_min")
        bmax = attrs.get("budget_max")
        if bmin is not None and bmax is not None and bmin > bmax:
            raise serializers.ValidationError(
                {"budget_min": "Buxheti minimal nuk mund të jetë më i madh se ai maksimal."},
            )
        return attrs


# ---------------------------------------------------------------------------
# Open jobs (freelancer browsing)
# ---------------------------------------------------------------------------

class OpenJobListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    customer_name = serializers.CharField(source="customer.first_name", read_only=True)
    quote_count = serializers.IntegerField(source="quotes.count", read_only=True)

    class Meta:
        model = JobRequest
        fields = (
            "id", "title",
            "category", "city",
            "budget_min", "budget_max", "currency",
            "scheduled_at", "created_at",
            "customer_name",
            "quote_count",
        )


class OpenJobDetailSerializer(serializers.ModelSerializer):
    """Freelancer's view of a job. Includes the freelancer's own quote (if any)."""
    category = CategorySerializer(read_only=True)
    customer_id = serializers.IntegerField(source="customer.id", read_only=True)
    customer_name = serializers.CharField(source="customer.first_name", read_only=True)
    quote_count = serializers.IntegerField(source="quotes.count", read_only=True)
    my_quote = serializers.SerializerMethodField()

    class Meta:
        model = JobRequest
        fields = (
            "id", "title", "description",
            "category", "city", "address",
            "budget_min", "budget_max", "currency",
            "status",
            "scheduled_at", "created_at",
            "customer_id", "customer_name",
            "quote_count",
            "my_quote",
        )

    def get_my_quote(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return None
        try:
            profile = request.user.freelancer_profile
        except Exception:
            return None
        q = obj.quotes.filter(freelancer=profile).first()
        return MyQuoteSerializer(q).data if q else None


# ---------------------------------------------------------------------------
# Reviews
# ---------------------------------------------------------------------------

class ReviewPublicSerializer(serializers.ModelSerializer):
    reviewer_first_name = serializers.CharField(source="reviewer.first_name", read_only=True)
    job_title = serializers.CharField(source="job.title", read_only=True)
    job_category = serializers.CharField(source="job.category.name", read_only=True)

    class Meta:
        model = Review
        fields = (
            "id", "rating", "comment", "created_at",
            "reviewer_first_name",
            "job_title", "job_category",
        )


class ReviewWriteSerializer(serializers.Serializer):
    job_id = serializers.IntegerField()
    rating = serializers.IntegerField(min_value=1, max_value=5)
    comment = serializers.CharField(required=False, allow_blank=True, max_length=2000)
