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
from api.utils.ai import rewrite_message_tone

from .models import Profile, CheckIn, Feedback
from .serializers.profileSerializer import ProfileSerializer
from .serializers.checkinSerializers import FeedbackSerializer
from .services.message_generator import generate_post_checkin_message
from datetime import datetime, time
from django.utils import timezone


class RegisterView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")
        name = request.data.get("name", "")

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=400)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )

        Profile.objects.create(user=user,name=name)

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

        profile = ProfileSerializer(user.profile).data
        print("PROFILE DATA:", profile)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "profile": profile,
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

            base_message = generate_post_checkin_message(checkin)
            #checkin.post_message=base_message # this is to test without ai. comment out the next 6 lines.
            #change base final_message to base_message in line 136
            tone=getattr(request.user.profile, "preferred_tone", "neutral")
            try:
                final_message=rewrite_message_tone(base_message,tone)
            except Exception as e:
                print("AI REWRITE ERROR:", e)
                final_message = base_message
            checkin.post_message = final_message
            checkin.save()



            feedback_text = request.data.get("feedback_message")
            feedback_category = request.data.get("feedback_category")

            saved_feedback = None

            if feedback_text:
                feedback_serializer = FeedbackSerializer(data={
                    "checkin": checkin.id,
                    "message": feedback_text,
                    "category": feedback_category or "other",
                })
                feedback_serializer.is_valid(raise_exception=True)
                saved_feedback = feedback_serializer.save(user=request.user)


            return Response({
                "checkin": CheckInSerializer(checkin).data,
                "message": final_message
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TodayCheckInView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.localdate()
        start = timezone.make_aware(datetime.combine(today, time.min))
        end = timezone.make_aware(datetime.combine(today, time.max))
        checkin = CheckIn.objects.filter(
            user=request.user,
            created_at__range=(start, end)
        ).first()

        if not checkin:
            return Response({"exists": False})

        feedback = Feedback.objects.filter(checkin=checkin).first()
        feedback_data = FeedbackSerializer(feedback).data if feedback else None

        return Response({
            "exists": True,
            "checkin": CheckInSerializer(checkin).data,
            "feedback": feedback_data
        })

class LastCheckInView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        last = CheckIn.objects.filter(user=request.user).order_by("-created_at").first()

        if not last:
            return Response({"exists": False})

        feedback = Feedback.objects.filter(checkin=last).first()
        feedback_data = FeedbackSerializer(feedback).data if feedback else None

        return Response({
            "exists": True,
            "checkin": CheckInSerializer(last).data,
            "feedback": feedback_data
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

# views.py

class SubmitFeedbackView(APIView):
    def post(self, request):
        serializer = FeedbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        feedback = serializer.save(user=request.user)

        return Response({
            "status": "success",
            "feedback": FeedbackSerializer(feedback).data
        })

