from rest_framework import serializers
from .models import TestUpload, Ingredient

class TestUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestUpload
        fields = '__all__'


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'