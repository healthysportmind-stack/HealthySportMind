from django.urls import path
from .views import rss_proxy

urlpatterns = [
    path("rss/", rss_proxy),
]