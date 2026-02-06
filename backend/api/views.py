from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

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