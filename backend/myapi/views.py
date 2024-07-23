from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TestUpload
from .serializers import TestUploadSerializer
from django.shortcuts import render

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