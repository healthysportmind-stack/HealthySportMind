from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
import requests
import feedparser
from bs4 import BeautifulSoup
from django.http import JsonResponse
from datetime import date
from rest_framework.permissions import IsAuthenticated
from .serializers.checkinSerializers import CheckInSerializer
from .models import CheckIn
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from django.utils import timezone

from .models import Profile, CheckIn
from .serializers.profileSerializer import ProfileSerializer
from .services.message_generator import generate_post_checkin_message

class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=400)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )

        Profile.objects.create(user=user)

        return Response({"message": "User created successfully"}, status=201)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(username=email, password=password)

        if user is None:
            return Response({"error": "Invalid email or password"}, status=400)

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "message": "Login successful"
        }, status=200)

def extract_image(entry):
    media = entry.get("media_content")
    if media and isinstance(media, list):
        return media[0].get("url")

    enclosure = entry.get("enclosures")
    if enclosure and len(enclosure) > 0:
        return enclosure[0].get("href")

    html = entry.get("content", [{}])[0].get("value") or entry.get("description", "")
    soup = BeautifulSoup(html, "html.parser")
    img = soup.find("img")
    if img and img.get("src"):
        return img["src"]

    return None


def rss_proxy(request):
    url = request.GET.get("url")
    if not url:
        return JsonResponse({"error": "Missing ?url="}, status=400)

    try:
        resp = requests.get(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"},
            timeout=10
        )

        feed = feedparser.parse(resp.content)

        items = []
        for entry in feed.entries:
            items.append({
                "title": entry.get("title"),
                "link": entry.get("link"),
                "published": entry.get("published", None),
                "summary": entry.get("summary", None),
                "image": extract_image(entry),
            })

        return JsonResponse({
            "feed_title": feed.feed.get("title"),
            "feed_link": feed.feed.get("link"),
            "items": items
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


class SubmitCheckInView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
       # print("AUTH HEADER:", request.headers.get("Authorization"))
       # print("USER:", request.user)
       # print("DATA RECEIVED:", request.data)
        serializer = CheckInSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            checkin = serializer.save(user=request.user)

            message = generate_post_checkin_message(checkin)
            checkin.post_message = message
            checkin.save()
            return Response({
                "checkin": CheckInSerializer(checkin).data,
                "message": message
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TodayCheckInView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        checkin = CheckIn.objects.filter(
            user=request.user,
            created_at__date=today
        ).first()

        if not checkin:
            return Response({"exists": False})

        return Response({
            "exists": True,
            "checkin": CheckInSerializer(checkin).data
        })


class LastCheckInView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        last = CheckIn.objects.filter(user=request.user).order_by("-created_at").first()

        if not last:
            return Response({"exists": False})

        return Response({
            "exists": True,
            "checkin": CheckInSerializer(last).data
        })


class ProfileMeView(generics.RetrieveAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile


class ProfileUpdateView(generics.UpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile
