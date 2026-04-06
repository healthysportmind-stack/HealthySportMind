from rest_framework import serializers
from ..models import CheckIn, Feedback
from django.utils import timezone

class CheckInSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckIn
        fields = "__all__"
        read_only_fields = ("user", "created_at", "updated_at")

    def validate(self, data):
        user = self.context["request"].user
        today = timezone.localdate()

        if CheckIn.objects.filter(user=user, created_at__date=today).exists():
            raise serializers.ValidationError("You already submitted a check-in today.")

        return data

    def validate_sleep_hours(self, value):
        if value is None:
            raise serializers.ValidationError("Sleep hours is required.")
        if value == "":
            raise serializers.ValidationError("Sleep hours cannot be empty.")
        try:
            value = float(value)
        except:
            raise serializers.ValidationError("Sleep hours must be a number.")
        if value <= 0:
            raise serializers.ValidationError("Sleep hours must be greater than zero.")
        if value > 18:
            raise serializers.ValidationError("Sleep hours must be less than 18.")
        return value
class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = "__all__"
        read_only_fields = ("user", "created_at")
