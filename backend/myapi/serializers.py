from rest_framework import serializers
from .models import TestUpload

class TestUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestUpload
        fields = '__all__'
