from django.urls import path
from .performance_views import PerformanceLogListCreateView

urlpatterns = [
    path('logs/', PerformanceLogListCreateView.as_view(), name='performance-log-list-create'),
]
