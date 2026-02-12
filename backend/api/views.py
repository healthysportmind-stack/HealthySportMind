from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
import requests
import feedparser
from bs4 import BeautifulSoup
from django.http import JsonResponse


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

        return Response({"message": "User created successfully"}, status=201)







class LoginView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(username=email, password=password)

        if user is None:
            return Response({"error": "Invalid email or password"}, status=400)

        return Response({"message": "Login successful"}, status=200)








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





