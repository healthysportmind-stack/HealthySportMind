from django.urls import path


from .views import SubmitCheckInView, TodayCheckInView, LastCheckInView, WeeklyCheckInView, MonthlyCheckInView,LongTermInsightsListView

urlpatterns = [
    path("submit/", SubmitCheckInView.as_view(), name="submit-checkin"),
    path("today/", TodayCheckInView.as_view(), name="today-checkin"),
    path("last/", LastCheckInView.as_view(), name="last-checkin"),
    path("weekly/", WeeklyCheckInView.as_view()),
    path("monthly/", MonthlyCheckInView.as_view()),
    path("insights/long-term/", LongTermInsightsListView.as_view()),

]