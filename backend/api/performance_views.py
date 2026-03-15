from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import PerformanceLog
from .serializers.performanceSerializers import PerformanceLogSerializer

class PerformanceLogListCreateView(generics.ListCreateAPIView):
    serializer_class = PerformanceLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PerformanceLog.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
