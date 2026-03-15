from rest_framework import serializers
from ..models import PerformanceLog

class PerformanceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerformanceLog
        fields = ['id', 'user', 'moods', 'performance_rating', 'comments', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def validate_moods(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Moods must be a list of strings.")
        if len(value) > 3:
            raise serializers.ValidationError("You can only select up to 3 moods.")
        return value
