from rest_framework import serializers
from .models import TestUpload, Ingredient, User

class TestUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestUpload
        fields = '__all__'


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'user']
        extra_kwargs = {
            'user': {'read_only': True}  # Ensure 'user' is set automatically
        }

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']