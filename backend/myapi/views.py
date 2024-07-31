import os
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, generics
from rest_framework.permissions import IsAuthenticated
from .models import TestUpload, Ingredient
from .serializers import TestUploadSerializer, IngredientSerializer, UserSerializer
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework_simplejwt.tokens import RefreshToken
import json


@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello, world!'})

# API View to handle file upload and retrieval
class TestUploadView(APIView):
    def post(self, request):
        serializer = TestUploadSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        uploads = TestUpload.objects.all()
        serializer = TestUploadSerializer(uploads, many=True)
        return Response(serializer.data)

# View to render the upload form
def upload_form(request):
    return render(request, 'test_upload.html')

@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if not username or not email or not password:
            return JsonResponse({'error': 'Please provide all fields'}, status=400)
        try:
            user = User.objects.create_user(username, email, password)
            return JsonResponse({'message': 'User created successfully'}, status=201)
        except:
            return JsonResponse({'error': 'Username or email already exists'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login successful', 'email': user.email})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@api_view(['POST'])
def google_login(request):
    try:
        # Get the token sent by the frontend
        token = request.data.get('token')
        # Specify the CLIENT_ID of the app that accesses the backend
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), os.getenv('REACT_APP_GOOGLE_CLIENT_ID'))

        # ID token is valid, get the user's Google Account ID from the decoded token
        google_user_id = idinfo['sub']
        email = idinfo['email']
        name = idinfo.get('name', '')
        
        # Check if user exists, if not create one
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = User.objects.create_user(username=email, email=email, first_name=name)
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({'access': access_token, 'refresh': str(refresh), 'user_id': user.id}, status=status.HTTP_200_OK)
    except ValueError as e:
        # Invalid token
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
    
class IngredientViewSet(viewsets.ModelViewSet):
    serializer_class = IngredientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ingredient.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Ensure all required fields are validated and provided
        serializer.save(user=self.request.user)

class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]