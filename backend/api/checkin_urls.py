from django.urls import path
from .views import SubmitCheckInView, TodayCheckInView, LastCheckInView

urlpatterns = [
    path("submit/", SubmitCheckInView.as_view(), name="submit-checkin"),
    path("today/", TodayCheckInView.as_view(), name="today-checkin"),
    path("last/", LastCheckInView.as_view(), name="last-checkin"),
]