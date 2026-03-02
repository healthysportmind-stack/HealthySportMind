from django.urls import path
from .views import ProfileMeView, ProfileUpdateView

urlpatterns = [
    path("me/", ProfileMeView.as_view(), name="profile-me"),
    path("update/", ProfileUpdateView.as_view(), name="profile-update"),
]