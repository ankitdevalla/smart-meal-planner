from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from .models import TestUpload, Ingredient
from .serializers import TestUploadSerializer, IngredientSerializer
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
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

@csrf_exempt
def google_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        name = data.get('name')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # If the user does not exist, create a new user
            user = User.objects.create_user(username=email, email=email, password=None, first_name=name)
        
        # Authenticate and log in the user
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        login(request, user)
        return JsonResponse({'message': 'Google login successful', 'email': user.email})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer