from rest_framework import serializers
from ..models import CheckIn
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